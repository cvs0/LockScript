import { z, ZodType } from "zod";
import { Models, SchemaKeyOrDescription } from "./Models";
export type BuildJsonSchemasOptions = {
    readonly $id?: string;
    readonly target?: `jsonSchema7` | `openApi3`;
    readonly errorMessages?: boolean;
};
export type $Ref<M extends Models> = (key: SchemaKeyOrDescription<M>) => {
    readonly $ref: string;
    readonly description?: string;
};
export type JsonSchema = {
    readonly $id: string;
};
export type BuildJsonSchemasResult<M extends Models> = {
    readonly schemas: JsonSchema[];
    readonly $ref: $Ref<M>;
};
/**
 * @deprecated
 */
export declare const buildJsonSchema: <T>(Type: z.ZodType<T, z.ZodTypeDef, T>, schemaKey: string) => JsonSchema;
export declare const buildJsonSchemas: <M extends Models>(models: M, opts?: BuildJsonSchemasOptions) => BuildJsonSchemasResult<M>;
