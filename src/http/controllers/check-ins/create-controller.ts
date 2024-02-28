import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { makeCheckInUseCase } from "@/use-cases/factories/make-check-in-use-case";

export async function create(req: FastifyRequest, res: FastifyReply) {
  const createCheckParamsSchema = z.object({
    gymId: z.string().uuid(),
  });

  const createCheckInBodySchema = z.object({
    latitude: z.number().refine((value) => {
      return Math.abs(value) <= 90;
    }),
    longitude: z.number().refine((value) => {
      return Math.abs(value) <= 180;
    }),
  });

  const { gymId } = createCheckParamsSchema.parse(req.params);
  const { latitude, longitude } = createCheckInBodySchema.parse(req.body);

  const checkInUseCase = makeCheckInUseCase();

  await checkInUseCase.execute({
    gymId,
    userId: req.user.sub,
    userLatitude: latitude,
    userLongitude: longitude,
  });

  res.status(201).send();
}
