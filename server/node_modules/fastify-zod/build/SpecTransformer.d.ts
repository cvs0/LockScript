type Ref = {
    $ref: string;
};
type SpecSchema = {
    readonly properties?: Record<string, unknown>;
    readonly additionalProperties?: boolean | Record<string, unknown>;
    readonly patternProperties?: Record<string, unknown>;
    readonly items?: Record<string, unknown>;
};
type SpecSchemas = Record<string, SpecSchema>;
type OpenApiSpec = {
    readonly components: {
        readonly schemas: SpecSchemas;
    };
    readonly paths?: Record<string, unknown>;
};
type SwaggerSpec = {
    readonly definitions: SpecSchemas;
    readonly paths?: Record<string, unknown>;
};
export type Spec = OpenApiSpec | SwaggerSpec;
type ExtractSchemaPropertiesKey = `properties` | `additionalProperties` | `patternProperties` | `items`;
type Timings = {
    readonly begin: number;
    readonly end: number;
    readonly delta: number;
};
type TransformWithTimingsResult = {
    readonly spec: Spec;
    readonly timings: {
        readonly rewriteSchemasAbsoluteRefs: Timings;
        readonly extractSchemasProperties: Timings;
        readonly mergeRefs: Timings;
        readonly deleteUnusedSchemas: Timings;
        readonly total: Timings;
    };
};
type SchemaKeysOptions = {
    readonly removeInitialSchemasPrefix?: boolean;
    readonly changeCase?: `preserve` | `camelCase` | `PascalCase` | `snake_case` | `param-case`;
};
export type TransformOptions = {
    readonly rewriteSchemasAbsoluteRefs?: boolean;
    readonly extractSchemasProperties?: boolean | ExtractSchemaPropertiesKey[];
    readonly mergeRefs?: Ref[];
    readonly deleteUnusedSchemas?: boolean;
    readonly schemaKeys?: SchemaKeysOptions;
};
export declare class SpecTransformer {
    private readonly DEBUG;
    private readonly spec;
    private readonly initialSchemaKeys;
    private readonly schemasPath;
    constructor(spec: unknown, DEBUG?: boolean);
    private readonly _DEBUG;
    private readonly throw;
    private readonly getSchemaPath;
    private readonly getSchema;
    private readonly getSchemaKeys;
    private readonly createSchemaKey;
    private readonly getAtPath;
    private readonly getAtPathSafe;
    private readonly resolveRef;
    private readonly setAtPath;
    private readonly deleteAtPath;
    private readonly findFirstDeep;
    private readonly hasProperRef;
    private readonly deleteUnusedSchemas;
    private readonly rewriteSchemaAbsoluteRefs;
    private readonly rewriteSchemasAbsoluteRefs;
    private readonly extractSchemaPathAsSchema;
    private readonly extractSchemaPropertiesAtKey;
    private readonly extractSchemaProperties;
    private readonly extractSchemasProperties;
    private readonly mergeRef;
    private readonly mergeRefs;
    readonly transformWithTimings: (opts?: TransformOptions) => TransformWithTimingsResult;
    readonly transform: (opts?: TransformOptions) => Spec;
}
export {};
