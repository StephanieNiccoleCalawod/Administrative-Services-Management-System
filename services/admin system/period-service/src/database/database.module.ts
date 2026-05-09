import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Period } from './entities/period.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: 'period_db',
      entities: [Period],
      synchronize: false,
    }),
    TypeOrmModule.forFeature([Period]),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}