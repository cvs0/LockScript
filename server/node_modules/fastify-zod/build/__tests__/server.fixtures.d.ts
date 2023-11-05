import { FastifyInstance, FastifyServerOptions } from "fastify";
import { RegisterOptions } from "../FastifyZod";
import { models } from "./models.fixtures";
export declare const swaggerOptions: RegisterOptions<typeof models>[`swaggerOptions`];
export declare const openApiOptions: RegisterOptions<typeof models>[`swaggerOptions`];
export declare const swaggerUiOptions: RegisterOptions<typeof models>[`swaggerUiOptions`];
export declare const createTestServer: (fastifyOptions: FastifyServerOptions, registerOptions: RegisterOptions<typeof models>) => Promise<FastifyInstance>;
