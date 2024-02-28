import { inMemoryGymsRepository } from "@/repositories/in-memmory/in-memory-gyms-repository";
import { expect, describe, it, beforeEach, vi, afterEach } from "vitest";
import { SearchGymUseCase } from "./search-gyms";

let gymsRepository: inMemoryGymsRepository;
let sut: SearchGymUseCase;

describe("Search Gyms Use Case", () => {
  beforeEach(async () => {
    gymsRepository = new inMemoryGymsRepository();
    sut = new SearchGymUseCase(gymsRepository);
  });

  it("should be able to search for gyms", async () => {
    await gymsRepository.create({
      title: "JavaScript Gym",
      description: null,
      phone: null,
      latitude: -18.9083643,
      longitude: -48.2692181,
    });

    await gymsRepository.create({
      title: "TypeScript Gym",
      description: null,
      phone: null,
      latitude: -18.9083643,
      longitude: -48.2692181,
    });

    const { gyms } = await sut.execute({
      query: "JavaScript Gym",
      page: 1,
    });

    expect(gyms).toHaveLength(1);
    expect(gyms).toEqual([
      expect.objectContaining({ title: "JavaScript Gym" }),
    ]);
  });

  it("should be able to fetch paginated gym search", async () => {
    for (let i = 1; i <= 22; i++) {
      await gymsRepository.create({
        title: `JavaScript Gym ${i}`,
        description: null,
        phone: null,
        latitude: -18.9083643,
        longitude: -48.2692181,
      });
    }

    const { gyms } = await sut.execute({
      query: "JavaScript",
      page: 2,
    });

    expect(gyms).toHaveLength(2);
    expect(gyms).toEqual([
      expect.objectContaining({ title: "JavaScript Gym 21" }),
      expect.objectContaining({ title: "JavaScript Gym 22" }),
    ]);
  });
});
