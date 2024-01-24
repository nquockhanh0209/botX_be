import { Exclude } from "class-transformer";
import { Roles } from "src/enums/user.enum";
import {
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  OneToOne,
  ManyToOne,
  JoinTable,
} from "typeorm";
import { BaseEntity } from "../base/base.entity";
import { User } from "./User";
import { Service } from "./Service";
import { PaymentStatus } from "src/enums/payment.enum";

@Entity("payments")
export class Payment extends BaseEntity {
  @JoinTable()
  @ManyToOne(() => User, (user) => user.id)
  user: User;

  @Column({
    nullable: true,
    length: 24,
  })
  currency: string | null;

  @Column("decimal", {
    nullable: false,
    default: 0,
  })
  amountDeposit: number | 0;

  @Column("decimal", {
    nullable: false,
    default: 0,
  })
  amountSys: number | 0;

  @Column({
    nullable: true,
    length: 256,
  })
  content: string | null;


  @Column({
    nullable: true,
    length: 256,
  })
  txHash: string | null;

  @Column("enum", {
    enum: PaymentStatus,
    nullable: false,
    default: PaymentStatus.PENDING,
  })
  statusPayment: PaymentStatus;
}
