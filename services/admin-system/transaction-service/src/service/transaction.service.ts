import {
    Injectable,
    NotFoundException,
    ForbiddenException,
    BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
    Transaction,
    TransactionStatus,
    DocStatus,
} from '../database/entities/transaction.entity';
import { CreateTransactionDto } from '../dto/create-transaction.dto';
import { UpdateTransactionDto } from '../dto/update-transaction.dto';
import { UpdateDocStatusDto } from '../dto/update-doc-status.dto';

@Injectable()
export class TransactionService {
    constructor(
        @InjectRepository(Transaction)
        private readonly transactionRepo: Repository<Transaction>,
    ) { }

    async create(dto: CreateTransactionDto): Promise<Transaction> {
        const now = new Date();
        const transaction = this.transactionRepo.create({
            ...dto,
            date: dto.date ? new Date(dto.date) : now,
            // time_in is auto-set via @CreateDateColumn — do not set manually
            status: TransactionStatus.PENDING,
            doc_status: DocStatus.INCOMPLETE,
            is_locked: false,
        });
        return this.transactionRepo.save(transaction);
    }

    async findAll(filters?: {
        period_id?: string;
        service_id?: string;
        logged_by?: string;
    }): Promise<Transaction[]> {
        const where: any = {};
        if (filters?.period_id) where.period_id = filters.period_id;
        if (filters?.service_id) where.service_id = filters.service_id;
        if (filters?.logged_by) where.logged_by = filters.logged_by;
        return this.transactionRepo.find({ where, order: { time_in: 'DESC' } });
    }

    async findOne(id: string): Promise<Transaction> {
        const tx = await this.transactionRepo.findOne({
            where: { transaction_id: id },
        });
        if (!tx) throw new NotFoundException(`Transaction ${id} not found.`);
        return tx;
    }

    // ─── TASK 6: doc_status update ───────────────────────────────────────────
    // SLA clock does NOT start until doc_status is set to COMPLETE
    async updateDocStatus(id: string, dto: UpdateDocStatusDto): Promise<Transaction> {
        const tx = await this.findOne(id);

        if (tx.is_locked) {
            throw new ForbiddenException('Transaction is locked and cannot be modified.');
        }

        tx.doc_status = dto.doc_status;

        // If doc_status is set to COMPLETE and time_in has no SLA start recorded,
        // we mark it here so SLA clock begins from this point
        if (dto.doc_status === DocStatus.COMPLETE && !tx.time_out) {
            // Reset time_in to now so SLA clock starts from document completion
            tx.time_in = new Date();
        }

        return this.transactionRepo.save(tx);
    }

    // ─── TASK 5: SLA Engine ──────────────────────────────────────────────────
    // SLA is computed only when status = COMPLETED and doc_status = COMPLETE
    async updateStatus(id: string, dto: UpdateTransactionDto): Promise<Transaction> {
        const tx = await this.findOne(id);

        if (tx.is_locked) {
            throw new ForbiddenException('Transaction is locked and cannot be modified.');
        }

        if (tx.status === TransactionStatus.COMPLETED) {
            throw new ForbiddenException(
                'This transaction is already completed and its record is locked.',
            );
        }

        // Cannot complete if doc_status is not COMPLETE
        if (dto.status === TransactionStatus.COMPLETED && tx.doc_status !== DocStatus.COMPLETE) {
            throw new BadRequestException(
                'Cannot complete transaction. Document status must be set to "complete" first.',
            );
        }

        tx.status = dto.status;
        if (dto.remarks !== undefined) tx.remarks = dto.remarks;

        // ── SLA Engine ──
        if (dto.status === TransactionStatus.COMPLETED) {
            tx.time_out = new Date();

            // Compute processing_time in minutes
            const diffMs = tx.time_out.getTime() - tx.time_in.getTime();
            tx.processing_time = Math.round(diffMs / 60000);

            // Fetch SLA target from service-catalog-service
            // Since microservices don't share DB, pass sla_target in the DTO
            if (dto.sla_target !== undefined) {
                tx.sla_compliant = tx.processing_time <= dto.sla_target;
            }

            // Lock the transaction — immutable history
            tx.is_locked = true;
        }

        return this.transactionRepo.save(tx);
    }

    async findByPeriod(period_id: string): Promise<Transaction[]> {
        return this.transactionRepo.find({
            where: { period_id },
            order: { date: 'ASC', time_in: 'ASC' },
        });
    }

    async getSummaryByPeriod(period_id: string): Promise<any[]> {
        return this.transactionRepo
            .createQueryBuilder('t')
            .select('t.service_id', 'service_id')
            .addSelect('t.status', 'status')
            .addSelect('COUNT(*)', 'count')
            .addSelect('AVG(t.processing_time)', 'avg_processing_time')
            .addSelect(
                'SUM(CASE WHEN t.sla_compliant = true THEN 1 ELSE 0 END)',
                'sla_compliant_count',
            )
            .where('t.period_id = :period_id', { period_id })
            .groupBy('t.service_id, t.status')
            .getRawMany();
    }
}
