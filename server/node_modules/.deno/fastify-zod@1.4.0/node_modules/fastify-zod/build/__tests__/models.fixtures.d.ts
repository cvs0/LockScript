import { z } from "zod";
declare const TodoItemId: z.ZodObject<{
    id: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
}, {
    id: string;
}>;
export type TodoItemId = z.infer<typeof TodoItemId>;
declare enum TodoStateEnum {
    Todo = "todo",
    InProgress = "in progress",
    Done = "done"
}
declare const TodoItem: z.ZodObject<{
    id: z.ZodString;
    label: z.ZodString;
    dueDateMs: z.ZodOptional<z.ZodNumber>;
    state: z.ZodNativeEnum<typeof TodoStateEnum>;
}, "strip", z.ZodTypeAny, {
    id: string;
    state: TodoStateEnum;
    label: string;
    dueDateMs?: number | undefined;
}, {
    id: string;
    state: TodoStateEnum;
    label: string;
    dueDateMs?: number | undefined;
}>;
export type TodoItem = z.infer<typeof TodoItem>;
declare const TodoItems: z.ZodObject<{
    todoItems: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        label: z.ZodString;
        dueDateMs: z.ZodOptional<z.ZodNumber>;
        state: z.ZodNativeEnum<typeof TodoStateEnum>;
    }, "strip", z.ZodTypeAny, {
        id: string;
        state: TodoStateEnum;
        label: string;
        dueDateMs?: number | undefined;
    }, {
        id: string;
        state: TodoStateEnum;
        label: string;
        dueDateMs?: number | undefined;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    todoItems: {
        id: string;
        state: TodoStateEnum;
        label: string;
        dueDateMs?: number | undefined;
    }[];
}, {
    todoItems: {
        id: string;
        state: TodoStateEnum;
        label: string;
        dueDateMs?: number | undefined;
    }[];
}>;
export type TodoItems = z.infer<typeof TodoItems>;
declare const TodoItemsGroupedByStatus: z.ZodObject<{
    todo: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        label: z.ZodString;
        dueDateMs: z.ZodOptional<z.ZodNumber>;
        state: z.ZodNativeEnum<typeof TodoStateEnum>;
    }, "strip", z.ZodTypeAny, {
        id: string;
        state: TodoStateEnum;
        label: string;
        dueDateMs?: number | undefined;
    }, {
        id: string;
        state: TodoStateEnum;
        label: string;
        dueDateMs?: number | undefined;
    }>, "many">;
    inProgress: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        label: z.ZodString;
        dueDateMs: z.ZodOptional<z.ZodNumber>;
        state: z.ZodNativeEnum<typeof TodoStateEnum>;
    }, "strip", z.ZodTypeAny, {
        id: string;
        state: TodoStateEnum;
        label: string;
        dueDateMs?: number | undefined;
    }, {
        id: string;
        state: TodoStateEnum;
        label: string;
        dueDateMs?: number | undefined;
    }>, "many">;
    done: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        label: z.ZodString;
        dueDateMs: z.ZodOptional<z.ZodNumber>;
        state: z.ZodNativeEnum<typeof TodoStateEnum>;
    }, "strip", z.ZodTypeAny, {
        id: string;
        state: TodoStateEnum;
        label: string;
        dueDateMs?: number | undefined;
    }, {
        id: string;
        state: TodoStateEnum;
        label: string;
        dueDateMs?: number | undefined;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    done: {
        id: string;
        state: TodoStateEnum;
        label: string;
        dueDateMs?: number | undefined;
    }[];
    todo: {
        id: string;
        state: TodoStateEnum;
        label: string;
        dueDateMs?: number | undefined;
    }[];
    inProgress: {
        id: string;
        state: TodoStateEnum;
        label: string;
        dueDateMs?: number | undefined;
    }[];
}, {
    done: {
        id: string;
        state: TodoStateEnum;
        label: string;
        dueDateMs?: number | undefined;
    }[];
    todo: {
        id: string;
        state: TodoStateEnum;
        label: string;
        dueDateMs?: number | undefined;
    }[];
    inProgress: {
        id: string;
        state: TodoStateEnum;
        label: string;
        dueDateMs?: number | undefined;
    }[];
}>;
export type TodoItemsGroupedByStatus = z.infer<typeof TodoItemsGroupedByStatus>;
declare const FortyTwo: z.ZodLiteral<42>;
export type FortyTwo = z.infer<typeof FortyTwo>;
export declare const models: {
    TodoState: z.ZodNativeEnum<typeof TodoStateEnum>;
    TodoItemId: z.ZodObject<{
        id: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        id: string;
    }, {
        id: string;
    }>;
    TodoItem: z.ZodObject<{
        id: z.ZodString;
        label: z.ZodString;
        dueDateMs: z.ZodOptional<z.ZodNumber>;
        state: z.ZodNativeEnum<typeof TodoStateEnum>;
    }, "strip", z.ZodTypeAny, {
        id: string;
        state: TodoStateEnum;
        label: string;
        dueDateMs?: number | undefined;
    }, {
        id: string;
        state: TodoStateEnum;
        label: string;
        dueDateMs?: number | undefined;
    }>;
    TodoItemNotFoundError: z.ZodObject<{
        id: z.ZodString;
        message: z.ZodLiteral<"item not found">;
    }, "strip", z.ZodTypeAny, {
        message: "item not found";
        id: string;
    }, {
        message: "item not found";
        id: string;
    }>;
    TodoItems: z.ZodObject<{
        todoItems: z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            label: z.ZodString;
            dueDateMs: z.ZodOptional<z.ZodNumber>;
            state: z.ZodNativeEnum<typeof TodoStateEnum>;
        }, "strip", z.ZodTypeAny, {
            id: string;
            state: TodoStateEnum;
            label: string;
            dueDateMs?: number | undefined;
        }, {
            id: string;
            state: TodoStateEnum;
            label: string;
            dueDateMs?: number | undefined;
        }>, "many">;
    }, "strip", z.ZodTypeAny, {
        todoItems: {
            id: string;
            state: TodoStateEnum;
            label: string;
            dueDateMs?: number | undefined;
        }[];
    }, {
        todoItems: {
            id: string;
            state: TodoStateEnum;
            label: string;
            dueDateMs?: number | undefined;
        }[];
    }>;
    TodoItemsGroupedByStatus: z.ZodObject<{
        todo: z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            label: z.ZodString;
            dueDateMs: z.ZodOptional<z.ZodNumber>;
            state: z.ZodNativeEnum<typeof TodoStateEnum>;
        }, "strip", z.ZodTypeAny, {
            id: string;
            state: TodoStateEnum;
            label: string;
            dueDateMs?: number | undefined;
        }, {
            id: string;
            state: TodoStateEnum;
            label: string;
            dueDateMs?: number | undefined;
        }>, "many">;
        inProgress: z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            label: z.ZodString;
            dueDateMs: z.ZodOptional<z.ZodNumber>;
            state: z.ZodNativeEnum<typeof TodoStateEnum>;
        }, "strip", z.ZodTypeAny, {
            id: string;
            state: TodoStateEnum;
            label: string;
            dueDateMs?: number | undefined;
        }, {
            id: string;
            state: TodoStateEnum;
            label: string;
            dueDateMs?: number | undefined;
        }>, "many">;
        done: z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            label: z.ZodString;
            dueDateMs: z.ZodOptional<z.ZodNumber>;
            state: z.ZodNativeEnum<typeof TodoStateEnum>;
        }, "strip", z.ZodTypeAny, {
            id: string;
            state: TodoStateEnum;
            label: string;
            dueDateMs?: number | undefined;
        }, {
            id: string;
            state: TodoStateEnum;
            label: string;
            dueDateMs?: number | undefined;
        }>, "many">;
    }, "strip", z.ZodTypeAny, {
        done: {
            id: string;
            state: TodoStateEnum;
            label: string;
            dueDateMs?: number | undefined;
        }[];
        todo: {
            id: string;
            state: TodoStateEnum;
            label: string;
            dueDateMs?: number | undefined;
        }[];
        inProgress: {
            id: string;
            state: TodoStateEnum;
            label: string;
            dueDateMs?: number | undefined;
        }[];
    }, {
        done: {
            id: string;
            state: TodoStateEnum;
            label: string;
            dueDateMs?: number | undefined;
        }[];
        todo: {
            id: string;
            state: TodoStateEnum;
            label: string;
            dueDateMs?: number | undefined;
        }[];
        inProgress: {
            id: string;
            state: TodoStateEnum;
            label: string;
            dueDateMs?: number | undefined;
        }[];
    }>;
    FortyTwo: z.ZodLiteral<42>;
};
export {};
