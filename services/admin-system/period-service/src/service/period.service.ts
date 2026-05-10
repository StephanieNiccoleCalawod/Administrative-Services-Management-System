import {
    Injectable,
    NotFoundException,
    ConflictException,
    BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Period, PeriodStatus } from '../database/entities/period.entity';
import { CreatePeriodDto } from '../dto/create-period.dto';
import { UpdatePeriodDto } from '../dto/update-period.dto';

@Injectable()
export class PeriodService {
    constructor(
        @InjectRepository(Period)
        private readonly periodRepo: Repository<Period>,
    ) { }

    async create(dto: CreatePeriodDto): Promise<Period> {
        if (dto.status === PeriodStatus.ACTIVE || !dto.status) {
            const activeExists = await this.periodRepo.findOne({
                where: { status: PeriodStatus.ACTIVE },
            });
            if (activeExists) {
                throw new ConflictException(
                    `Period "${activeExists.name}" is currently ACTIVE. Close it before creating a new one.`,
                );
            }
        }

        if (new Date(dto.start_date) >= new Date(dto.end_date)) {
            throw new BadRequestException('start_date must be before end_date.');
        }

        const period = this.periodRepo.create({
            ...dto,
            status: dto.status ?? PeriodStatus.ACTIVE,
        });
        return this.periodRepo.save(period);
    }

    async findAll(): Promise<Period[]> {
        return this.periodRepo.find({ order: { start_date: 'DESC' } });
    }

    async findActive(): Promise<Period | null> {
        return this.periodRepo.findOne({ where: { status: PeriodStatus.ACTIVE } });
    }

    async findOne(id: string): Promise<Period> {
        const period = await this.periodRepo.findOne({ where: { period_id: id } });
        if (!period) throw new NotFoundException(`Period ${id} not found.`);
        return period;
    }

    async update(id: string, dto: UpdatePeriodDto): Promise<Period> {
        const period = await this.findOne(id);
        if (period.status === PeriodStatus.CLOSED) {
            throw new ConflictException('Closed periods cannot be modified.');
        }
        Object.assign(period, dto);
        return this.periodRepo.save(period);
    }

    async close(id: string): Promise<Period> {
        const period = await this.findOne(id);
        if (period.status === PeriodStatus.CLOSED) {
            throw new ConflictException('Period is already closed.');
        }
        period.status = PeriodStatus.CLOSED;
        return this.periodRepo.save(period);
    }
}
