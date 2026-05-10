import {
    Injectable,
    NotFoundException,
    ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OfficeUser, UserRole, UserStatus } from '../database/entities/office-user.entity';
import { CreateOfficeUserDto } from '../dto/create-office-user.dto';
import { UpdateOfficeUserDto } from '../dto/update-office-user.dto';

@Injectable()
export class OfficeUserService {
    constructor(
        @InjectRepository(OfficeUser)
        private readonly userRepo: Repository<OfficeUser>,
    ) { }

    async create(dto: CreateOfficeUserDto): Promise<OfficeUser> {
        const existing = await this.userRepo.findOne({ where: { email: dto.email } });
        if (existing) {
            throw new ConflictException(`User with email "${dto.email}" already exists in the local registry.`);
        }
        const user = this.userRepo.create({
            ...dto,
            status: dto.status ?? UserStatus.ACTIVE,
        });
        return this.userRepo.save(user);
    }

    async findAll(role?: UserRole): Promise<OfficeUser[]> {
        const where = role ? { role } : {};
        return this.userRepo.find({ where, order: { name: 'ASC' } });
    }

    async findOne(id: string): Promise<OfficeUser> {
        const user = await this.userRepo.findOne({ where: { office_user_id: id } });
        if (!user) throw new NotFoundException(`User ${id} not found in local registry.`);
        return user;
    }

    async update(id: string, dto: UpdateOfficeUserDto): Promise<OfficeUser> {
        const user = await this.findOne(id);
        Object.assign(user, dto);
        return this.userRepo.save(user);
    }

    async suspend(id: string): Promise<OfficeUser> {
        const user = await this.findOne(id);
        user.status = UserStatus.SUSPENDED;
        return this.userRepo.save(user);
    }
}