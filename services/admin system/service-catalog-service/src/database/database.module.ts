import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Service } from './entities/service.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: 'service_catalog_db',
      entities: [Service],
      synchronize: false,
    }),
    TypeOrmModule.forFeature([Service]),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}