import { Column, Entity, OneToMany } from "typeorm";
import { BaseEntity } from "../base/base.entity";
import { Service } from "./Service";

@Entity("categories")
export class Category extends BaseEntity {
  @Column({
    nullable: false,
  })
  title: string;

  @OneToMany(() => Service, (service) => service.category)
  services: Service[];
}
