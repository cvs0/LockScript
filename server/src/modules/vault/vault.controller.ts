import { FastifyReply, FastifyRequest } from "fastify";
import { get } from "lodash";
import { updateVault } from "./vault.service";
import logger from "../../utils/logger";

export async function updateVaultHandler(
  request: FastifyRequest<{
    Body: {
      encryptedVault: string;
    };
  }>,
  reply: FastifyReply
) {
  const userId = get(request, "user._id");

  try {
    if (userId) {
      await updateVault({
        data: request.body.encryptedVault,
        userId: userId as string,
      });

      return reply.code(200).send("Vault updated");
    } else {
      return reply.code(401).send("User not authenticated");
    }
  } catch (e) {
    logger.error(e, "error updating vault");
    return reply.code(500).send(e);
  }
}
