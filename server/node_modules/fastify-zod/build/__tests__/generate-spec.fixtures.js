"use strict";

var _promises = require("fs/promises");
var _path = require("path");
var _ = require("..");
var _models = require("./models.fixtures");
var _server = require("./server.fixtures");
const main = async () => {
  const f = await (0, _server.createTestServer)({}, {
    jsonSchemas: (0, _.buildJsonSchemas)(_models.models, {}),
    transformSpec: {
      options: {}
    },
    swaggerOptions: {
      ..._server.openApiOptions
    },
    swaggerUiOptions: _server.swaggerUiOptions
  });
  const originalSpec = await f.inject({
    method: `get`,
    url: `/documentation/json`
  }).then(res => res.json());
  await (0, _promises.writeFile)((0, _path.join)(__dirname, `..`, `..`, `openapi.original.json`), JSON.stringify(originalSpec, null, 2), {
    encoding: `utf-8`
  });
  const transformedSpecJson = await f.inject({
    method: `get`,
    url: `/documentation_transformed/json`
  }).then(res => res.body);
  await (0, _promises.writeFile)((0, _path.join)(__dirname, `..`, `..`, `openapi.transformed.json`), transformedSpecJson, {
    encoding: `utf-8`
  });
  const transformedSpecYaml = await f.inject({
    method: `get`,
    url: `/documentation_transformed/yaml`
  }).then(res => res.body);
  await (0, _promises.writeFile)((0, _path.join)(__dirname, `..`, `..`, `openapi.transformed.yml`), transformedSpecYaml, {
    encoding: `utf-8`
  });
};
main().catch(error => {
  console.error(error);
  process.exit(1);
});
//# sourceMappingURL=generate-spec.fixtures.js.map