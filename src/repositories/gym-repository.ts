import { Gym, Prisma } from "@prisma/client";

export interface findManyNearByParams {
  latitude: number;
  longitude: number;
}

export interface GymsRepository {
  findById(id: string): Promise<Gym | null>;
  findManyNearBy(params: findManyNearByParams): Promise<Gym[]>;
  searchMany(query: string, page: number): Promise<Gym[]>;
  create(data: Prisma.GymCreateInput): Promise<Gym>;
}
