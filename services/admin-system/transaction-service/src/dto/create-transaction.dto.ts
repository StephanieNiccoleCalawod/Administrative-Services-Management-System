import {
  IsString,
  IsEnum,
  IsUUID,
  IsOptional,
  IsBoolean,
  IsDateString,
} from 'class-validator';
import { ClientType } from '../database/entities/transaction.entity';
 
export class CreateTransactionDto {
  @IsUUID()
  service_id: string;
 
  @IsUUID()
  period_id: string;
 
  @IsOptional()
  @IsString()
  transaction_log?: string;
 
  @IsUUID()
  logged_by: string;
 
  @IsOptional()
  @IsDateString()
  date?: string;
 
  @IsString()
  client_name: string;
 
  @IsEnum(ClientType)
  client_type: ClientType;
 
  @IsOptional()
  @IsString()
  remarks?: string;
 
  @IsOptional()
  @IsBoolean()
  is_referred?: boolean;
}