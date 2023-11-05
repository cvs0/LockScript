"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.helpers = void 0;
var _zod = require("zod");
var _ = require("..");
const helpers = target => {
  if (target === `openApi3`) {
    return {
      $schema: {},
      constOrEnum: value => ({
        enum: [value]
      }),
      stringEnum: values => ({
        anyOf: values.map(value => ({
          type: `string`,
          enum: [value]
        }))
      }),
      target
    };
  }
  if (target === `jsonSchema7`) {
    return {
      $schema: {
        $schema: `http://json-schema.org/draft-07/schema#`
      },
      constOrEnum: value => ({
        const: value
      }),
      stringEnum: values => ({
        type: `string`,
        enum: values
      }),
      target
    };
  }
  return {
    $schema: {},
    constOrEnum: value => ({
      const: value
    }),
    stringEnum: values => ({
      type: `string`,
      enum: values
    })
  };
};
exports.helpers = helpers;
describe(`buildJsonSchemas`, () => {
  for (const target of [`jsonSchema7`, `openApi3`, undefined]) {
    const {
      $schema,
      constOrEnum,
      stringEnum
    } = helpers(target);
    describe(`target: ${target ?? `none`}`, () => {
      test(`primitives`, () => {
        const models = {
          ZString: _zod.z.string(),
          ZStringMin: _zod.z.string().min(42),
          ZDate: _zod.z.date(),
          ZLiteral: _zod.z.literal(42),
          ZUuid: _zod.z.string().uuid()
        };
        const {
          schemas,
          $ref
        } = (0, _.buildJsonSchemas)(models, {
          target
        });
        expect($ref(`ZString`)).toEqual({
          $ref: `Schema#/properties/ZString`
        });
        expect($ref(`ZStringMin`)).toEqual({
          $ref: `Schema#/properties/ZStringMin`
        });
        expect($ref(`ZDate`)).toEqual({
          $ref: `Schema#/properties/ZDate`
        });
        expect($ref(`ZLiteral`)).toEqual({
          $ref: `Schema#/properties/ZLiteral`
        });
        expect($ref(`ZUuid`)).toEqual({
          $ref: `Schema#/properties/ZUuid`
        });
        expect(schemas).toEqual([{
          $id: `Schema`,
          ...$schema,
          type: `object`,
          properties: {
            ZString: {
              type: `string`
            },
            ZStringMin: {
              type: `string`,
              minLength: 42
            },
            ZDate: {
              type: `string`,
              format: `date-time`
            },
            ZLiteral: {
              type: `number`,
              ...constOrEnum(42)
            },
            ZUuid: {
              type: `string`,
              format: `uuid`
            }
          },
          required: [`ZString`, `ZStringMin`, `ZDate`, `ZLiteral`, `ZUuid`],
          additionalProperties: false
        }]);
      });
      test(`enums`, () => {
        let NativeEnum = /*#__PURE__*/function (NativeEnum) {
          NativeEnum["One"] = "one";
          NativeEnum["Two"] = "two";
          NativeEnum["Three"] = "three";
          return NativeEnum;
        }({});
        const schema = {
          ZEnum: _zod.z.enum([`one`, `two`, `three`]),
          ZNativeEnum: _zod.z.nativeEnum(NativeEnum)
        };
        const {
          schemas,
          $ref
        } = (0, _.buildJsonSchemas)(schema, {
          target
        });
        expect($ref(`ZEnum`)).toEqual({
          $ref: `Schema#/properties/ZEnum`
        });
        expect($ref(`ZNativeEnum`)).toEqual({
          $ref: `Schema#/properties/ZNativeEnum`
        });
        expect(schemas).toEqual([{
          $id: `Schema`,
          ...$schema,
          type: `object`,
          properties: {
            ZEnum: {
              type: `string`,
              enum: [`one`, `two`, `three`]
            },
            ZNativeEnum: {
              type: `string`,
              enum: [`one`, `two`, `three`]
            }
          },
          required: [`ZEnum`, `ZNativeEnum`],
          additionalProperties: false
        }]);
      });
      test(`objects`, () => {
        const models = {
          ZObject: _zod.z.object({
            name: _zod.z.string(),
            age: _zod.z.number(),
            uuid: _zod.z.string().uuid().optional()
          }),
          ZObjectPartial: _zod.z.object({
            name: _zod.z.string(),
            age: _zod.z.number(),
            uuid: _zod.z.string().uuid().optional()
          }).partial()
        };
        const {
          schemas,
          $ref
        } = (0, _.buildJsonSchemas)(models, {
          target
        });
        expect($ref(`ZObject`)).toEqual({
          $ref: `Schema#/properties/ZObject`
        });
        expect($ref(`ZObjectPartial`)).toEqual({
          $ref: `Schema#/properties/ZObjectPartial`
        });
        expect(schemas).toEqual([{
          $id: `Schema`,
          ...$schema,
          type: `object`,
          properties: {
            ZObject: {
              type: `object`,
              properties: {
                name: {
                  type: `string`
                },
                age: {
                  type: `number`
                },
                uuid: {
                  type: `string`,
                  format: `uuid`
                }
              },
              required: [`name`, `age`],
              additionalProperties: false
            },
            ZObjectPartial: {
              type: `object`,
              properties: {
                name: {
                  type: `string`
                },
                age: {
                  type: `number`
                },
                uuid: {
                  type: `string`,
                  format: `uuid`
                }
              },
              additionalProperties: false
            }
          },
          required: [`ZObject`, `ZObjectPartial`],
          additionalProperties: false
        }]);
      });
      test(`arrays`, () => {
        const models = {
          ZArray: _zod.z.array(_zod.z.string()),
          ZArrayMinMax: _zod.z.array(_zod.z.string()).min(5).max(12)
        };
        const {
          schemas,
          $ref
        } = (0, _.buildJsonSchemas)(models, {
          target
        });
        expect($ref(`ZArray`)).toEqual({
          $ref: `Schema#/properties/ZArray`
        });
        expect($ref(`ZArrayMinMax`)).toEqual({
          $ref: `Schema#/properties/ZArrayMinMax`
        });
        expect(schemas).toEqual([{
          $id: `Schema`,
          ...$schema,
          type: `object`,
          properties: {
            ZArray: {
              type: `array`,
              items: {
                type: `string`
              }
            },
            ZArrayMinMax: {
              type: `array`,
              items: {
                type: `string`
              },
              minItems: 5,
              maxItems: 12
            }
          },
          required: [`ZArray`, `ZArrayMinMax`],
          additionalProperties: false
        }]);
      });
      test(`tuples`, () => {
        const models = {
          ZTuple: _zod.z.tuple([_zod.z.string(), _zod.z.number(), _zod.z.literal(42)])
        };
        const {
          schemas,
          $ref
        } = (0, _.buildJsonSchemas)(models, {
          target
        });
        expect($ref(`ZTuple`)).toEqual({
          $ref: `Schema#/properties/ZTuple`
        });
        expect(schemas).toEqual([{
          $id: `Schema`,
          ...$schema,
          type: `object`,
          properties: {
            ZTuple: {
              type: `array`,
              minItems: 3,
              maxItems: 3,
              items: [{
                type: `string`
              }, {
                type: `number`
              }, {
                type: `number`,
                ...constOrEnum(42)
              }]
            }
          },
          required: [`ZTuple`],
          additionalProperties: false
        }]);
      });
      test(`unions`, () => {
        const models = {
          ZUnion: _zod.z.union([_zod.z.string(), _zod.z.number(), _zod.z.literal(42)])
        };
        const {
          schemas,
          $ref
        } = (0, _.buildJsonSchemas)(models, {
          target
        });
        expect($ref(`ZUnion`)).toEqual({
          $ref: `Schema#/properties/ZUnion`
        });
        expect(schemas).toEqual([{
          $id: `Schema`,
          ...$schema,
          type: `object`,
          properties: {
            ZUnion: {
              anyOf: [{
                type: `string`
              }, {
                type: `number`
              }, {
                type: `number`,
                ...constOrEnum(42)
              }]
            }
          },
          required: [`ZUnion`],
          additionalProperties: false
        }]);
      });
      test(`records`, () => {
        const models = {
          ZRecord: _zod.z.record(_zod.z.number())
        };
        const {
          schemas,
          $ref
        } = (0, _.buildJsonSchemas)(models, {
          target
        });
        expect($ref(`ZRecord`)).toEqual({
          $ref: `Schema#/properties/ZRecord`
        });
        expect(schemas).toEqual([{
          $id: `Schema`,
          ...$schema,
          type: `object`,
          properties: {
            ZRecord: {
              type: `object`,
              additionalProperties: {
                type: `number`
              }
            }
          },
          required: [`ZRecord`],
          additionalProperties: false
        }]);
      });
      test(`intersections`, () => {
        const models = {
          ZIntersection: _zod.z.intersection(_zod.z.number().min(2), _zod.z.number().max(12))
        };
        const {
          schemas,
          $ref
        } = (0, _.buildJsonSchemas)(models, {
          target
        });
        expect($ref(`ZIntersection`)).toEqual({
          $ref: `Schema#/properties/ZIntersection`
        });
        expect(schemas).toEqual([{
          $id: `Schema`,
          ...$schema,
          type: `object`,
          properties: {
            ZIntersection: {
              allOf: [{
                type: `number`,
                minimum: 2
              }, {
                type: `number`,
                maximum: 12
              }]
            }
          },
          required: [`ZIntersection`],
          additionalProperties: false
        }]);
      });
      test(`composite`, () => {
        const TodoItem = _zod.z.object({
          itemId: _zod.z.number(),
          label: _zod.z.string(),
          state: _zod.z.union([_zod.z.literal(`todo`), _zod.z.literal(`in progress`), _zod.z.literal(`done`)]),
          dueDate: _zod.z.string().optional()
        });
        const TodoList = _zod.z.array(TodoItem);
        const models = {
          TodoList
        };
        const {
          schemas,
          $ref
        } = (0, _.buildJsonSchemas)(models, {
          target
        });
        expect($ref(`TodoList`)).toEqual({
          $ref: `Schema#/properties/TodoList`
        });
        expect(schemas).toEqual([{
          $id: `Schema`,
          ...$schema,
          type: `object`,
          properties: {
            TodoList: {
              type: `array`,
              items: {
                type: `object`,
                properties: {
                  itemId: {
                    type: `number`
                  },
                  label: {
                    type: `string`
                  },
                  state: stringEnum([`todo`, `in progress`, `done`]),
                  dueDate: {
                    type: `string`
                  }
                },
                required: [`itemId`, `label`, `state`],
                additionalProperties: false
              }
            }
          },
          required: [`TodoList`],
          additionalProperties: false
        }]);
      });
      test(`references`, () => {
        const TodoItemState = _zod.z.enum([`todo`, `in progress`, `done`]);
        const TodoItem = _zod.z.object({
          id: _zod.z.number(),
          label: _zod.z.string(),
          state: TodoItemState
        });
        const TodoList = _zod.z.array(TodoItem);
        const schema = {
          TodoItemState,
          TodoItem,
          TodoList
        };
        const {
          schemas
        } = (0, _.buildJsonSchemas)(schema, {
          target
        });
        expect(schemas).toEqual([{
          $id: `Schema`,
          ...$schema,
          type: `object`,
          properties: {
            TodoItemState: {
              type: `string`,
              enum: [`todo`, `in progress`, `done`]
            },
            TodoItem: {
              type: `object`,
              properties: {
                id: {
                  type: `number`
                },
                label: {
                  type: `string`
                },
                state: {
                  $ref: `Schema#/properties/TodoItemState`
                }
              },
              required: [`id`, `label`, `state`],
              additionalProperties: false
            },
            TodoList: {
              type: `array`,
              items: {
                $ref: `Schema#/properties/TodoItem`
              }
            }
          },
          required: [`TodoItemState`, `TodoItem`, `TodoList`],
          additionalProperties: false
        }]);
      });
    });
  }
});
//# sourceMappingURL=buildJsonSchemas.test.js.map