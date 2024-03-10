import {
  DeepPartial,
  FindManyOptions,
  FindOneOptions,
  FindOptionsWhere,
  Repository,
  UpdateResult,
} from "typeorm"
import { BaseRepositoryInterface } from "./base.repository.interface"

interface HasId {
  id: number
}

export abstract class BaseAbstractRepostitory<T extends HasId>
  implements BaseRepositoryInterface<T>
{
  private entity: Repository<T>

  protected constructor(entity: Repository<T>) {
    this.entity = entity
  }

  public async save(data: DeepPartial<T>): Promise<T> {
    return await this.entity.save(data)
  }

  public create(data: DeepPartial<T>): T {
    return this.entity.create(data)
  }

  public async findOneById(id: any): Promise<T> {
    const options: FindOptionsWhere<T> = {
      id: id,
    }
    return await this.entity.findOneBy(options)
  }

  public async findByCondition(filterCondition: FindOneOptions<T>): Promise<T> {
    return await this.entity.findOne(filterCondition)
  }

  public async findWithRelations(relations: FindManyOptions<T>): Promise<T[]> {
    return await this.entity.find(relations)
  }

  public async findAll(options?: FindManyOptions<T>): Promise<T[]> {
    return await this.entity.find(options)
  }

  public async softDelete(id: number): Promise<UpdateResult> {
    return await this.entity.softDelete(id)
  }
}
