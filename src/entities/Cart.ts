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

@Entity("carts")
export class Cart extends BaseEntity {
  @JoinTable()
  @ManyToOne(() => User, (user) => user.id)
  user: User;

  @JoinTable()
  @ManyToOne(() => Service, (service) => service.id)
  service?: Service;

  @Column({
    nullable: true,
  })
  quantity: number | null;

  @Column({
    nullable: true,
    length: 256,
  })
  link: string | null;
}
