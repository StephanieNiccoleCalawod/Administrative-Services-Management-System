import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { PeriodService } from './service/period.service';
import { PeriodController } from './controller/period.controller';

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        DatabaseModule,
    ],
    providers: [PeriodService],
    controllers: [PeriodController],
})
export class AppModule { }