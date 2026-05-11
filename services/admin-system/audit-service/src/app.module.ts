import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { AuditService } from './service/audit-service';
import { AuditController } from './controller/audit.controller';

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        DatabaseModule,
    ],
    providers: [AuditService],
    controllers: [AuditController],
})
export class AppModule { }
