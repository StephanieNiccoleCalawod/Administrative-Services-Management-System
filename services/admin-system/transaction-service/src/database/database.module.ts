import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Transaction } from './entities/transaction.entity';

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
                database: 'transaction_db',
                entities: [Transaction],
                synchronize: false,
                logging: true, 
            }),
        }),
        TypeOrmModule.forFeature([Transaction]),
    ],
    exports: [TypeOrmModule],
})
export class DatabaseModule { }