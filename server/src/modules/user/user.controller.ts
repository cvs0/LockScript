import { FastifyReply, FastifyRequest } from "fastify";
import { createUser, generateSalt } from "./user.service";
import { createVault } from "../vault/vault.service";
import { COOKIE_DOMAIN } from "../../constants";
import logger from "../../utils/logger";

export async function registerUserHandler(
    request: FastifyRequest<{
      Body: Parameters<typeof createUser>[number];
    }>,
    reply: FastifyReply
  ) {
    const body = request.body;

    try {
        const user = await createUser(body);

        const salt = generateSalt();

        const vault = await createVault({ user: user._id.toString(), salt });
        const accessToken = await reply.jwtSign({
            _id: user._id,
            email: user.email,
        });

        reply.setCookie("token", accessToken, {
            domain: COOKIE_DOMAIN,
            path: '/',

            // It is false because we are not using TLS in development. This MUST be true in production.
            secure: false,
            httpOnly: true,
            sameSite: false,
        });

        return reply.code(201).send({ accessToken, vault: vault.data, salt });
    } catch(e) {
        logger.error(e, 'error creating user.');
        return reply.code(500).send(e);
    }
}