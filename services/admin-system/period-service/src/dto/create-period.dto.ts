import { IsString, IsEnum, IsDateString, IsOptional } from 'class-validator';
import { PeriodType, PeriodStatus } from '../database/entities/period.entity';

export class CreatePeriodDto {
    @IsString()
    name: string;

    @IsEnum(PeriodType)
    period_type: PeriodType;

    @IsDateString()
    start_date: string;

    @IsDateString()
    end_date: string;

    @IsOptional()
    @IsEnum(PeriodStatus)
    status?: PeriodStatus;
}