import { inMemoryGymsRepository } from "@/repositories/in-memmory/in-memory-gyms-repository";
import { expect, describe, it, beforeEach } from "vitest";
import { FetchNearByGymsUseCase } from "./fetch-nearby-gyms";

let gymsRepository: inMemoryGymsRepository;
let sut: FetchNearByGymsUseCase;

describe("Fetach NearBy Gyms User Use Case", () => {
  beforeEach(async () => {
    gymsRepository = new inMemoryGymsRepository();
    sut = new FetchNearByGymsUseCase(gymsRepository);
  });

  it("should be able to fetch nearby gyms", async () => {
    await gymsRepository.create({
      title: "Near Gym",
      description: null,
      phone: null,
      latitude: -18.9083643,
      longitude: -48.2692181,
    });

    await gymsRepository.create({
      title: "Far Gym",
      description: null,
      phone: null,
      latitude: -18.8688169,
      longitude: -48.8733559,
    });

    const { gyms } = await sut.execute({
      userLatitude: -18.9083643,
      userLongitude: -48.2692181,
    });

    expect(gyms).toHaveLength(1);
    expect(gyms).toEqual([expect.objectContaining({ title: "Near Gym" })]);
  });
});
