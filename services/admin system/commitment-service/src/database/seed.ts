import { DataSource } from 'typeorm';
import { Commitment } from './entities/commitment.entity';
import { TargetUnit, CommitmentStatus } from './entities/commitment.entity';
import 'dotenv/config';

// commitment_db connection
const CommitmentDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: +(process.env.DB_PORT || 5432),
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASS || 'postgres',
  database: 'commitment_db',
  entities: [Commitment],
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
  await CommitmentDataSource.initialize();
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

  const repo = CommitmentDataSource.getRepository(Commitment);

  await repo.save([
    {
      service_id: services[0].service_id,
      period_id: periods[0].period_id,
      created_by: users[0].office_user_id,
      target_unit: TargetUnit.COUNT,
      target_value: 100,
      success_indicator: 'Achieve 100 consultations',
      timeline: 'End of month',
      status: CommitmentStatus.SUBMITTED,
    },
    {
      service_id: services[1]?.service_id || services[0].service_id,
      period_id: periods[0].period_id,
      created_by: users[0].office_user_id,
      target_unit: TargetUnit.PERCENTAGE,
      target_value: 95,
      success_indicator: '95% SLA compliance',
      timeline: 'End of quarter',
      status: CommitmentStatus.DRAFT,
    },
  ]);

  console.log('✅ commitment_db seeded!');

  await CommitmentDataSource.destroy();
  await ServiceDataSource.destroy();
  await PeriodDataSource.destroy();
  await AuthDataSource.destroy();
}

seed().catch((err) => {
  console.error('❌ Seeding failed:', err);
  process.exit(1);
});