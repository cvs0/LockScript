import { FastifyInstance, FastifyServerOptions } from "fastify";
import { FastifyDynamicSwaggerOptions } from "@fastify/swagger";
import { BuildJsonSchemasOptions } from "../JsonSchema";
export declare const createLegacyTestServer: (fastifyOptions: FastifyServerOptions, buildJsonSchemasOptions: BuildJsonSchemasOptions, swaggerOptions: FastifyDynamicSwaggerOptions) => FastifyInstance;
