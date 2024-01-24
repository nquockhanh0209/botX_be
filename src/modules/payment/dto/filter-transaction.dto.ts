import { IsEnum, IsOptional } from "class-validator";

import { ApiProperty } from "@nestjs/swagger";
import { QueryDto } from "src/dtos/query.dto";
import { PaymentStatus } from "src/enums/payment.enum";

export class FilterTransactionDto extends QueryDto {
  @IsEnum(PaymentStatus)
  @IsOptional()
  @ApiProperty({
    default: PaymentStatus.CANCEL,
    required: false,
    enum: PaymentStatus,
  })
  status: PaymentStatus;
}
