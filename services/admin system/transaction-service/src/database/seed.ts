import { DataSource } from 'typeorm';
import { Transaction } from './entities/transaction.entity';
import { ClientType, TransactionStatus } from './entities/transaction.entity';
import 'dotenv/config';

// transaction_db connection
const TransactionDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: +(process.env.DB_PORT || 5432),
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASS || 'postgres',
  database: 'transaction_db',
  entities: [Transaction],
  synchronize: false,
});

// service_catalog_db connection — to get real service IDs
const ServiceDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: +(process.env.DB_PORT || 5432),
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASS || 'postgres',
  database: 'service_catalog_db',
  synchronize: false,
  entities: [],
});

// period_db connection — to get real period IDs
const PeriodDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: +(process.env.DB_PORT || 5432),
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASS || 'postgres',
  database: 'period_db',
  synchronize: false,
  entities: [],
});

// auth_db connection — to get real user IDs
const AuthDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: +(process.env.DB_PORT || 5432),
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASS || 'postgres',
  database: 'office_user_db',
  synchronize: false,
  entities: [],
});

async function seed() {
  await TransactionDataSource.initialize();
  await ServiceDataSource.initialize();
  await PeriodDataSource.initialize();
  await AuthDataSource.initialize();

  // fetch real IDs from other databases
  const services = await ServiceDataSource.query(
    `SELECT service_id FROM services WHERE is_active = true LIMIT 2`
  );
  const periods = await PeriodDataSource.query(
    `SELECT period_id FROM periods WHERE status = 'active' LIMIT 1`
  );
  const users = await AuthDataSource.query(
    `SELECT office_user_id FROM office_users WHERE status = 'active' LIMIT 1`
  );

  // guard — make sure data exists
  if (!services.length || !periods.length || !users.length) {
    console.error('❌ Seed auth_db, period_db, and service_catalog_db first!');
    process.exit(1);
  }

  const repo = TransactionDataSource.getRepository(Transaction);

  await repo.save([
    {
      service_id: services[0].service_id,
      period_id: periods[0].period_id,
      logged_by: users[0].office_user_id,
      date: new Date('2025-05-01'),
      time_in: new Date('2025-05-01T08:00:00Z'),
      time_out: new Date('2025-05-01T08:30:00Z'),
      processing_time: 30,
      client_name: 'Juan dela Cruz',
      client_type: ClientType.STUDENT,
      status: TransactionStatus.COMPLETED,
      remarks: 'No remarks',
      is_referred: false,
    },
    {
      service_id: services[1]?.service_id || services[0].service_id,
      period_id: periods[0].period_id,
      logged_by: users[0].office_user_id,
      date: new Date('2025-05-01'),
      time_in: new Date('2025-05-01T09:00:00Z'),
      client_name: 'Maria Santos',
      client_type: ClientType.EMPLOYEE,
      status: TransactionStatus.PENDING,
      remarks: null,
      is_referred: true,
    },
  ]);

  console.log('✅ transaction_db seeded!');

  await TransactionDataSource.destroy();
  await ServiceDataSource.destroy();
  await PeriodDataSource.destroy();
  await AuthDataSource.destroy();
}

seed().catch((err) => {
  console.error('❌ Seeding failed:', err);
  process.exit(1);
});