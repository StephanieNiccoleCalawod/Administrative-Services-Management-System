import { PartialType } from '@nestjs/mapped-types';
import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { CreateServiceDto } from './create-service.dto';

export class UpdateServiceDto extends PartialType(CreateServiceDto) { }

export class SetServiceNaDto {
    @IsBoolean()
    is_active: boolean;

    @IsOptional()
    @IsString()
    reason?: string;
}