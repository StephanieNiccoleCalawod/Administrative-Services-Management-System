import { PartialType } from '@nestjs/mapped-types';
import { IsEnum, IsOptional } from 'class-validator';
import { CreatePeriodDto } from './create-period.dto';
import { PeriodStatus } from '../database/entities/period.entity';

export class UpdatePeriodDto extends PartialType(CreatePeriodDto) { }

export class ClosePeriodDto {
    @IsEnum(PeriodStatus)
    status: PeriodStatus;
}
