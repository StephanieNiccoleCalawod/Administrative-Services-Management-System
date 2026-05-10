import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { ServiceCatalogService } from './service/service-catalog.service';
import { ServiceCatalogController } from './controller/service-catalog.controller';

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        DatabaseModule,
    ],
    providers: [ServiceCatalogService],
    controllers: [ServiceCatalogController],
})
export class AppModule { }