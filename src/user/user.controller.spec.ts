import { Test, TestingModule } from "@nestjs/testing"
import { UserService } from "./user.service"
import { UserController } from "./user.controller"
import { mockUser } from "src/__mocks__/user/user.mock"
import { mockCreateUser } from "src/__mocks__/user/create-user.mock"
import { mockUpdateUser } from "src/__mocks__/user/update-user.mock"
import { BadRequestException, NotFoundException } from "@nestjs/common"

const mockUserService = {
  findAll: jest.fn(),
  findOneById: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
}

describe("UserController", () => {
  let userController: UserController
  let userService: UserService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile()

    userController = module.get(UserController)
    userService = module.get(UserService)
  })

  it("should be defined", () => {
    expect(userController).toBeDefined()
    expect(userService).toBeDefined()
  })

  describe("getAll", () => {
    it("should return an array of users", async () => {
      jest.spyOn(userService, "findAll").mockResolvedValue([mockUser])

      const result = await userController.getAll()

      expect(result).toEqual([mockUser])
      expect(userService.findAll).toHaveBeenCalledTimes(1)
    })
  })

  describe("getOneById", () => {
    it("should return an user finded by id", async () => {
      jest.spyOn(userService, "findOneById").mockResolvedValue(mockUser)

      const result = await userController.getOneById("1")

      expect(result).toEqual(mockUser)
      expect(userService.findOneById).toHaveBeenCalledTimes(1)
      expect(userService.findOneById).toHaveBeenCalledWith(1)
    })

    it("should throw a NotFoundException if user not exist", async () => {
      jest
        .spyOn(userService, "findOneById")
        .mockRejectedValueOnce(new NotFoundException())

      await expect(userController.getOneById("-1")).rejects.toThrow(
        NotFoundException,
      )
    })
  })

  describe("create", () => {
    it("should create and return user created", async () => {
      jest.spyOn(userService, "create").mockResolvedValue(mockUser)

      const result = await userController.create(mockCreateUser)

      expect(result).toEqual(mockUser)
      expect(userService.create).toHaveBeenCalledTimes(1)
      expect(userService.create).toHaveBeenCalledWith(mockCreateUser)
    })

    it("should throw a BadRequestException if email already exists", async () => {
      jest
        .spyOn(userService, "create")
        .mockRejectedValueOnce(new BadRequestException())

      const mockCreateUserError = { ...mockCreateUser, email: "fake@gmail.com" }

      await expect(userController.create(mockCreateUserError)).rejects.toThrow(
        BadRequestException,
      )
    })
  })

  describe("update", () => {
    it("should update and return user updated", async () => {
      jest.spyOn(userService, "update").mockResolvedValue(mockUser)

      const result = await userController.update("1", mockUpdateUser)

      expect(result).toEqual(mockUser)
      expect(userService.update).toHaveBeenCalledTimes(1)
      expect(userService.update).toHaveBeenCalledWith(1, mockUpdateUser)
    })

    it("should throw a NotFoundException if user not exist", async () => {
      jest
        .spyOn(userService, "update")
        .mockRejectedValueOnce(new NotFoundException())

      await expect(userController.update("-1", mockUpdateUser)).rejects.toThrow(
        NotFoundException,
      )
    })
  })

  describe("delete", () => {
    it("should delete and return user deleted", async () => {
      jest.spyOn(userService, "delete").mockResolvedValue(mockUser)

      const result = await userController.delete("1")

      expect(result).toEqual(mockUser)
      expect(userService.delete).toHaveBeenCalledTimes(1)
      expect(userService.delete).toHaveBeenCalledWith(1)
    })

    it("should throw a NotFoundException if user not exist", async () => {
      jest
        .spyOn(userService, "delete")
        .mockRejectedValueOnce(new NotFoundException())

      await expect(userController.delete("-1")).rejects.toThrow(
        NotFoundException,
      )
    })
  })
})
