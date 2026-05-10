import { IsString, IsEnum, IsOptional, IsNumber, IsBoolean, Min } from 'class-validator';
import {
    ServiceClassification,
    ServiceType,
    ServiceCategory,
} from '../database/entities/service.entity';

export class CreateServiceDto {
    @IsString()
    name: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsNumber()
    @Min(1)
    total_processing_time?: number;

    @IsEnum(ServiceClassification)
    classification: ServiceClassification;

    @IsEnum(ServiceType)
    type: ServiceType;

    @IsEnum(ServiceCategory)
    category: ServiceCategory;

    @IsOptional()
    @IsBoolean()
    is_active?: boolean;
}
