import { FastifyError, FastifyInstance, FastifyPluginOptions } from "fastify";
import { handleEmail, loginHandler, registerUserHandler } from "./user.controller";

function userRoutes(
  app: FastifyInstance,
  _: FastifyPluginOptions,
  done: (err?: FastifyError) => void
) {
  app.post("/", registerUserHandler);
  app.post("/login", loginHandler);
  app.get("/email", handleEmail)
  done();
}

export default userRoutes;
