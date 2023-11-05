type Helpers = {
    $schema: Record<string, unknown>;
    constOrEnum: (value: unknown) => Record<string, unknown>;
    stringEnum: (values: unknown[]) => Record<string, unknown>;
    target?: `jsonSchema7` | `openApi3`;
};
export declare const helpers: (target: `jsonSchema7` | `openApi3` | undefined) => Helpers;
export {};
