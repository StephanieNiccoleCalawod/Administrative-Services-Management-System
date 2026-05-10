import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { OfficeUser } from './entities/office-user.entity';

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (config: ConfigService) => ({
                type: 'postgres',
                host: config.get<string>('DB_HOST'),
                port: config.get<number>('DB_PORT'),
                username: config.get<string>('DB_USER'),
                password: config.get<string>('DB_PASS'),
                database: 'office_user_db',
                entities: [OfficeUser],
                synchronize: false,
            }),
        }),
        TypeOrmModule.forFeature([OfficeUser]),
    ],
    exports: [TypeOrmModule],
})
export class DatabaseModule { }