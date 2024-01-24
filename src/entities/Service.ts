import { Exclude } from "class-transformer";
import { Roles } from "src/enums/user.enum";
import {
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  OneToOne,
  JoinTable,
  ManyToOne,
} from "typeorm";
import { BaseEntity } from "../base/base.entity";
import { Cart } from "./Cart";
import { UserFavourite } from "./UserFavourite";
import { Category } from "./Category";

@Entity("services")
export class Service extends BaseEntity {
  @Column({
    nullable: false,
    length: 256,
  })
  title: string;

  @Column("text", {
    nullable: true,
  })
  desc: string | null;

  @Column({
    nullable: true,
  })
  minQuantity: number | null;

  @Column({
    nullable: true,
  })
  maxQuantity: number | null;

  @Column("decimal", {
    nullable: false,
  })
  price: number;

  @Column({
    nullable: false,
    length: 64,
  })
  typeService: string;

  @Column({
    nullable: false,
    default: false,
  })
  isHot: boolean;

  @Column({
    nullable: false,
    default: false,
  })
  guarantee: boolean;

  @OneToMany(() => Cart, (cart) => cart.service)
  carts: Cart[];

  @JoinTable()
  @ManyToOne(() => Category, (category) => category.id)
  category: Category;

  @OneToMany(() => UserFavourite, (userFavourite) => userFavourite.service)
  userFavourites: UserFavourite[];
}
