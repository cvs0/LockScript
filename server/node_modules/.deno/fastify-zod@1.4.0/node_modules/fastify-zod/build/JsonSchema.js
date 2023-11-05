"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.buildJsonSchemas = exports.buildJsonSchema = void 0;
var _zod = require("zod");
var _zodToJsonSchema = _interopRequireDefault(require("zod-to-json-schema"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/**
 * @deprecated
 */
const buildJsonSchema = (Type, schemaKey) => buildJsonSchemas({
  [schemaKey]: Type
}, {
  $id: schemaKey
}).schemas[0];
exports.buildJsonSchema = buildJsonSchema;
const buildJsonSchemas = (models, opts = {}) => {
  const zodSchema = _zod.z.object(models);
  const $id = opts.$id ?? `Schema`;
  const zodJsonSchema = (0, _zodToJsonSchema.default)(zodSchema, {
    target: opts.target,
    basePath: [`${$id}#`],
    errorMessages: opts.errorMessages
  });
  const jsonSchema = {
    $id,
    ...zodJsonSchema
  };
  const $ref = key => {
    const $ref = `${$id}#/properties/${typeof key === `string` ? key : key.key}`;
    return typeof key === `string` ? {
      $ref
    } : {
      $ref,
      description: key.description
    };
  };
  return {
    schemas: [jsonSchema],
    $ref
  };
};
exports.buildJsonSchemas = buildJsonSchemas;
//# sourceMappingURL=JsonSchema.js.map