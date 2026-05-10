import { DataSource } from 'typeorm';
import { Period } from './entities/period.entity';
import { PeriodType, PeriodStatus } from './entities/period.entity';
import 'dotenv/config';

const PeriodDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: +(process.env.DB_PORT || 5432),
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASS || 'postgres',
  database: 'period_db',
  entities: [Period],
  synchronize: false,
});

async function seed() {
  await PeriodDataSource.initialize();

  const repo = PeriodDataSource.getRepository(Period);

  await repo.save([
    {
      name: 'January 2025',
      period_type: PeriodType.MONTHLY,
      start_date: new Date('2025-01-01'),
      end_date: new Date('2025-01-31'),
      status: PeriodStatus.CLOSED,
    },
    {
      name: 'Q1 2025',
      period_type: PeriodType.QUARTERLY,
      start_date: new Date('2025-01-01'),
      end_date: new Date('2025-03-31'),
      status: PeriodStatus.CLOSED,
    },
    {
      name: 'May 2025',
      period_type: PeriodType.MONTHLY,
      start_date: new Date('2025-05-01'),
      end_date: new Date('2025-05-31'),
      status: PeriodStatus.ACTIVE,
    },
  ]);

  console.log('✅ period_db seeded!');
  await PeriodDataSource.destroy();
}

seed().catch((err) => {
  console.error('❌ Seeding failed:', err);
  process.exit(1);
});