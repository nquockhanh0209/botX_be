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
  AfterLoad,
} from "typeorm";
import { BaseEntity } from "../base/base.entity";
import { User } from "./User";
import { Service } from "./Service";
import { StatusOrderHistory } from "src/enums/service.enum";

@Entity("order_histories")
export class OrderHistory extends BaseEntity {
  @JoinTable()
  @ManyToOne(() => User, (user) => user.id)
  user: User;

  @JoinTable()
  @ManyToOne(() => Service, (service) => service.id)
  service: Service;

  @Column({
    nullable: true,
    length: 256,
  })
  link: string;

  @Column("decimal", {
    nullable: false,
  })
  price: number;

  @Column({
    nullable: false,
  })
  amount: number;

  @Column({
    nullable: false,
  })
  progress: number;

  @Column("decimal", {
    nullable: false,
    default: 0,
  })
  discount: number | 0;

  @Column({
    enum: StatusOrderHistory,
    nullable: false,
    default: StatusOrderHistory.ACTIVE,
  })
  statusOrder: StatusOrderHistory;

  @Column({
    nullable: false,
    default: false,
  })
  inQueue: boolean;
}
