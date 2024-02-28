import { expect, describe, it, beforeEach, vi, afterEach } from "vitest";
import { inMemoryCheckInsRepository } from "@/repositories/in-memmory/in-memory-check-ins-repository";
import { CheckInUseCase } from "./check-in";
import { inMemoryGymsRepository } from "@/repositories/in-memmory/in-memory-gyms-repository";
import { Decimal } from "@prisma/client/runtime/library";
import { MaxNumberOfCheckInsError } from "./errors/max-number-of-check-ins-errors";
import { MaxDistanceError } from "./errors/max-distance-error";

let checkInsRepository: inMemoryCheckInsRepository;
let gymsRepository: inMemoryGymsRepository;
let sut: CheckInUseCase;

describe("Register Use Case", () => {
  beforeEach(async () => {
    checkInsRepository = new inMemoryCheckInsRepository();
    gymsRepository = new inMemoryGymsRepository();
    sut = new CheckInUseCase(checkInsRepository, gymsRepository);

    await gymsRepository.create({
      id: "gym-01",
      title: "Javscript Gym",
      description: "",
      phone: "",
      latitude: -18.9083643,
      longitude: -48.2692181,
    });

    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should be able to check in", async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0));

    const { checkIn } = await sut.execute({
      userId: "user-01",
      gymId: "gym-01",
      userLatitude: -18.9083643,
      userLongitude: -48.2692181,
    });

    expect(checkIn.id).toEqual(expect.any(String));
  });

  it("should not be able to check in twice in the same day", async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0));

    await sut.execute({
      userId: "user-01",
      gymId: "gym-01",
      userLatitude: -18.9083643,
      userLongitude: -48.2692181,
    });

    await expect(() =>
      sut.execute({
        userId: "user-01",
        gymId: "gym-01",
        userLatitude: -18.9083643,
        userLongitude: -48.2692181,
      })
    ).rejects.toBeInstanceOf(MaxNumberOfCheckInsError);
  });

  it("should not be able to check in twice but in different days", async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0));

    await sut.execute({
      userId: "user-01",
      gymId: "gym-01",
      userLatitude: -18.9083643,
      userLongitude: -48.2692181,
    });

    vi.setSystemTime(new Date(2022, 0, 21, 8, 0, 0));

    const { checkIn } = await sut.execute({
      userId: "user-01",
      gymId: "gym-01",
      userLatitude: -18.9083643,
      userLongitude: -48.2692181,
    });

    expect(checkIn.id).toEqual(expect.any(String));
  });

  it("should not be able to check in on distant gym", async () => {
    // -18.891271,-48.245486

    gymsRepository.items.push({
      id: "gym-02",
      title: "JavaScript Gym",
      description: "",
      phone: "",
      latitude: new Decimal(-18.7127522),
      longitude: new Decimal(-48.045281),
    });

    await expect(() =>
      sut.execute({
        userId: "user-01",
        gymId: "gym-02",
        userLatitude: -18.9083643,
        userLongitude: -48.2692181,
      })
    ).rejects.toBeInstanceOf(MaxDistanceError);

    //expect(checkIn.id).toEqual(expect.any(String));
  });
});
