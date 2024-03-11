import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from "@nestjs/common"
import { User } from "src/entities/user.entity"
import { UserRepository } from "src/repositories/user.repository"
import { CreateUserDto } from "./dto/create-user.dto"
import { UpdateUserDto } from "./dto/update-user.dto"

@Injectable()
export class UserService {
  constructor(private userRepository: UserRepository) {}

  async findAll(): Promise<User[]> {
    return this.userRepository.findAll()
  }

  async findOneById(id: number): Promise<User> {
    const user = await this.userRepository.findOneById(id)
    if (!user) throw new NotFoundException("user not found")

    return user
  }

  async findOneByEmail(email: string): Promise<User> {
    return this.userRepository.findByCondition({
      where: {
        email,
      },
    })
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = await this.findOneByEmail(createUserDto.email)
    if (user) throw new BadRequestException("email already exists")

    return this.userRepository.save(createUserDto)
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOneById(id)
    const userUpdated = Object.assign(user, updateUserDto)

    return this.userRepository.save(userUpdated)
  }

  async delete(id: number): Promise<User> {
    const user = await this.findOneById(id)
    await this.userRepository.softDelete(id)

    return user
  }
}
