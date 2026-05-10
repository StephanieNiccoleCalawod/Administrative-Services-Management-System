import { IsEnum, IsOptional, IsString } from 'class-validator';
import { TransactionStatus } from '../database/entities/transaction.entity';

export class UpdateTransactionDto {
    @IsEnum(TransactionStatus)
    status: TransactionStatus;

    @IsOptional()
    @IsString()
    remarks?: string;
}