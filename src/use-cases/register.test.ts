import { expect, describe, it, beforeEach } from "vitest";
import { RegisterUseCase } from "./register";
import { compare } from "bcryptjs";
import { inMemoryUsersRepository } from "@/repositories/in-memmory/in-memory-users-repository";
import { UserAlreadyExistsError } from "./errors/user-already-exists";

let usersRepository: inMemoryUsersRepository;
let sut: RegisterUseCase;

describe("Register Use Case", () => {
  beforeEach(() => {
    usersRepository = new inMemoryUsersRepository();
    sut = new RegisterUseCase(usersRepository);
  });

  it("should be able to register", async () => {
    const { user } = await sut.execute({
      name: "Example User Test",
      email: "example-1@example.com",
      password: "123456",
    });

    expect(user.id).toEqual(expect.any(String));
  });

  it("should hash user password upon registration", async () => {
    const { user } = await sut.execute({
      name: "Example User Test",
      email: "example-1@example.com",
      password: "123456",
    });

    const isPasswordCorrectlyHashed = await compare(
      "123456",
      user.password_hash
    );

    expect(isPasswordCorrectlyHashed).toBe(true);
  });

  it("should not be able to register with same email twice", async () => {
    const email = "johndoe@example.com";

    await sut.execute({
      name: "Example User Test",
      email,
      password: "123456",
    });

    await expect(() =>
      sut.execute({
        name: "Example User Test",
        email,
        password: "123456",
      })
    ).rejects.toBeInstanceOf(UserAlreadyExistsError);
  });
});
