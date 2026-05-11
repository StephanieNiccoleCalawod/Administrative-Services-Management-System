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
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { TransactionService } from '../service/transaction.service';
import { CreateTransactionDto } from '../dto/create-transaction.dto';
import { UpdateTransactionDto } from '../dto/update-transaction.dto';
import { UpdateDocStatusDto } from '../dto/update-doc-status.dto';

@ApiTags('Transactions')
@Controller('transactions')
export class TransactionController {
    constructor(private readonly transactionService: TransactionService) { }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ summary: 'Log a new transaction — time_in is auto-set' })
    create(@Body() dto: CreateTransactionDto) {
        return this.transactionService.create(dto);
    }

    @Get()
    @ApiQuery({ name: 'period_id', required: false })
    @ApiQuery({ name: 'service_id', required: false })
    @ApiQuery({ name: 'logged_by', required: false })
    @ApiOperation({ summary: 'Get all transactions with optional filters' })
    findAll(
        @Query('period_id') period_id?: string,
        @Query('service_id') service_id?: string,
        @Query('logged_by') logged_by?: string,
    ) {
        return this.transactionService.findAll({ period_id, service_id, logged_by });
    }

    @Get('summary')
    @ApiOperation({ summary: 'Get SLA summary grouped by service for a period' })
    getSummary(@Query('period_id', ParseUUIDPipe) period_id: string) {
        return this.transactionService.getSummaryByPeriod(period_id);
    }

    @Get('export')
    @ApiOperation({ summary: 'Export all transactions for a period' })
    export(@Query('period_id', ParseUUIDPipe) period_id: string) {
        return this.transactionService.findByPeriod(period_id);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a single transaction by ID' })
    findOne(@Param('id', ParseUUIDPipe) id: string) {
        return this.transactionService.findOne(id);
    }

    // ── TASK 6: doc_status endpoint ──────────────────────────────────────────
    // SLA clock starts only when doc_status = complete
    @Patch(':id/doc-status')
    @ApiOperation({ summary: 'Update document status — SLA clock starts when set to complete' })
    updateDocStatus(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() dto: UpdateDocStatusDto,
    ) {
        return this.transactionService.updateDocStatus(id, dto);
    }

    // ── TASK 5: SLA engine triggered here ───────────────────────────────────
    // Completing a transaction computes processing_time and sla_compliant
    @Patch(':id/status')
    @ApiOperation({ summary: 'Update transaction status — SLA computed on COMPLETED' })
    updateStatus(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() dto: UpdateTransactionDto,
    ) {
        return this.transactionService.updateStatus(id, dto);
    }
}
