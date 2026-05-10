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
} from '../database/entities/transaction.entity';
import { CreateTransactionDto } from '../dto/create-transaction.dto';
import { UpdateTransactionDto } from '../dto/update-transaction.dto';

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
            time_in: now,
            status: TransactionStatus.PENDING,
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

    async updateStatus(id: string, dto: UpdateTransactionDto): Promise<Transaction> {
        const tx = await this.findOne(id);

        if (tx.status === TransactionStatus.COMPLETED) {
            throw new ForbiddenException(
                'This transaction is already completed and its record is locked.',
            );
        }

        if (dto.status === TransactionStatus.COMPLETED && !tx.time_in) {
            throw new BadRequestException('Cannot complete a transaction without a valid time_in.');
        }

        tx.status = dto.status;
        if (dto.remarks !== undefined) tx.remarks = dto.remarks;

        if (dto.status === TransactionStatus.COMPLETED) {
            tx.time_out = new Date();
            const diffMs = tx.time_out.getTime() - tx.time_in.getTime();
            tx.processing_time = Math.round(diffMs / 60000);
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
            .where('t.period_id = :period_id', { period_id })
            .groupBy('t.service_id, t.status')
            .getRawMany();
    }
}
