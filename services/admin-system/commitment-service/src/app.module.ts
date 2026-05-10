import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { CommitmentService } from './service/commitment.service';
import { CommitmentController } from './controller/commitment.controller';

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        DatabaseModule,
    ],
    providers: [CommitmentService],
    controllers: [CommitmentController],
})
export class AppModule { }