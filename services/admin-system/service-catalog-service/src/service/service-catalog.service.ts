import {
    Injectable,
    NotFoundException,
    ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { Service, ServiceClassification } from '../database/entities/service.entity';
import { CreateServiceDto } from '../dto/create-service.dto';
import { UpdateServiceDto } from '../dto/update-service.dto';

@Injectable()
export class ServiceCatalogService {
    constructor(
        @InjectRepository(Service)
        private readonly serviceRepo: Repository<Service>,
    ) { }

    async create(dto: CreateServiceDto): Promise<Service> {
        const existing = await this.serviceRepo.findOne({ where: { name: dto.name } });
        if (existing) {
            throw new ConflictException(`A service named "${dto.name}" already exists.`);
        }
        const service = this.serviceRepo.create(dto);
        return this.serviceRepo.save(service);
    }

    async findAll(classification?: ServiceClassification, name?: string): Promise<Service[]> {
        const where: any = {};
        if (classification) where.classification = classification;
        if (name) where.name = ILike(`%${name}%`);
        return this.serviceRepo.find({ where, order: { created_at: 'ASC' } });
    }

    async findAllActive(classification?: ServiceClassification, name?: string): Promise<Service[]> {
        const where: any = { is_active: true };
        if (classification) where.classification = classification;
        if (name) where.name = ILike(`%${name}%`);
        return this.serviceRepo.find({ where, order: { name: 'ASC' } });
    }

    async findOne(id: string): Promise<Service> {
        const service = await this.serviceRepo.findOne({ where: { service_id: id } });
        if (!service) throw new NotFoundException(`Service ${id} not found.`);
        return service;
    }

    async update(id: string, dto: UpdateServiceDto): Promise<Service> {
        const service = await this.findOne(id);
        Object.assign(service, dto);
        return this.serviceRepo.save(service);
    }

    async setNaStatus(id: string, isActive: boolean): Promise<Service> {
        const service = await this.findOne(id);
        service.is_active = isActive;
        return this.serviceRepo.save(service);
    }

    async remove(id: string): Promise<{ message: string }> {
        const service = await this.findOne(id);
        await this.serviceRepo.remove(service);
        return { message: `Service "${service.name}" removed from catalogue.` };
    }
}
