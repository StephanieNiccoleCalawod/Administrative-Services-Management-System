import {
    Controller,
    Get,
    Post,
    Body,
    Query,
    Res,
    HttpCode,
    HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { AuditService } from '../service/audit.service';
import { CreateAuditLogDto } from '../dto/create-audit-log.dto';
import { QueryAuditLogDto } from '../dto/query-audit-log.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Audit Log')
@Controller('audit-log')
export class AuditController {
    constructor(private readonly auditService: AuditService) {}

    // Called internally by other services to write a log entry
    @Post()
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ summary: 'Append a new audit log entry (called by other services)' })
    log(@Body() dto: CreateAuditLogDto) {
        return this.auditService.log(dto);
    }

    // Admin views the audit trail with optional filters
    @Get()
    @ApiOperation({ summary: 'Get audit logs filtered by date, action, entity, or actor' })
    findAll(@Query() query: QueryAuditLogDto) {
        return this.auditService.findAll(query);
    }

    // Export audit log as CSV
    @Get('export/csv')
    @ApiOperation({ summary: 'Export audit logs as CSV file' })
    async exportCsv(
        @Query() query: QueryAuditLogDto,
        @Res() res: Response,
    ) {
        const csv = await this.auditService.exportCsv(query);
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename="audit-log.csv"');
        res.send(csv);
    }
}
