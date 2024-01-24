import { Injectable } from "@nestjs/common";
import { User } from "src/entities/User";
import { DataSource, Repository } from "typeorm";

@Injectable() // here
export class UserRepository extends Repository<User> {
  constructor(private dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }
}
