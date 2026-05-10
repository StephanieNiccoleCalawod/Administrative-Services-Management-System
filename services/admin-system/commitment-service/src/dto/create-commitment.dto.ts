import {
    IsUUID,
    IsEnum,
    IsNumber,
    IsOptional,
    IsString,
    Min,
} from 'class-validator';
import { TargetUnit } from '../database/entities/commitment.entity';

export class CreateCommitmentDto {
    @IsUUID()
    service_id: string;

    @IsUUID()
    period_id: string;

    @IsUUID()
    created_by: string;

    @IsEnum(TargetUnit)
    target_unit: TargetUnit;

    @IsNumber()
    @Min(0)
    target_value: number;

    @IsOptional()
    @IsString()
    success_indicator?: string;

    @IsOptional()
    @IsString()
    timeline?: string;
}