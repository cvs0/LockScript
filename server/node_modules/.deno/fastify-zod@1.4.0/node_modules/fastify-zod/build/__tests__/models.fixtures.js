"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.models = void 0;
var _zod = require("zod");
const TodoItemId = _zod.z.object({
  id: _zod.z.string().uuid(`invalid todo item id`)
});
var TodoStateEnum = /*#__PURE__*/function (TodoStateEnum) {
  TodoStateEnum["Todo"] = "todo";
  TodoStateEnum["InProgress"] = "in progress";
  TodoStateEnum["Done"] = "done";
  return TodoStateEnum;
}(TodoStateEnum || {});
const TodoState = _zod.z.nativeEnum(TodoStateEnum);
const TodoItem = TodoItemId.extend({
  label: _zod.z.string(),
  dueDateMs: _zod.z.number().int().nonnegative().optional(),
  state: TodoState
});
const TodoItemNotFoundError = TodoItemId.extend({
  message: _zod.z.literal(`item not found`)
});
const TodoItems = _zod.z.object({
  todoItems: _zod.z.array(TodoItem)
});
const TodoItemsGroupedByStatus = _zod.z.object({
  todo: _zod.z.array(TodoItem),
  inProgress: _zod.z.array(TodoItem),
  done: _zod.z.array(TodoItem)
});
const FortyTwo = _zod.z.literal(42);
const models = {
  TodoState,
  TodoItemId,
  TodoItem,
  TodoItemNotFoundError,
  TodoItems,
  TodoItemsGroupedByStatus,
  FortyTwo
};
exports.models = models;
//# sourceMappingURL=models.fixtures.js.map