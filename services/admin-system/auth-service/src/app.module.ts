import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { OfficeUserService } from './service/office-user.service';
import { OfficeUserController } from './controller/office-user.controller';

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        DatabaseModule,
    ],
    providers: [OfficeUserService],
    controllers: [OfficeUserController],
})
export class AppModule { }