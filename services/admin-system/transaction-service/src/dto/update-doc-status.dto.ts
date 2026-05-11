import { IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { DocStatus } from '../database/entities/transaction.entity';

export class UpdateDocStatusDto {
    @ApiProperty({
        enum: DocStatus,
        description: 'incomplete | for_compliance | complete. SLA clock starts when set to complete.',
    })
    @IsEnum(DocStatus)
    doc_status: DocStatus;
}
