import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import { UserRepositoryInterface } from "src/interfaces/user.interface"
import { User } from "src/entities/user.entity"
import { BaseAbstractRepostitory } from "./base/base.abstract.repository"

export class UserRepository
  extends BaseAbstractRepostitory<User>
  implements UserRepositoryInterface
{
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {
    super(userRepository)
  }
}
