import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

export enum AuditAction {
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  ACTIVATE = 'ACTIVATE',
  DEACTIVATE = 'DEACTIVATE',
  SUBMIT = 'SUBMIT',
}

export enum AuditEntity {
  SERVICE = 'SERVICE',
  TRANSACTION = 'TRANSACTION',
  COMMITMENT = 'COMMITMENT',
  PERIOD = 'PERIOD',
  OFFICE_USER = 'OFFICE_USER',
}

@Entity('audit_logs')
export class AuditLog {
  @PrimaryGeneratedColumn('uuid')
  audit_log_id: string;

  @Column({ type: 'uuid', nullable: true })
  actor_id: string;

  @Column({ nullable: true })
  actor_name: string;

  @Column({ type: 'enum', enum: AuditAction })
  action: AuditAction;

  @Column({ type: 'enum', enum: AuditEntity })
  entity: AuditEntity;

  @Column({ type: 'uuid', nullable: true })
  entity_id: string;

  @Column({ type: 'jsonb', nullable: true })
  before_state: Record<string, any>;

  @Column({ type: 'jsonb', nullable: true })
  after_state: Record<string, any>;

  @CreateDateColumn({ type: 'timestamptz' })
  timestamp: Date;
}
