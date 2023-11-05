"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.withRefResolver = exports.register = void 0;
var _swagger = _interopRequireDefault(require("@fastify/swagger"));
var _swaggerUi = _interopRequireDefault(require("@fastify/swagger-ui"));
var yaml = _interopRequireWildcard(require("js-yaml"));
var _SpecTransformer = require("./SpecTransformer");
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const withRefResolver = options => ({
  ...options,
  refResolver: {
    ...options.refResolver,
    clone: true,
    buildLocalReference: (json, _baseUri, _fragment, i) => typeof json.$id === `string` ? json.$id : `def-${i}`
  }
});
exports.withRefResolver = withRefResolver;
const register = async (f, {
  jsonSchemas: {
    schemas,
    $ref
  },
  swaggerOptions,
  swaggerUiOptions,
  transformSpec
}) => {
  for (const schema of schemas) {
    f.addSchema(schema);
  }
  await f.register(_swagger.default, withRefResolver(swaggerOptions ?? {}));
  if (swaggerUiOptions !== false) {
    await f.register(_swaggerUi.default, swaggerUiOptions ?? {});
    if (transformSpec) {
      const originalRoutePrefix = swaggerUiOptions?.routePrefix ?? `/documentation`;
      const transformedRoutePrefix = transformSpec.routePrefix ?? `${originalRoutePrefix}_transformed`;
      const fetchTransformedSpec = async () => {
        const originalSpec = await f.inject({
          method: `get`,
          url: `${swaggerUiOptions?.routePrefix ?? `documentation`}/json`
        }).then(res => res.json());
        const t = new _SpecTransformer.SpecTransformer(originalSpec);
        return t.transform(transformSpec.options);
      };
      let cachedTransformedSpec = null;
      const getTransformedSpec = async () => {
        if (!transformSpec.cache) {
          return await fetchTransformedSpec();
        }
        if (!cachedTransformedSpec) {
          cachedTransformedSpec = fetchTransformedSpec();
        }
        return await cachedTransformedSpec;
      };
      let cachedTransformedSpecJson = null;
      const getTransformedSpecJson = async () => {
        const transformedSpec = await getTransformedSpec();
        if (!transformSpec.cache) {
          return JSON.stringify(transformedSpec, null, 2);
        }
        if (!cachedTransformedSpecJson) {
          cachedTransformedSpecJson = JSON.stringify(transformedSpec, null, 2);
        }
        return cachedTransformedSpecJson;
      };
      let cachedTransformedSpecYaml = null;
      const getTransformedSpecYaml = async () => {
        const transformedSpec = await getTransformedSpec();
        if (!transformSpec.cache) {
          return yaml.dump(transformedSpec);
        }
        if (!cachedTransformedSpecYaml) {
          cachedTransformedSpecYaml = yaml.dump(transformedSpec);
        }
        return cachedTransformedSpecYaml;
      };
      f.get(`${transformedRoutePrefix}/json`, async (_request, reply) => {
        reply.type(`application/json`);
        return await getTransformedSpecJson();
      });
      f.get(`${transformedRoutePrefix}/yaml`, async (_request, reply) => {
        reply.type(`text/x-yaml`);
        return await getTransformedSpecYaml();
      });
    }
  }
  const addRoute = ({
    method,
    url,
    operationId,
    params,
    body,
    reply,
    response,
    querystring,
    handler,
    ...fastifySchema
  }) => {
    const customSchema = {};
    if (operationId) {
      customSchema.operationId = operationId;
    }
    if (params) {
      customSchema.params = $ref(params);
    }
    if (body) {
      customSchema.body = $ref(body);
    }
    if (querystring) {
      customSchema.querystring = $ref(querystring);
    }
    if (reply || response) {
      const customSchemaResponse = {};
      if (reply) {
        customSchemaResponse[200] = $ref(reply);
      }
      if (response) {
        for (const code of Object.keys(response)) {
          customSchemaResponse[parseInt(code)] = $ref(response[parseInt(code)]);
        }
      }
      customSchema.response = customSchemaResponse;
    }
    f[method](url, {
      schema: {
        ...customSchema,
        ...fastifySchema
      }
    }, handler);
  };
  const createAddRoute = method => (url, config, handler) => addRoute({
    url,
    handler,
    method,
    ...config
  });
  const pluginInstance = {
    delete: createAddRoute(`delete`),
    get: createAddRoute(`get`),
    head: createAddRoute(`head`),
    options: createAddRoute(`options`),
    patch: createAddRoute(`patch`),
    post: createAddRoute(`post`),
    put: createAddRoute(`put`)
  };
  f.decorate(`zod`, pluginInstance);
  return f;
};
exports.register = register;
//# sourceMappingURL=FastifyZod.js.map