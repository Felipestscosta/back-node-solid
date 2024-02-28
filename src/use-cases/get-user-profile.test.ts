import { expect, describe, it, beforeEach } from "vitest";
import { hash } from "bcryptjs";
import { inMemoryUsersRepository } from "@/repositories/in-memmory/in-memory-users-repository";
import { GetUserProfileUseCase } from "./get-user-profile";
import { ResourceNotFoundError } from "./errors/invalid-resource-not-found-error";

let usersRepository: inMemoryUsersRepository;
let sut: GetUserProfileUseCase;

describe("Get User Profile Use Case", () => {
  beforeEach(() => {
    usersRepository = new inMemoryUsersRepository();
    sut = new GetUserProfileUseCase(usersRepository);
  });

  it("should be able to get user profile", async () => {
    const createdUser = await usersRepository.create({
      name: "John Doe",
      email: "johndoe@example.com",
      password_hash: await hash("123456", 6),
    });

    const { user } = await sut.execute({
      userId: createdUser.id,
    });

    expect(user.id).toEqual(expect.any(String));
    expect(user.name).toEqual("John Doe");
  });

  it("should be able to get user profile with wrong id", async () => {
    await expect(() =>
      sut.execute({
        userId: "non-exist-id",
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});
