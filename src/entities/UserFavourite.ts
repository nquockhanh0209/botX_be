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
  Index,
} from "typeorm";
import { BaseEntity } from "../base/base.entity";
import { User } from "./User";
import { Service } from "./Service";

@Index(["user", "service"], { unique: true })
@Entity("user_favourites")
export class UserFavourite extends BaseEntity {
  @JoinTable()
  @ManyToOne(() => User, (user) => user.id)
  user: User;

  @JoinTable()
  @ManyToOne(() => Service, (service) => service.id)
  service: Service;

  
}
