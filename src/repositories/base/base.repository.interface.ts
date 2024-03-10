import {
  DeepPartial,
  FindManyOptions,
  FindOneOptions,
  UpdateResult,
} from "typeorm"

export interface BaseRepositoryInterface<T> {
  create(data: DeepPartial<T>): T

  save(data: DeepPartial<T>): Promise<T>

  findOneById(id: number): Promise<T>

  findByCondition(filterCondition: FindOneOptions<T>): Promise<T>

  findAll(options?: FindManyOptions<T>): Promise<T[]>

  softDelete(id: number): Promise<UpdateResult>

  findWithRelations(relations: FindManyOptions<T>): Promise<T[]>
}
