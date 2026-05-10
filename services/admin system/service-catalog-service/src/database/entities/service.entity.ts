import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum ServiceClassification {
  MEDICAL = 'medical',
  DENTAL = 'dental',
  ADMINISTRATIVE = 'administrative',
}

export enum ServiceType {
  CONSULTATION = 'consultation',
  CLEARANCE = 'clearance',
  CERTIFICATE = 'certificate',
  BORROWING = 'borrowing',
  RESERVATION = 'reservation',
  PERMIT = 'permit',
  CIRCULATION = 'circulation',
}

export enum ServiceCategory {
  EMERGENCY = 'emergency',
  NON_EMERGENCY = 'non_emergency',
  STANDARD = 'standard',
}

@Entity('services')
export class Service {
  @PrimaryGeneratedColumn('uuid')
  service_id: string;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ nullable: true })
  total_processing_time: number;

  @Column({ type: 'enum', enum: ServiceClassification })
  classification: ServiceClassification;

  @Column({ type: 'enum', enum: ServiceType })
  type: ServiceType;

  @Column({ type: 'enum', enum: ServiceCategory })
  category: ServiceCategory;

  @Column({ default: true })
  is_active: boolean;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;
}