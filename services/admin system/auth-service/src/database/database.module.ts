import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OfficeUser } from './entities/office-user.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: 'office_user_db',
      entities: [OfficeUser],
      synchronize: false,
    }),
    TypeOrmModule.forFeature([OfficeUser]),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}