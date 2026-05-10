import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, FindOptionsWhere } from 'typeorm';
import { AuditLog, AuditAction, AuditEntity } from '../database/entities/audit-log-entity';
import { CreateAuditLogDto } from '../dto/create-audit-log.dto';
import { QueryAuditLogDto } from '../dto/query-audit-log-dto';

@Injectable()
export class AuditService {
    constructor(
        @InjectRepository(AuditLog)
        private readonly auditRepo: Repository<AuditLog>,
    ) {}

    // Called by other services to log a change — append only
    async log(dto: CreateAuditLogDto): Promise<AuditLog> {
        const entry = this.auditRepo.create(dto);
        return this.auditRepo.save(entry);
    }

    async findAll(query: QueryAuditLogDto): Promise<AuditLog[]> {
        const where: FindOptionsWhere<AuditLog> = {};

        if (query.action) where.action = query.action;
        if (query.entity) where.entity = query.entity;
        if (query.actor_name) where.actor_name = query.actor_name;

        if (query.start_date && query.end_date) {
            where.timestamp = Between(
                new Date(query.start_date),
                new Date(query.end_date),
            );
        }

        return this.auditRepo.find({
            where,
            order: { timestamp: 'DESC' },
        });
    }

    async exportCsv(query: QueryAuditLogDto): Promise<string> {
        const logs = await this.findAll(query);

        const header = [
            'audit_log_id',
            'actor_id',
            'actor_name',
            'action',
            'entity',
            'entity_id',
            'before_state',
            'after_state',
            'timestamp',
        ].join(',');

        const rows = logs.map((log) =>
            [
                log.audit_log_id,
                log.actor_id ?? '',
                log.actor_name ?? '',
                log.action,
                log.entity,
                log.entity_id ?? '',
                JSON.stringify(log.before_state ?? {}),
                JSON.stringify(log.after_state ?? {}),
                log.timestamp.toISOString(),
            ]
                .map((val) => `"${String(val).replace(/"/g, '""')}"`)
                .join(','),
        );

        return [header, ...rows].join('\n');
    }
}
