import {
    Controller,
    Get,
    Post,
    Patch,
    Body,
    Param,
    Query,
    ParseUUIDPipe,
    HttpCode,
    HttpStatus,
} from '@nestjs/common';
import { OfficeUserService } from '../service/office-user.service';
import { CreateOfficeUserDto } from '../dto/create-office-user.dto';
import { UpdateOfficeUserDto } from '../dto/update-office-user.dto';
import { UserRole } from '../database/entities/office-user.entity';

@Controller('users')
export class OfficeUserController {
    constructor(private readonly userService: OfficeUserService) { }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    create(@Body() dto: CreateOfficeUserDto) {
        return this.userService.create(dto);
    }

    @Get()
    findAll(@Query('role') role?: UserRole) {
        return this.userService.findAll(role);
    }

    @Get(':id')
    findOne(@Param('id', ParseUUIDPipe) id: string) {
        return this.userService.findOne(id);
    }

    @Patch(':id')
    update(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() dto: UpdateOfficeUserDto,
    ) {
        return this.userService.update(id, dto);
    }

    @Patch(':id/suspend')
    suspend(@Param('id', ParseUUIDPipe) id: string) {
        return this.userService.suspend(id);
    }
}
