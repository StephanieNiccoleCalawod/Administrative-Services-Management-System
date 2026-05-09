import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum ServiceClassification {
  INTERNAL = 'internal',
  EXTERNAL = 'external',
}

export enum ServiceType {
  CONSULTATION = 'consultation',
  PROCEDURE = 'procedure',
  LABORATORY = 'laboratory',
  RADIOLOGY = 'radiology',
}

export enum ServiceCategory {
  MEDICAL = 'medical',
  ADMINISTRATIVE = 'administrative',
  ANCILLARY = 'ancillary',
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