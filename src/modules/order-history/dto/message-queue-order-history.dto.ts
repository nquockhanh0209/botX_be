import { IsBoolean, IsNumber } from "class-validator";

export class MessageQueueHistoryDto {
  @IsNumber()
  orderHistoryId: number;

  @IsNumber()
  userId: number;

  @IsNumber()
  progress: number;

  @IsBoolean()
  error: boolean;
}
