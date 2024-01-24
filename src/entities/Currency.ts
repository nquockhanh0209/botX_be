import { Exclude } from "class-transformer";
import { Roles } from "src/enums/user.enum";
import { Column, Entity } from "typeorm";
import { BaseEntity } from "../base/base.entity";

@Entity("currencies")
export class Currency extends BaseEntity {
  @Column("decimal", {
    nullable: false,
    default: 0,
  })
  rate: number | 0;

  @Column({
    nullable: false,
    default: 0,
  })
  name: string;
}
