import { FastifyError, FastifyInstance, FastifyPluginOptions } from "fastify";
import { loginHandler, registerUserHandler } from "./user.controller";

/**
 * Defines routes related to user functionality.
 * @param {FastifyInstance} app - The Fastify instance to which the routes are added.
 * @param {FastifyPluginOptions} _ - FastifyPluginOptions object (not used in this function).
 * @param {(err?: FastifyError) => void} done - Callback function to signal completion.
 */
function userRoutes(
  app: FastifyInstance,
  _: FastifyPluginOptions,
  done: (err?: FastifyError) => void
) {
  // Define a POST route for user registration.
  app.post("/", registerUserHandler);

  // Define a POST route for user login.
  app.post("/login", loginHandler);

  // Signal that route registration is complete.
  done();
}

// Export the userRoutes function as the default export for this module.
export default userRoutes;
