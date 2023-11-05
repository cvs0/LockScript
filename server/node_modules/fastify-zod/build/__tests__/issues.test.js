"use strict";

var _fastify = _interopRequireDefault(require("fastify"));
var _zod = require("zod");
var _ = require("..");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
test(`fix #8`, () => {
  const productInput = {
    title: _zod.z.string(),
    price: _zod.z.number(),
    content: _zod.z.string().optional()
  };
  const productGenerated = {
    id: _zod.z.number(),
    createdAt: _zod.z.string(),
    updatedAt: _zod.z.string()
  };
  const createProductSchema = _zod.z.object({
    ...productInput
  });
  const productResponseSchema = _zod.z.object({
    ...productInput,
    ...productGenerated
  });
  const productsResponseSchema = _zod.z.array(productResponseSchema);
  (0, _.buildJsonSchemas)({
    createProductSchema,
    productResponseSchema,
    productsResponseSchema
  });
  const userCoreSchema = {
    email: _zod.z.string({
      required_error: `Email is required`,
      invalid_type_error: `Email must be a string`
    }).email(),
    name: _zod.z.string()
  };
  const createUserSchema = _zod.z.object({
    ...userCoreSchema,
    password: _zod.z.string({
      required_error: `Password is required`,
      invalid_type_error: `Password must be a string`
    })
  });
  const createUserResponseSchema = _zod.z.object({
    ...userCoreSchema,
    id: _zod.z.number()
  });
  const loginSchema = _zod.z.object({
    email: _zod.z.string({
      required_error: `Email is required`,
      invalid_type_error: `Email must be a string`
    }).email(),
    password: _zod.z.string()
  });
  const loginResponseSchema = _zod.z.object({
    accessToken: _zod.z.string()
  });
  (0, _.buildJsonSchemas)({
    createUserSchema,
    createUserResponseSchema,
    loginSchema,
    loginResponseSchema
  });
});
test(`fix #14, #17`, async () => {
  const Name = _zod.z.object({
    kind: _zod.z.literal(`name`),
    name: _zod.z.string(),
    lastName: _zod.z.string()
  });
  const Address = _zod.z.object({
    kind: _zod.z.literal(`address`),
    street: _zod.z.string(),
    postcode: _zod.z.string()
  });
  const UserDetails = _zod.z.union([Name, Address]);
  const Unknown = _zod.z.unknown();
  const jsonSchemas = (0, _.buildJsonSchemas)({
    UserDetails,
    Unknown
  }, {});
  const f = await (0, _.register)((0, _fastify.default)(), {
    jsonSchemas
  });
  f.zod.get(`/`, {
    operationId: `getUserDetails`,
    querystring: `UserDetails`,
    reply: `UserDetails`
  }, async ({
    query
  }) => query);
  const name = await f.inject({
    method: `get`,
    url: `/`,
    query: {
      kind: `name`
    }
  }).then(res => res.json());
  expect(name).toEqual({
    code: `FST_ERR_VALIDATION`,
    error: `Bad Request`,
    message: `querystring must have required property 'name', querystring must have required property 'street', querystring must match a schema in anyOf`,
    statusCode: 400
  });
  const address = await f.inject({
    method: `get`,
    url: `/`,
    query: {
      kind: `address`
    }
  }).then(res => res.json());
  expect(address).toEqual({
    code: `FST_ERR_VALIDATION`,
    error: `Bad Request`,
    message: `querystring must have required property 'name', querystring must have required property 'street', querystring must match a schema in anyOf`,
    statusCode: 400
  });
});
//# sourceMappingURL=issues.test.js.map