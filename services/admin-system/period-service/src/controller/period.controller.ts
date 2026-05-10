import {
    Controller,
    Get,
    Post,
    Patch,
    Body,
    Param,
    ParseUUIDPipe,
    HttpCode,
    HttpStatus,
} from '@nestjs/common';
import { PeriodService } from '../service/period.service';
import { CreatePeriodDto } from '../dto/create-period.dto';
import { UpdatePeriodDto } from '../dto/update-period.dto';

@Controller('periods')
export class PeriodController {
    constructor(private readonly periodService: PeriodService) { }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    create(@Body() dto: CreatePeriodDto) {
        return this.periodService.create(dto);
    }

    @Get()
    findAll() {
        return this.periodService.findAll();
    }

    @Get('active')
    findActive() {
        return this.periodService.findActive();
    }

    @Get(':id')
    findOne(@Param('id', ParseUUIDPipe) id: string) {
        return this.periodService.findOne(id);
    }

    @Patch(':id')
    update(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() dto: UpdatePeriodDto,
    ) {
        return this.periodService.update(id, dto);
    }

    @Patch(':id/close')
    close(@Param('id', ParseUUIDPipe) id: string) {
        return this.periodService.close(id);
    }
}
