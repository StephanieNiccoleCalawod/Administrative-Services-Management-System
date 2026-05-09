import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from './entities/transaction.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: 'transaction_db',
      entities: [Transaction],
      synchronize: false,
    }),
    TypeOrmModule.forFeature([Transaction]),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}