import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Commitment } from './entities/commitment.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: 'commitment_db',
      entities: [Commitment],
      synchronize: false,
    }),
    TypeOrmModule.forFeature([Commitment]),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}