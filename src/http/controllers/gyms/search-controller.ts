import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { makeSearchGymsUseCase } from "@/use-cases/factories/make-search-gyms-use-case";

export async function search(req: FastifyRequest, res: FastifyReply) {
  const searhGymsQuerySchema = z.object({
    q: z.string(),
    page: z.coerce.number().min(1).default(1),
  });

  const { q, page } = searhGymsQuerySchema.parse(req.query);

  const searchGymsUseCase = makeSearchGymsUseCase();

  const { gyms } = await searchGymsUseCase.execute({
    query: q,
    page: page,
  });

  return res.status(200).send({
    gyms,
  });
}
