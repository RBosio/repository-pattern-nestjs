import { Body, Controller, Get, Param, Post } from "@nestjs/common"
import { UserService } from "./user.service"
import { CreateUserDto } from "./dto/create-user.dto"

@Controller("user")
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  getAll() {
    return this.userService.findAll()
  }

  @Get(":id")
  getOneById(@Param("id") id: string) {
    return this.userService.findOneById(+id)
  }

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto)
  }
}
