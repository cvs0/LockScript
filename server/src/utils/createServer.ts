import fastify, { FastifyReply, FastifyRequest } from "fastify";
import cors from "@fastify/cors";
import jwt from "@fastify/jwt";
import fs from "fs";
import path from "path";
import { CORS_ORIGIN } from "../constants";
import cookie from "@fastify/cookie";
import vaultRoutes from "../modules/vault/vault.route";
import userRoutes from "../modules/user/user.routes";
import logger from "./logger";

// Extend the FastifyInstance interface to include the 'authenticate' decorator.
declare module "fastify" {
  export interface FastifyInstance {
    authenticate: any;
  }
}

/**
 * Creates a Fastify server instance with necessary plugins and route registrations.
 * @returns {FastifyInstance} - The configured Fastify server instance.
 */
function createServer() {

  // Create a new Fastify server instance.
  const app = fastify();

  // Register CORS plugin to enable Cross-Origin Resource Sharing.
  app.register(cors, {
    origin: CORS_ORIGIN,
    credentials: true,
  });

  // Register JWT authentication plugin for handling JSON Web Tokens.
  app.register(jwt, {
    secret: {
      // Read private and public keys from the 'certs' directory.
      private: fs.readFileSync(path.join(process.cwd(), "certs", "private.key")),
      public: fs.readFileSync(path.join(process.cwd(), "certs", "public.key")),
    },
    sign: {
      algorithm: "RS256",
    },
    cookie: {
      cookieName: "token",
      signed: false,
    },
  });

  // Register the Fastify cookie plugin for handling cookies.
  app.register(cookie, {
    parseOptions: {},
  });

  // Decorate the Fastify instance with a custom 'authenticate' method.
  app.decorate(
    "authenticate",
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        // Verify the JWT and attach user information to the request.
        const user = await request.jwtVerify<{
          _id: string;
        }>();
        request.user = user;
      } catch (e) {
        // Handle authentication errors and send the error response.
        return reply.send(e);
      }
    }
  );

  // Register userRoutes with a prefix of 'api/users'.
  app.register(userRoutes, { prefix: "api/users" });
  // Register vaultRoutes with a prefix of 'api/vault'.
  app.register(vaultRoutes, { prefix: "api/vault" });

  // Return the configured Fastify server instance.
  return app;
}

// Export the createServer function as the default export for this module.
export default createServer;
