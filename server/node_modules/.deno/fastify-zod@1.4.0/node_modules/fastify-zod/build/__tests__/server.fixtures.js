"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.swaggerUiOptions = exports.swaggerOptions = exports.openApiOptions = exports.createTestServer = void 0;
var _fastify = _interopRequireDefault(require("fastify"));
var _httpErrors = require("http-errors");
var _ = require("..");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const swaggerOptions = {
  swagger: {
    info: {
      title: `Fastify Zod Test Server`,
      description: `Test Server for Fastify Zod`,
      version: `0.0.0`
    }
  }
};
exports.swaggerOptions = swaggerOptions;
const openApiOptions = {
  openapi: {
    info: {
      title: `Fastify Zod Test Server`,
      description: `Test Server for Fastify Zod`,
      version: `0.0.0`
    }
  }
};
exports.openApiOptions = openApiOptions;
const swaggerUiOptions = {
  staticCSP: true
};
exports.swaggerUiOptions = swaggerUiOptions;
const createTestServer = async (fastifyOptions, registerOptions) => {
  const f = await (0, _.register)((0, _fastify.default)(fastifyOptions), registerOptions);
  const state = {
    todoItems: []
  };
  f.zod.get(`/item`, {
    operationId: `getTodoItems`,
    reply: {
      description: `The list of Todo Items`,
      key: `TodoItems`
    }
  }, async () => state);
  f.zod.get(`/item/grouped-by-status`, {
    operationId: `getTodoItemsGroupedByStatus`,
    reply: `TodoItemsGroupedByStatus`
  }, async () => ({
    done: state.todoItems.filter(item => item.state === `done`),
    inProgress: state.todoItems.filter(item => item.state === `in progress`),
    todo: state.todoItems.filter(item => item.state === `todo`)
  }));
  f.zod.post(`/item`, {
    operationId: `postTodoItem`,
    body: `TodoItem`,
    reply: `TodoItems`
  }, async ({
    body: nextItem
  }) => {
    if (state.todoItems.some(prevItem => prevItem.id === nextItem.id)) {
      throw new _httpErrors.BadRequest(`item already exists`);
    }
    state.todoItems = [...state.todoItems, nextItem];
    return state;
  });
  f.zod.get(`/item/:id`, {
    operationId: `getTodoItem`,
    params: `TodoItemId`,
    response: {
      200: `TodoItem`,
      404: `TodoItemNotFoundError`
    }
  }, async ({
    params: {
      id
    }
  }, reply) => {
    const item = state.todoItems.find(item => item.id === id);
    if (item) {
      return item;
    }
    reply.code(404);
    return {
      id,
      message: `item not found`
    };
  });
  f.zod.put(`/item/:id`, {
    operationId: `putTodoItem`,
    body: `TodoItem`,
    params: `TodoItemId`,
    reply: `TodoItem`
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
  f.zod.get(`/42`, {
    operationId: `getFortyTwo`,
    reply: `FortyTwo`
  }, async () => 42);
  return f;
};
exports.createTestServer = createTestServer;
//# sourceMappingURL=server.fixtures.js.map