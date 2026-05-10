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
import { TransactionService } from '../service/transaction.service';
import { CreateTransactionDto } from '../dto/create-transaction.dto';
import { UpdateTransactionDto } from '../dto/update-transaction.dto';

@Controller('transactions')
export class TransactionController {
    constructor(private readonly transactionService: TransactionService) { }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    create(@Body() dto: CreateTransactionDto) {
        return this.transactionService.create(dto);
    }

    @Get()
    findAll(
        @Query('period_id') period_id?: string,
        @Query('service_id') service_id?: string,
        @Query('logged_by') logged_by?: string,
    ) {
        return this.transactionService.findAll({ period_id, service_id, logged_by });
    }

    @Get('summary')
    getSummary(@Query('period_id', ParseUUIDPipe) period_id: string) {
        return this.transactionService.getSummaryByPeriod(period_id);
    }

    @Get('export')
    export(@Query('period_id', ParseUUIDPipe) period_id: string) {
        return this.transactionService.findByPeriod(period_id);
    }

    @Get(':id')
    findOne(@Param('id', ParseUUIDPipe) id: string) {
        return this.transactionService.findOne(id);
    }

    @Patch(':id/status')
    updateStatus(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() dto: UpdateTransactionDto,
    ) {
        return this.transactionService.updateStatus(id, dto);
    }
}