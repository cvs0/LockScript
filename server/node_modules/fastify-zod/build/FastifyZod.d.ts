/// <reference types="node" />
import { IncomingMessage, ServerResponse } from "http";
import { FastifyInstance, FastifyRequest, FastifySchema, HTTPMethods as FastifyHTTPMethods, FastifyReply, RawServerBase } from "fastify";
import { FastifyDynamicSwaggerOptions } from "@fastify/swagger";
import { FastifySwaggerUiOptions } from "@fastify/swagger-ui";
import { TransformOptions } from "./SpecTransformer";
import { BuildJsonSchemasResult } from "./JsonSchema";
import { Models as M_, SchemaKey, SchemaTypeOption } from "./Models";
export type RegisterOptions<M extends M_> = {
    readonly jsonSchemas: BuildJsonSchemasResult<M>;
    readonly transformSpec?: {
        readonly cache?: boolean;
        readonly routePrefix?: string;
        readonly options?: TransformOptions;
    };
    readonly swaggerOptions?: FastifyDynamicSwaggerOptions;
    readonly swaggerUiOptions?: false | FastifySwaggerUiOptions;
};
type V_ = Lowercase<FastifyHTTPMethods> & keyof FastifyInstance;
type P_<M extends M_> = void | SchemaKey<M>;
type B_<M extends M_> = void | SchemaKey<M>;
type Q_<M extends M_> = void | SchemaKey<M>;
type R_<M extends M_> = void | SchemaKey<M>;
type Rx_<M extends M_> = void | Record<number, void | SchemaKey<M>>;
type FatifyZodRouteGenericInterface<M extends M_, P extends P_<M>, B extends B_<M>, Q extends Q_<M>, R extends R_<M>, Rx extends Rx_<M>> = {
    Params: SchemaTypeOption<M, P>;
    Body: SchemaTypeOption<M, B>;
    Reply: SchemaTypeOption<M, R | (Rx extends Record<number, unknown> ? Rx[number] : never)>;
    Querystring: SchemaTypeOption<M, Q>;
};
type RouteHandlerParams<M extends M_, P extends P_<M>, B extends B_<M>, Q extends Q_<M>, R extends R_<M>, Rx extends Rx_<M>> = FastifyRequest<FatifyZodRouteGenericInterface<M, P, B, Q, R, Rx>>;
type RouteHandler<M extends M_, P extends P_<M>, B extends B_<M>, Q extends Q_<M>, R extends R_<M>, Rx extends Rx_<M>> = (params: RouteHandlerParams<M, P, B, Q, R, Rx>, reply: FastifyReply<RawServerBase, IncomingMessage, ServerResponse, FatifyZodRouteGenericInterface<M, P, B, Q, R, Rx>>) => Promise<SchemaTypeOption<M, R | (Rx extends Record<number, unknown> ? Rx[number] : never)>>;
type RouteConfig<M extends M_, V extends V_, P extends P_<M>, B extends B_<M>, Q extends Q_<M>, R extends R_<M>, Rx extends Rx_<M>> = {
    readonly url: string;
    readonly method: V;
    readonly operationId: string;
    readonly description?: string;
    readonly params?: Exclude<P, void> | {
        readonly description: string;
        readonly key: Exclude<P, void>;
    };
    readonly body?: Exclude<B, void> | {
        readonly description: string;
        readonly key: Exclude<B, void>;
    };
    readonly querystring?: Exclude<Q, void> | {
        readonly description: string;
        readonly key: Exclude<Q, void>;
    };
    readonly reply?: Exclude<R, void> | {
        readonly description: string;
        readonly key: Exclude<R, void>;
    };
    readonly response?: Rx extends Record<number, unknown> ? {
        readonly [Code in keyof Rx]: Exclude<Rx[Code], void> | {
            readonly description: string;
            readonly key: Exclude<Rx[Code], void>;
        };
    } : void;
    readonly handler: RouteHandler<M, P, B, Q, R, Rx>;
} & FastifySchema;
export type FastifyZod<M extends M_> = {
    readonly [Method in V_]: <P extends P_<M>, B extends B_<M>, Q extends Q_<M>, R extends R_<M>, Rx extends Rx_<M>>(url: string, config: Omit<RouteConfig<M, Method, P, B, Q, R, Rx>, `url` | `method` | `schema` | `handler`>, handler: RouteHandler<M, P, B, Q, R, Rx>) => void;
};
export type FastifyZodInstance<M extends M_> = FastifyInstance & {
    readonly zod: FastifyZod<M>;
};
export declare const withRefResolver: (options: FastifyDynamicSwaggerOptions) => FastifyDynamicSwaggerOptions;
export declare const register: <M extends M_>(f: FastifyInstance, { jsonSchemas: { schemas, $ref }, swaggerOptions, swaggerUiOptions, transformSpec, }: RegisterOptions<M>) => Promise<FastifyZodInstance<M>>;
export {};
