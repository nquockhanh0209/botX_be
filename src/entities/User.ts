import { Exclude } from "class-transformer";
import { EventUser, Roles } from "src/enums/user.enum";
import {
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  OneToOne,
} from "typeorm";
import { BaseEntity } from "../base/base.entity";
import { Cart } from "./Cart";
import { UserFavourite } from "./UserFavourite";
import { Noti } from "./Noti";
import { OrderHistory } from "./OrderHistory";

@Entity("users")
export class User extends BaseEntity {
  @Column({
    nullable: true,
    length: 100,
  })
  email: string | null;

  @Column({
    nullable: true,
    length: 255,
  })
  username: string | null;

  @Column({
    nullable: false,
    length: 20,
  })
  refId: string;

  @Column({
    nullable: true,
    length: 20,
  })
  uplineId: string | null;

  @Column("decimal", {
    nullable: false,
    default: 0,
  })
  balanceSys: number;

  @Column("decimal", {
    nullable: false,
    default: 0,
  })
  balanceAffi: number;

  @Column({
    nullable: true,
    length: 52,
    default: null,
  })
  phoneNumber: string | null;

  @Column({
    nullable: true,
    length: 225,
    default: null,
  })
  password: string | null;

  @Column({
    nullable: true,
    length: 225,
    default: null,
  })
  bankName: string | null;

  @Column({
    nullable: true,
    length: 225,
    default: null,
  })
  accountName: string | null;

  @Column({
    nullable: true,
    length: 512,
    default: null,
  })
  avatarUrl: string | null;

  @Column({
    nullable: true,
    length: 225,
    default: null,
  })
  accountNumber: string | null;

  @Column("enum", {
    enum: Roles,
    nullable: false,
    default: Roles.USER,
  })
  role: Roles;

  @Column("enum", {
    enum: EventUser,
    nullable: false,
    default: EventUser.FREE,
  })
  eventUser: EventUser;

  @OneToMany(() => Cart, (cart) => cart.user)
  carts: Cart[];

  @OneToMany(() => UserFavourite, (userFavourite) => userFavourite.user)
  userFavourites: UserFavourite[];

  @OneToMany(() => Noti, (noti) => noti.user)
  notis: Noti[];

  @OneToMany(() => OrderHistory, (orderHistory) => orderHistory.user)
  orderHistory: OrderHistory[];
}
