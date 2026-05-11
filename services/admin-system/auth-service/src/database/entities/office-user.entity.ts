import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum UserRole {
  ADMIN_OFFICER = 'admin_officer',
  CLINIC_NURSE = 'clinic_nurse',
  CLINIC_DENTIST = 'clinic_dentist',
}

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
}

export enum UserScope {
  MEDICAL = 'medical',
  DENTAL = 'dental',
  ADMINISTRATIVE = 'administrative',
}

@Entity('office_users')
export class OfficeUser {
  @PrimaryGeneratedColumn('uuid')
  office_user_id: string;

  @Column()
  first_name: string;

  @Column()
  last_name: string;

  @Column({ unique: true })
  email: string;

  @Column({ type: 'enum', enum: UserRole })
  role: UserRole;

  @Column({ type: 'enum', enum: UserStatus, default: UserStatus.ACTIVE })
  status: UserStatus;

  // Defines which service classifications this user can access
  // e.g. nurse → ['medical'], dentist → ['dental'], admin_officer → ['medical','dental','administrative']
  @Column({ type: 'simple-array', nullable: true })
  scopes: UserScope[];

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;
}
