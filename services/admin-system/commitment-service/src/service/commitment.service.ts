import {
    Injectable,
    NotFoundException,
    ForbiddenException,
    ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
    Commitment,
    CommitmentStatus,
} from '../database/entities/commitment.entity';
import { CreateCommitmentDto } from '../dto/create-commitment.dto';
import { UpdateCommitmentDto } from '../dto/update-commitment.dto';

@Injectable()
export class CommitmentService {
    constructor(
        @InjectRepository(Commitment)
        private readonly commitmentRepo: Repository<Commitment>,
    ) { }

    async create(dto: CreateCommitmentDto): Promise<Commitment> {
        const existing = await this.commitmentRepo.findOne({
            where: { service_id: dto.service_id, period_id: dto.period_id },
        });
        if (existing) {
            throw new ConflictException(
                'A commitment for this service and period already exists.',
            );
        }
        const commitment = this.commitmentRepo.create({
            ...dto,
            status: CommitmentStatus.DRAFT,
        });
        return this.commitmentRepo.save(commitment);
    }

    async findAll(filters?: {
        period_id?: string;
        service_id?: string;
        status?: CommitmentStatus;
    }): Promise<Commitment[]> {
        const where: any = {};
        if (filters?.period_id) where.period_id = filters.period_id;
        if (filters?.service_id) where.service_id = filters.service_id;
        if (filters?.status) where.status = filters.status;
        return this.commitmentRepo.find({ where, order: { created_at: 'ASC' } });
    }

    async findOne(id: string): Promise<Commitment> {
        const c = await this.commitmentRepo.findOne({ where: { commitment_id: id } });
        if (!c) throw new NotFoundException(`Commitment ${id} not found.`);
        return c;
    }

    async update(id: string, dto: UpdateCommitmentDto): Promise<Commitment> {
        const commitment = await this.findOne(id);
        if (commitment.status !== CommitmentStatus.DRAFT) {
            throw new ForbiddenException('Only DRAFT commitments can be revised.');
        }
        Object.assign(commitment, dto);
        return this.commitmentRepo.save(commitment);
    }

    async submit(id: string): Promise<Commitment> {
        const commitment = await this.findOne(id);
        if (commitment.status !== CommitmentStatus.DRAFT) {
            throw new ForbiddenException('Only DRAFT commitments can be submitted.');
        }
        commitment.status = CommitmentStatus.LOCKED;
        return this.commitmentRepo.save(commitment);
    }

    async findLockedByPeriod(period_id: string): Promise<Commitment[]> {
        return this.commitmentRepo.find({
            where: { period_id, status: CommitmentStatus.LOCKED },
            order: { created_at: 'ASC' },
        });
    }

    async remove(id: string): Promise<{ message: string }> {
        const commitment = await this.findOne(id);
        if (commitment.status !== CommitmentStatus.DRAFT) {
            throw new ForbiddenException('Only DRAFT commitments can be deleted.');
        }
        await this.commitmentRepo.remove(commitment);
        return { message: 'Draft commitment deleted.' };
    }
}
