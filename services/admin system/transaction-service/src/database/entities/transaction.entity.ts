import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum ClientType {
  WALK_IN = 'walk_in',
  REFERRED = 'referred',
  ONLINE = 'online',
}

export enum TransactionStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

@Entity('transactions')
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  transaction_id: string;

  @Column({ type: 'uuid' })
  service_id: string;           // ref → service_catalog_db

  @Column({ type: 'uuid' })
  period_id: string;            // ref → period_db

  @Column({ type: 'text', nullable: true })
  transaction_log: string;

  @Column({ type: 'uuid' })
  logged_by: string;            // ref → auth_db

  @Column({ type: 'date' })
  date: Date;

  @Column({ type: 'timestamptz' })
  time_in: Date;

  @Column({ type: 'timestamptz', nullable: true })
  time_out: Date;

  @Column({ nullable: true })
  processing_time: number;

  @Column()
  client_name: string;

  @Column({ type: 'enum', enum: ClientType })
  client_type: ClientType;

  @Column({ type: 'enum', enum: TransactionStatus, default: TransactionStatus.PENDING })
  status: TransactionStatus;

  @Column({ type: 'text', nullable: true })
  remarks: string;

  @Column({ default: false })
  is_referred: boolean;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;
}