import { DataSource } from 'typeorm';
import { Service } from './entities/service.entity';
import {
  ServiceClassification,
  ServiceType,
  ServiceCategory,
} from './entities/service.entity';
import 'dotenv/config';

const ServiceDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: +(process.env.DB_PORT || 5432),
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASS || 'postgres',
  database: 'service_catalog_db',
  entities: [Service],
  synchronize: false,
});

async function seed() {
  await ServiceDataSource.initialize();

  const repo = ServiceDataSource.getRepository(Service);

  await repo.save([

    {
      name: 'General Consultation',
      description: 'General medical consultation',
      total_processing_time: 30,
      classification: ServiceClassification.MEDICAL,
      type: ServiceType.CONSULTATION,
      category: ServiceCategory.STANDARD,
      is_active: true,
    },
    {
      name: 'Dental Cleaning',
      description: 'Standard dental cleaning',
      total_processing_time: 45,
      classification: ServiceClassification.DENTAL,
      type: ServiceType.CONSULTATION,
      category: ServiceCategory.NON_EMERGENCY,
      is_active: true,
    },

    {
      name: 'Medical Certificate',
      description: 'Issuance of medical certificate',
      total_processing_time: 15,
      classification: ServiceClassification.ADMINISTRATIVE,
      type: ServiceType.CERTIFICATE,
      category: ServiceCategory.STANDARD,
      is_active: true,
    },
  ]);

  console.log('✅ service_catalog_db seeded!');
  await ServiceDataSource.destroy();
}

seed().catch((err) => {
  console.error('❌ Seeding failed:', err);
  process.exit(1);
});