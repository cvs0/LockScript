"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createLegacyTestServer = void 0;
var _fastify = _interopRequireDefault(require("fastify"));
var _swagger = _interopRequireDefault(require("@fastify/swagger"));
var _httpErrors = require("http-errors");
var _ = require("..");
var _models = require("./models.fixtures");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const createLegacyTestServer = (fastifyOptions, buildJsonSchemasOptions, swaggerOptions) => {
  const f = (0, _fastify.default)(fastifyOptions);
  f.register(_swagger.default, (0, _.withRefResolver)(swaggerOptions));
  const {
    $ref,
    schemas
  } = (0, _.buildJsonSchemas)(_models.models, buildJsonSchemasOptions);
  for (const schema of schemas) {
    f.addSchema(schema);
  }
  const state = {
    todoItems: []
  };
  f.get(`/item`, {
    schema: {
      operationId: `getTodoItems`,
      response: {
        200: $ref(`TodoItems`)
      }
    }
  }, async () => state);
  f.get(`/item/grouped-by-status`, {
    schema: {
      operationId: `getTodoItemsGroupedByStatus`,
      response: {
        200: $ref(`TodoItemsGroupedByStatus`)
      }
    }
  }, async () => ({
    done: state.todoItems.filter(item => item.state === `done`),
    inProgress: state.todoItems.filter(item => item.state === `in progress`),
    todo: state.todoItems.filter(item => item.state === `todo`)
  }));
  f.post(`/item`, {
    schema: {
      operationId: `postTodoItem`,
      body: $ref(`TodoItem`),
      response: {
        200: $ref(`TodoItems`)
      }
    }
  }, async ({
    body: nextItem
  }) => {
    if (state.todoItems.some(prevItem => prevItem.id === nextItem.id)) {
      throw new _httpErrors.BadRequest(`item already exists`);
    }
    state.todoItems = [...state.todoItems, nextItem];
    return state;
  });
  f.put(`/item/:id`, {
    schema: {
      operationId: `putTodoItem`,
      body: $ref(`TodoItem`),
      params: $ref(`TodoItemId`),
      response: {
        200: $ref(`TodoItem`)
      }
    }
  }, async ({
    params: {
      id
    },
    body: nextItem
  }) => {
    if (!state.todoItems.some(prevItem => prevItem.id === id)) {
      throw new _httpErrors.NotFound(`no such item`);
    }
    state.todoItems = state.todoItems.map(prevItem => prevItem.id === id ? nextItem : prevItem);
    return nextItem;
  });
  return f;
};
exports.createLegacyTestServer = createLegacyTestServer;
//# sourceMappingURL=server.legacy.fixtures.js.map