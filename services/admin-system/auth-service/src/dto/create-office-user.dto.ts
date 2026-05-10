import { IsString, IsEmail, IsEnum, IsOptional } from 'class-validator';
import { UserRole, UserStatus } from '../database/entities/office-user.entity';

export class CreateOfficeUserDto {
    @IsString()
    name: string;

    @IsEmail()
    email: string;

    @IsEnum(UserRole)
    role: UserRole;

    @IsOptional()
    @IsEnum(UserStatus)
    status?: UserStatus;
}