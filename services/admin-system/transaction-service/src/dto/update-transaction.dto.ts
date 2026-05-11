import { IsEnum, IsOptional, IsString, IsNumber, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TransactionStatus } from '../database/entities/transaction.entity';

export class UpdateTransactionDto {
    @ApiProperty({ enum: TransactionStatus })
    @IsEnum(TransactionStatus)
    status: TransactionStatus;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    remarks?: string;

    // Pass the service's SLA target (in minutes) so the engine can compute sla_compliant
    // Get this from service-catalog-service before calling this endpoint
    @ApiPropertyOptional({ description: 'SLA target in minutes from service catalog' })
    @IsOptional()
    @IsNumber()
    @Min(1)
    sla_target?: number;
}
