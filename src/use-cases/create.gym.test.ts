import { expect, describe, it, beforeEach } from "vitest";
import { inMemoryGymsRepository } from "@/repositories/in-memmory/in-memory-gyms-repository";
import { createGymUseCase } from "./create-gym";

let gymsRepository: inMemoryGymsRepository;
let sut: createGymUseCase;

describe("Register Use Case", () => {
  beforeEach(() => {
    gymsRepository = new inMemoryGymsRepository();
    sut = new createGymUseCase(gymsRepository);
  });

  it("should be able to create gym", async () => {
    const { gym } = await sut.execute({
      title: "JavaScript Gym",
      description: null,
      phone: null,
      latitude: -18.9083643,
      longitude: -48.2692181,
    });

    expect(gym.id).toEqual(expect.any(String));
  });
});
