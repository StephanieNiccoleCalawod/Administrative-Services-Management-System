import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { TransactionService } from './service/transaction.service';
import { TransactionController } from './controller/transaction.controller';

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        DatabaseModule,
    ],
    providers: [TransactionService],
    controllers: [TransactionController],
})
export class AppModule { }