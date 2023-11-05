import { ZodSchema, ZodType, z } from "zod";
export declare const isZod: <T>(Type: ZodSchema<T, z.ZodTypeDef, T>) => (input: unknown) => input is T;
export type ZodShape<T> = {
    [key in keyof T]-?: undefined extends T[key] ? z.ZodOptionalType<z.ZodType<T[key]>> : z.ZodType<T[key]>;
};
export declare const ZodShape: <T>(shape: ZodShape<T>) => ZodSchema<T, z.ZodTypeDef, T>;
export declare const isRecord: (input: unknown) => input is Record<string, unknown>;
export declare const mapDeep: (current: unknown, replace: (value: unknown) => void) => unknown;
export declare const findFirstDeep: (current: unknown, predicate: (value: unknown, path: string[]) => boolean, path?: string[]) => [found: boolean, value: unknown, path: string[]];
export declare const visitDeep: (current: unknown, visit: (value: unknown, path: string[]) => void, path?: string[]) => void;
