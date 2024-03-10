import { Test, TestingModule } from "@nestjs/testing"
import { UserService } from "./user.service"
import { UserRepository } from "src/repositories/user.repository"
import { User } from "src/entities/user.entity"
import { BadRequestException, NotFoundException } from "@nestjs/common"
import { CreateUserDto } from "./dto/create-user.dto"
import { UpdateUserDto } from "./dto/update-user.dto"

const mockUser: User = {
  id: 1,
  email: "fido@gmail.com",
  password: "123",
  firstname: "fido",
  lastname: "d",
  deleted_at: null,
}

const mockCreateUser: CreateUserDto = {
  email: "fido@gmail.com",
  password: "123",
  firstname: "fido",
  lastname: "d",
}

const mockUpdateUser: UpdateUserDto = {
  password: "456",
}

const mockUserRepository = {
  findAll: jest.fn(),
  findOneById: jest.fn(),
  findByCondition: jest.fn(),
  save: jest.fn(),
  softDelete: jest.fn(),
}

describe("UserService", () => {
  let userService: UserService
  let userRepository: UserRepository

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: UserRepository,
          useValue: mockUserRepository,
        },
      ],
    }).compile()

    userService = module.get<UserService>(UserService)
    userRepository = module.get<UserRepository>(UserRepository)
  })

  describe("findAll", () => {
    it("should return an array of users", async () => {
      const re = jest
        .spyOn(userRepository, "findAll")
        .mockResolvedValue([mockUser])

      const result = await userService.findAll()

      expect(result).toEqual([mockUser])
      expect(userRepository.findAll).toHaveBeenCalledTimes(1)
      re.mockRestore()
    })

    it("should return an empty array if no users", async () => {
      jest.spyOn(userRepository, "findAll").mockResolvedValueOnce([])

      const result = await userService.findAll()

      expect(result).toEqual([])
      expect(userRepository.findAll).toHaveBeenCalledTimes(1)
    })
  })

  describe("findOneById", () => {
    it("should find and return a user by id", async () => {
      jest.spyOn(userRepository, "findOneById").mockResolvedValue(mockUser)

      const result = await userService.findOneById(mockUser.id)

      expect(result).toEqual(mockUser)
      expect(userRepository.findOneById).toHaveBeenCalledTimes(1)
      expect(userRepository.findOneById).toHaveBeenCalledWith(mockUser.id)
    })

    it("should throw NotFoundException if user not found", async () => {
      const id = -1
      const userExistMock = jest
        .spyOn(userRepository, "findOneById")
        .mockResolvedValue(null)

      await expect(userService.findOneById(id)).rejects.toThrow(
        NotFoundException,
      )
      expect(userExistMock).toHaveBeenCalledWith(id)
      userExistMock.mockRestore()
    })
  })

  describe("findOneByEmail", () => {
    it("should find and return a user by email", async () => {
      jest.spyOn(userRepository, "findByCondition").mockResolvedValue(mockUser)

      const result = await userService.findOneByEmail(mockUser.email)

      expect(result).toEqual(mockUser)
      expect(userRepository.findByCondition).toHaveBeenCalledTimes(1)
    })

    it("should return null if user not found", async () => {
      const email = "notfound@gmail.com"
      const userExistMock = jest
        .spyOn(userRepository, "findByCondition")
        .mockResolvedValue(null)

      const result = await userService.findOneByEmail(email)

      expect(result).toEqual(null)
      userExistMock.mockRestore()
    })
  })

  describe("create", () => {
    it("should throw BadRequestException if email already exists", async () => {
      jest.spyOn(userService, "findOneByEmail").mockResolvedValue(mockUser)

      await expect(userService.create(mockCreateUser)).rejects.toThrow(
        BadRequestException,
      )
      expect(userService.findOneByEmail).toHaveBeenCalledWith(
        mockCreateUser.email,
      )
    })

    it("should create and return user created", async () => {
      jest.spyOn(userService, "findOneByEmail").mockResolvedValue(null)
      jest.spyOn(userRepository, "save").mockResolvedValue(mockUser)

      const result = await userService.create(mockCreateUser)

      expect(result).toEqual(mockUser)
      expect(userService.findOneByEmail).toHaveBeenCalledTimes(1)
      expect(userService.findOneByEmail).toHaveBeenCalledWith(
        mockCreateUser.email,
      )
    })
  })

  describe("update", () => {
    it("should throw NotFoundException if user not found", async () => {
      const id = -1
      jest
        .spyOn(userService, "findOneById")
        .mockRejectedValueOnce(new NotFoundException("user not found"))

      await expect(userService.update(id, mockCreateUser)).rejects.toThrow(
        NotFoundException,
      )
      expect(userService.findOneById).toHaveBeenCalledWith(id)
    })

    it("should update and return user updated", async () => {
      const updatedUser = { ...mockUser, password: "456" }

      jest.spyOn(userService, "findOneById").mockResolvedValue(mockUser)
      jest.spyOn(userRepository, "save").mockResolvedValue(updatedUser)

      const result = await userService.update(mockUser.id, mockUpdateUser)

      expect(result.password).toEqual(mockUpdateUser.password)
      expect(userService.findOneById).toHaveBeenCalledWith(mockUser.id)
    })
  })

  describe("delete", () => {
    it("should throw NotFoundException if user not found", async () => {
      const id = -1
      jest
        .spyOn(userService, "findOneById")
        .mockRejectedValueOnce(new NotFoundException("user not found"))

      await expect(userService.delete(id)).rejects.toThrow(NotFoundException)
      expect(userService.findOneById).toHaveBeenCalledWith(id)
    })

    it("should delete and return user deleted", async () => {
      jest.spyOn(userService, "findOneById").mockResolvedValue(mockUser)

      const result = await userService.delete(mockUser.id)

      expect(result).toEqual(mockUser)
      expect(userService.findOneById).toHaveBeenCalledWith(mockUser.id)
      expect(userRepository.softDelete).toHaveBeenCalledTimes(1)
      expect(userRepository.softDelete).toHaveBeenCalledWith(mockUser.id)
    })
  })
})
