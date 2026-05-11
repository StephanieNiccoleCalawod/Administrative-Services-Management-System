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

  // SLA target in minutes
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

  // Defines service-specific fields required during transaction logging
  // e.g. ["chief_complaint", "vital_signs"] for Medical Consultation
  // e.g. ["venue", "equipment_needed"] for Facility Reservation
  @Column({ type: 'jsonb', nullable: true })
  conditional_fields: string[];

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;
}
