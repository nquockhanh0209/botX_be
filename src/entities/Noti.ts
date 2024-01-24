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

@Entity("notis")
export class Noti extends BaseEntity {
  @JoinTable()
  @ManyToOne(() => User, (user) => user.id)
  user: User;

  @Column({
    nullable: true,
  })
  title: string | null;

  @Column({
    nullable: true,
  })
  content: string | null;

  @Column({
    nullable: false,
    default: false,
  })
  isSeen: boolean | false;
}
