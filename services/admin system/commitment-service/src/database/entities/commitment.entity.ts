import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum TargetUnit {
  COUNT = 'count',
  PERCENTAGE = 'percentage',
  MINUTES = 'minutes',
  HOURS = 'hours',
}

export enum CommitmentStatus {
  DRAFT = 'draft',
  ACTIVE = 'active',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

@Entity('commitments')
export class Commitment {
  @PrimaryGeneratedColumn('uuid')
  commitment_id: string;

  @Column({ type: 'uuid' })
  service_id: string;           // ref → service_catalog_db

  @Column({ type: 'uuid' })
  period_id: string;            // ref → period_db

  @Column({ type: 'uuid' })
  created_by: string;           // ref → auth_db

  @Column({ type: 'enum', enum: TargetUnit })
  target_unit: TargetUnit;

  @Column({ type: 'numeric' })
  target_value: number;

  @Column({ type: 'text', nullable: true })
  success_indicator: string;

  @Column({ type: 'text', nullable: true })
  timeline: string;

  @Column({ type: 'enum', enum: CommitmentStatus, default: CommitmentStatus.DRAFT })
  status: CommitmentStatus;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;
}