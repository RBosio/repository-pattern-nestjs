import { BaseRepositoryInterface } from "src/repositories/base/base.repository.interface"
import { User } from "src/entities/user.entity"

export interface UserRepositoryInterface
  extends BaseRepositoryInterface<User> {}
