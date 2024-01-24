import { BaseEntity } from "src/base/base.entity";
import { FindOneOptions, Repository } from "typeorm";
import { EntityTarget } from "typeorm/common/EntityTarget";
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity";

export abstract class BaseService<T extends BaseEntity> {
  protected constructor(protected readonly repository: Repository<T>) {}

  async save(entity: T): Promise<T> {
    return await this.repository.save(entity);
  }

  async saveBulk(entity: T[]): Promise<T | T[]> {
    return await this.repository.save(entity);
  }

  async findOne(conditions: Record<string, unknown>): Promise<T> {
    return this.repository.findOne(conditions);
  }

  findById(id: any): Promise<T> {
    return this.repository.findOneBy({ id });
  }

  async findAll(): Promise<T[]> {
    return this.repository.find();
  }

  async update(id: number, entity: T): Promise<T> {
    await this.repository.update(id, entity as QueryDeepPartialEntity<T>);
    return this.findById(id);
  }

  async delete(id: number): Promise<void> {
    await this.repository.delete(id);
  }
}
