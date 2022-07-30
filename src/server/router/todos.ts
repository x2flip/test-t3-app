import { createRouter } from './context';
import { number, z } from 'zod';

export const todosRouter = createRouter()
    .query('getAll', {
        async resolve({ ctx }) {
            return await ctx.prisma.todo.findMany();
        },
    })
    .mutation('addTodo', {
        input: z.object({ todo: z.string() }),
        async resolve({ input, ctx }) {
            return await ctx.prisma.todo.create({ data: input });
        },
    })
    .mutation('updateTodo', {
        input: z.object({
            id: z.number(),
            complete: z.boolean().optional(),
            todo: z.string().optional(),
            dueDate: z.date().optional(),
        }),
        async resolve({ input, ctx }) {
            return await ctx.prisma.todo.update({
                where: { id: input.id },
                data: { ...input },
            });
        },
    })
    .mutation('deleteTodo', {
        input: z.object({ id: number() }),
        async resolve({ input, ctx }) {
            return await ctx.prisma.todo.delete({ where: { id: input.id } });
        },
    });
