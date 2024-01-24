import { IsEnum, IsOptional } from "class-validator";

import { ApiProperty } from "@nestjs/swagger";
import { IsGreaterThan } from "src/validators/compare-field";
import { PaymentStatus } from "src/enums/payment.enum";

export class StatusPaymentDto {
  @IsEnum(PaymentStatus)
  @ApiProperty({
    default: PaymentStatus.CANCEL,
    required: false,
    enum: PaymentStatus,
  })
  status: PaymentStatus;
}
