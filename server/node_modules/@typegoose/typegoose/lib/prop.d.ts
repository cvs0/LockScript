import { PropType } from './internal/constants';
import type { ArrayPropOptions, BasePropOptions, MapPropOptions, PropOptionsForNumber, PropOptionsForString, VirtualOptions } from './types';
/**
 * Set Property Options for the property below
 * @param options The Options to Set
 * @param kind Overwrite auto-inferred PropType
 * @example
 * ```ts
 * class ClassName {
 *   @prop()
 *   public someProp?: string;
 *
 *   @prop({ type: () => [String] })
 *   public someArrayProp?: string[];
 *
 *   @prop({ type: () => String })
 *   public someMapProp?: Map<string, string>;
 * }
 * ```
 */
declare function prop(options?: BasePropOptions | ArrayPropOptions | MapPropOptions | PropOptionsForNumber | PropOptionsForString | VirtualOptions, kind?: PropType): PropertyDecorator;
export { prop };
export { prop as Prop };
