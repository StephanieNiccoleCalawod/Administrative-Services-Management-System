import { IsEnum, IsOptional, IsString } from 'class-validator';
import { UserStatus } from '../database/entities/office-user.entity';

export class UpdateOfficeUserDto {
    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    @IsEnum(UserStatus)
    status?: UserStatus;
}