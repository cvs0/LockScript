"use strict";

var _typedJestExpect = require("typed-jest-expect");
var _testOpenapiClient = require("../../test-openapi-client");
var _ = require("..");
var _models = require("./models.fixtures");
var _server = require("./server.fixtures");
test(`openapi-client`, async () => {
  const f = await (0, _server.createTestServer)({}, {
    jsonSchemas: (0, _.buildJsonSchemas)(_models.models, {}),
    transformSpec: {},
    swaggerOptions: {
      ..._server.openApiOptions
    },
    swaggerUiOptions: _server.swaggerUiOptions
  });
  const basePath = await f.listen({
    port: 0
  });
  try {
    const client = new _testOpenapiClient.DefaultApi(new _testOpenapiClient.Configuration({
      basePath,
      fetchApi: global.fetch
    }));
    await (0, _typedJestExpect.tExpect)(client.getTodoItems()).resolves.toEqual({
      todoItems: []
    });
    await (0, _typedJestExpect.tExpect)(client.postTodoItem({
      schemaTodoItem: {
        id: `e7f7082a-4f16-430d-8c3b-db6b8d4d3e73`,
        label: `todo`,
        state: _testOpenapiClient.SchemaTodoState.Todo,
        dueDateMs: new Date(1337).getTime()
      }
    })).resolves.toEqual({
      todoItems: [{
        id: `e7f7082a-4f16-430d-8c3b-db6b8d4d3e73`,
        label: `todo`,
        state: _testOpenapiClient.SchemaTodoState.Todo,
        dueDateMs: new Date(1337).getTime()
      }]
    });
  } finally {
    await f.close();
  }
});
//# sourceMappingURL=openapi-client.test.js.map