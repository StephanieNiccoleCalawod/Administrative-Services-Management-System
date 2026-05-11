import {
    Controller,
    Get,
    Post,
    Patch,
    Delete,
    Body,
    Param,
    Query,
    ParseUUIDPipe,
    HttpCode,
    HttpStatus,
} from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';
import { ServiceCatalogService } from '../service/service-catalog.service';
import { CreateServiceDto } from '../dto/create-service.dto';
import { UpdateServiceDto, SetServiceNaDto } from '../dto/update-service.dto';
import { ServiceClassification } from '../database/entities/service.entity';

@Controller('services')
export class ServiceCatalogController {
    constructor(private readonly catalogService: ServiceCatalogService) { }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    create(@Body() dto: CreateServiceDto) {
        return this.catalogService.create(dto);
    }

    @Get()
    @ApiQuery({ name: 'classification', required: false, enum: ServiceClassification })
    @ApiQuery({ name: 'name', required: false, type: String })
    findAll(
        @Query('classification') classification?: ServiceClassification,
        @Query('name') name?: string,
    ) {
        return this.catalogService.findAll(classification, name);
    }

    @Get('active')
    @ApiQuery({ name: 'classification', required: false, enum: ServiceClassification })
    @ApiQuery({ name: 'name', required: false, type: String })
    findAllActive(
        @Query('classification') classification?: ServiceClassification,
        @Query('name') name?: string,
    ) {
        return this.catalogService.findAllActive(classification, name);
    }

    @Get(':id')
    findOne(@Param('id', ParseUUIDPipe) id: string) {
        return this.catalogService.findOne(id);
    }

    @Patch(':id')
    update(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() dto: UpdateServiceDto,
    ) {
        return this.catalogService.update(id, dto);
    }

    @Patch(':id/na-status')
    setNaStatus(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() dto: SetServiceNaDto,
    ) {
        return this.catalogService.setNaStatus(id, dto.is_active);
    }

    @Delete(':id')
    remove(@Param('id', ParseUUIDPipe) id: string) {
        return this.catalogService.remove(id);
    }
}
