import { Column, Entity, ManyToOne, JoinTable } from "typeorm";
import { BaseEntity } from "../base/base.entity";
import { User } from "./User";
import { PaymentStatus } from "src/enums/payment.enum";

@Entity("withdrawns")
export class Withdrawn extends BaseEntity {
  @JoinTable()
  @ManyToOne(() => User, (user) => user.id)
  user: User;

  @Column("decimal", {
    nullable: false,
    default: 0,
  })
  amountVnd: number | 0;

  @Column("decimal", {
    nullable: false,
    default: 0,
  })
  balanceAffiWithdrawn: number | 0;

  @Column({
    nullable: true,
    length: 256,
  })
  content: string | null;

  @Column({
    nullable: false,
    length: 225,
    default: null,
  })
  bankName: string;

  @Column({
    nullable: false,
    length: 225,
    default: null,
  })
  accountName: string;

  @Column({
    nullable: false,
    length: 225,
    default: null,
  })
  accountNumber: string;

  @Column("enum", {
    enum: PaymentStatus,
    nullable: false,
    default: PaymentStatus.PENDING,
  })
  statusWithdrawn: PaymentStatus;
}
