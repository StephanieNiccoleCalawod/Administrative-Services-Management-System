import { IsEnum, IsOptional, IsString, IsUUID, IsObject } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AuditAction, AuditEntity } from '../database/entities/audit-log-entity';

export class CreateAuditLogDto {
    @ApiPropertyOptional()
    @IsOptional()
    @IsUUID()
    actor_id?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    actor_name?: string;

    @ApiProperty({ enum: AuditAction })
    @IsEnum(AuditAction)
    action: AuditAction;

    @ApiProperty({ enum: AuditEntity })
    @IsEnum(AuditEntity)
    entity: AuditEntity;

    @ApiPropertyOptional()
    @IsOptional()
    @IsUUID()
    entity_id?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsObject()
    before_state?: Record<string, any>;

    @ApiPropertyOptional()
    @IsOptional()
    @IsObject()
    after_state?: Record<string, any>;
}
