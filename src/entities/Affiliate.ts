import { Column, Entity, ManyToOne, JoinTable } from "typeorm";
import { BaseEntity } from "../base/base.entity";
import { User } from "./User";

@Entity("affiliates")
export class Affiliate extends BaseEntity {
  @JoinTable()
  @ManyToOne(() => User, (user) => user.id)
  from: User;

  @JoinTable()
  @ManyToOne(() => User, (user) => user.id)
  to: User;

  @Column("decimal", {
    nullable: false,
    default: 0,
  })
  priceService: number | 0;

  @Column("decimal", {
    nullable: false,
    default: 0,
  })
  balanceAffi: number | 0;

  @Column({
    nullable: true,
    length: 256,
  })
  content: string | null;
}
