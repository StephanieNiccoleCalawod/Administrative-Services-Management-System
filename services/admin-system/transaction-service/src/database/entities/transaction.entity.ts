import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum ClientType {
  EMPLOYEE = 'employee',
  STUDENT = 'student',
  DEPENDENT = 'dependent',
}

export enum TransactionStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  NA = 'na',
}

export enum DocStatus {
  INCOMPLETE = 'incomplete',
  FOR_COMPLIANCE = 'for_compliance',
  COMPLETE = 'complete',
}

@Entity('transactions')
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  transaction_id: string;

  @Column({ type: 'uuid' })
  service_id: string;

  @Column({ type: 'uuid' })
  period_id: string;

  @Column({ type: 'text', nullable: true })
  transaction_log: string;

  @Column({ type: 'uuid' })
  logged_by: string;

  @Column({ type: 'date' })
  date: Date;

  // Auto-set on creation — do NOT allow manual input
  @CreateDateColumn({ type: 'timestamptz' })
  time_in: Date;

  // Set automatically when status is changed to COMPLETED
  @Column({ type: 'timestamptz', nullable: true })
  time_out: Date;

  // Computed: time_out - time_in in minutes (set when time_out is recorded)
  @Column({ nullable: true })
  processing_time: number;

  // Flagged automatically when processing_time > service.total_processing_time
  @Column({ nullable: true })
  sla_compliant: boolean;

  @Column()
  client_name: string;

  @Column({ type: 'enum', enum: ClientType })
  client_type: ClientType;

  @Column({ type: 'enum', enum: TransactionStatus, default: TransactionStatus.PENDING })
  status: TransactionStatus;

  // SLA clock only starts when doc_status = complete
  @Column({ type: 'enum', enum: DocStatus, default: DocStatus.INCOMPLETE })
  doc_status: DocStatus;

  @Column({ type: 'text', nullable: true })
  remarks: string;

  @Column({ default: false })
  is_referred: boolean;

  // Stores service-specific fields e.g. { chief_complaint, vital_signs } for medical
  @Column({ type: 'jsonb', nullable: true })
  conditional_data: Record<string, any>;

  // Locked when status = COMPLETED — no further edits allowed
  @Column({ default: false })
  is_locked: boolean;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;
}
