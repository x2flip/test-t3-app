import { Todo } from '@prisma/client';
import { useQueryClient } from 'react-query';
import { trpc } from '../../utils/trpc';
import { format } from 'date-fns';
import DateTimePicker from 'react-datetime-picker/dist/entry.nostyle';

interface IProps {
    todo: Todo;
}
export const TodoItem = ({ todo }: IProps) => {
    let queryClient = useQueryClient();

    const updateTodo = trpc.useMutation(['todos.updateTodo'], {
        onSuccess: () => {
            queryClient.invalidateQueries('todos.getAll');
        },
    });
    const deleteTodo = trpc.useMutation(['todos.deleteTodo'], {
        onSuccess: () => {
            queryClient.invalidateQueries('todos.getAll');
        },
    });
    const handleCompleteTodo = (todoId: Todo) => {
        const { id, complete } = todoId;
        updateTodo.mutate({ id, complete: !complete });
    };
    const handleChangeTodoDueDate = (todo: Todo, newDate: Date) => {
        const dueDate = newDate ?? todo.dueDate ?? new Date();
        updateTodo.mutate({ ...todo, dueDate });
    };
    const handleDeleteTodo = (todoId: Todo) => {
        const { id } = todoId;
        deleteTodo.mutate({ id });
    };
    const handleChange = (e: any) => {
        console.log(e);
    };
    return (
        <li className="flex px-6 py-6 rounded-md shadow-md bg-slate-700 text-slate-100">
            <span
                className={
                    todo.complete
                        ? 'line-through flex-grow self-center text-lg'
                        : 'flex-grow text-lg self-center'
                }
            >
                {todo.todo}
            </span>
            <div className="flex flex-col justify-center mr-10">
                <DateTimePicker
                    value={todo.dueDate ?? new Date()}
                    onChange={(newDate: Date) =>
                        handleChangeTodoDueDate(todo, newDate)
                    }
                    className={'bg-slate-700'}
                />
            </div>
            <button
                className={
                    todo.complete
                        ? 'bg-red-600 rounded-md shadow-lg shadow-red-600/50 hover:bg-red-700 px-4 py-2 text-slate-100 transition-all'
                        : 'bg-green-600 rounded-md shadow-lg shadow-green-600/50 hover:bg-green-700  px-4 py-2 text-slate-100 transition-all'
                }
                onClick={() => handleCompleteTodo(todo)}
            >
                {todo.complete ? 'Uncomplete' : 'Complete'}
            </button>
            {todo.complete && (
                <button
                    className="px-4 py-2 ml-2 transition-all bg-red-700 rounded-md shadow-lg text-slate-100 shadow-red-700/50 hover:bg-red-800"
                    onClick={() => handleDeleteTodo(todo)}
                >
                    Delete
                </button>
            )}
        </li>
    );
};
