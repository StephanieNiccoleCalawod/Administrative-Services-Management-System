import { DataSource } from 'typeorm';
import { OfficeUser } from './entities/office-user.entity';
import { UserRole, UserStatus } from './entities/office-user.entity';
import 'dotenv/config';

const AuthDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: +(process.env.DB_PORT || 5432),
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASS || 'postgres',
  database: 'office_user_db',
  entities: [OfficeUser],
  synchronize: false,
});

async function seed() {
  await AuthDataSource.initialize();

  const repo = AuthDataSource.getRepository(OfficeUser);

  await repo.save([
    {
      name: 'John Admin',
      email: 'admin@example.com',
      role: UserRole.ADMIN_OFFICER,
      status: UserStatus.ACTIVE,
    },
    {
      name: 'Jane Staff',
      email: 'nurse@example.com',
      role: UserRole.CLINIC_NURSE,
      status: UserStatus.ACTIVE,
    },
    {
      name: 'Bob Dentist',
      email: 'dentist@example.com',
      role: UserRole.CLINIC_DENTIST,
      status: UserStatus.ACTIVE,
    },
  ]);

  console.log('✅ auth_db seeded!');
  await AuthDataSource.destroy();
}

seed().catch((err) => {
  console.error('❌ Seeding failed:', err);
  process.exit(1);
});