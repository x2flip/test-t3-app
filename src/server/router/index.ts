// src/server/router/index.ts
import { createRouter } from './context';
import superjson from 'superjson';

import { exampleRouter } from './example';
import { todosRouter } from './todos';

export const appRouter = createRouter()
    .transformer(superjson)
    .merge('example.', exampleRouter)
    .merge('todos.', todosRouter);

// export type definition of API
export type AppRouter = typeof appRouter;
