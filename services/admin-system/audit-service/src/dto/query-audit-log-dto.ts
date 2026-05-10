import { IsEnum, IsOptional, IsString, IsDateString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { AuditAction, AuditEntity } from '../database/entities/audit-log-entity';

export class QueryAuditLogDto {
    @ApiPropertyOptional()
    @IsOptional()
    @IsDateString()
    start_date?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsDateString()
    end_date?: string;

    @ApiPropertyOptional({ enum: AuditAction })
    @IsOptional()
    @IsEnum(AuditAction)
    action?: AuditAction;

    @ApiPropertyOptional({ enum: AuditEntity })
    @IsOptional()
    @IsEnum(AuditEntity)
    entity?: AuditEntity;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    actor_name?: string;
}
