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
import { CommitmentService } from '../service/commitment.service';
import { CreateCommitmentDto } from '../dto/create-commitment.dto';
import { UpdateCommitmentDto } from '../dto/update-commitment.dto';
import { CommitmentStatus } from '../database/entities/commitment.entity';

@Controller('commitments')
export class CommitmentController {
    constructor(private readonly commitmentService: CommitmentService) { }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    create(@Body() dto: CreateCommitmentDto) {
        return this.commitmentService.create(dto);
    }

    @Get()
    findAll(
        @Query('period_id') period_id?: string,
        @Query('service_id') service_id?: string,
        @Query('status') status?: CommitmentStatus,
    ) {
        return this.commitmentService.findAll({ period_id, service_id, status });
    }

    @Get('opcr-export')
    opcr(@Query('period_id', ParseUUIDPipe) period_id: string) {
        return this.commitmentService.findLockedByPeriod(period_id);
    }

    @Get(':id')
    findOne(@Param('id', ParseUUIDPipe) id: string) {
        return this.commitmentService.findOne(id);
    }

    @Patch(':id')
    update(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() dto: UpdateCommitmentDto,
    ) {
        return this.commitmentService.update(id, dto);
    }

    @Patch(':id/submit')
    submit(@Param('id', ParseUUIDPipe) id: string) {
        return this.commitmentService.submit(id);
    }

    @Delete(':id')
    remove(@Param('id', ParseUUIDPipe) id: string) {
        return this.commitmentService.remove(id);
    }
}