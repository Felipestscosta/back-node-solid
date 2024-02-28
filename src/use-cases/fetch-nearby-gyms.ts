import { usersRepository } from "@/repositories/users-repositories";
import { UserAlreadyExistsError } from "./errors/user-already-exists";
import { hash } from "bcryptjs";
import { Gym, User } from "@prisma/client";
import { GymsRepository } from "@/repositories/gym-repository";

interface FetchNearByGymsUseCaseRequest {
  userLatitude: number;
  userLongitude: number;
}

interface GetchNearByGymsUseCaseResponse {
  gyms: Gym[];
}

export class FetchNearByGymsUseCase {
  constructor(private gymsRepository: GymsRepository) {}

  async execute({
    userLatitude,
    userLongitude,
  }: FetchNearByGymsUseCaseRequest): Promise<GetchNearByGymsUseCaseResponse> {
    const gyms = await this.gymsRepository.findManyNearBy({
      latitude: userLatitude,
      longitude: userLongitude,
    });

    return { gyms };
  }
}
