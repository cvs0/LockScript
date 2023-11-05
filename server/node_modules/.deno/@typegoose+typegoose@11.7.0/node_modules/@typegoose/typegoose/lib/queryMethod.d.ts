import type { Query } from 'mongoose';
import type { AnyParamConstructor, QueryHelperThis } from './types';
/**
 * Adds a query method to the Class which will then be added to the Schema.
 * @param func The Query Method to add
 * @example
 * ```ts
 * interface FindHelpers {
 *   findByTitle: AsQueryMethod<typeof findByTitle>;
 * }
 *
 * function findByTitle(this: ReturnModelType<typeof Event, FindHelpers>, title: string) {
 *  return this.find({ title });
 * }
 *
 * @queryMethod(findByTitle)
 * class Event {
 *  @prop()
 *  public title: string;
 * }
 *
 * const EventModel = getModelForClass<typeof Event, FindHelpers>(Event);
 * ```
 */
export declare function queryMethod<QueryHelpers, U extends AnyParamConstructor<any>>(func: (this: QueryHelperThis<U, QueryHelpers>, ...params: any[]) => Query<any, any>): ClassDecorator;
export { queryMethod as QueryMethod };
