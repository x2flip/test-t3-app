import { SubmitHandler, useForm } from 'react-hook-form';
import { useQueryClient } from 'react-query';
import { trpc } from '../../utils/trpc';

type Inputs = { todo: string };

export const TodoForm = () => {
    let queryClient = useQueryClient();
    const { register, handleSubmit, reset } = useForm<Inputs>();
    const addTodo = trpc.useMutation(['todos.addTodo'], {
        onSuccess: () => {
            queryClient.invalidateQueries('todos.getAll');
            reset();
        },
    });
    const onSubmit: SubmitHandler<Inputs> = (data) =>
        addTodo.mutate({ todo: data.todo });
    return (
        <form>
            <input
                type="text"
                className="px-4 py-2 border w-96 bg-slate-900 text-slate-100 focus:ouline-none focus:ring-1 focus:ring-cyan-400 border-slate-700"
                {...register('todo')}
            />
            <button
                type="submit"
                className="px-4 py-2 ml-4 text-white transition-all rounded-md shadow-lg bg-cyan-500 hover:bg-cyan-600 shadow-cyan-500/50"
                onClick={handleSubmit(onSubmit)}
            >
                Add
            </button>
        </form>
    );
};
