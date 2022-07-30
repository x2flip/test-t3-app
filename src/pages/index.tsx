import type { NextPage } from 'next';
import Head from 'next/head';
import { useState } from 'react';
import { useQueryClient } from 'react-query';
import { trpc } from '../utils/trpc';
import { TodoItem } from './components/Todo';
import { TodoForm } from './components/TodoForm';

const Home: NextPage = () => {
    let queryClient = useQueryClient();
    const hello = trpc.useQuery(['example.hello', { text: 'from tRPC' }]);
    const todoList = trpc.useQuery(['todos.getAll']);
    // const [todoInput, setTodoInput] = useState('');
    // const addTodo = trpc.useMutation(['todos.addTodo'], {
    //     onSuccess: () => {
    //         setTodoInput('');
    //         queryClient.invalidateQueries('todos.getAll');
    //     },
    // });
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

    // const handleAdd = () => {
    //     addTodo.mutate({ todo: todoInput });
    // };
    const handleCompleteTodo = (todoId: {
        id: number;
        todo: string;
        complete: boolean;
    }) => {
        const { id, todo, complete } = todoId;
        updateTodo.mutate({ id, todo, complete: !complete });
    };
    const handleDeleteTodo = (todoId: {
        id: number;
        todo: string;
        complete: boolean;
    }) => {
        const { id } = todoId;
        deleteTodo.mutate({ id });
    };
    return (
        <>
            <Head>
                <title>Todos</title>
                <meta name="description" content="Generated by create-t3-app" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <div className="min-h-screen bg-slate-800">
                <h1 className="mb-10 text-6xl font-extrabold tracking-wider text-center text-cyan-400">
                    Todos
                </h1>
                <div className="flex justify-center">
                    <TodoForm />
                </div>
                <ul className="flex flex-col px-6 py-6 space-y-8">
                    {todoList.data?.length === 0 && (
                        <div className="pt-10 text-3xl text-center text-white">
                            No todos
                        </div>
                    )}
                    {todoList.data?.map((todo) => (
                        <TodoItem key={todo.id} todo={todo} />
                    ))}
                </ul>
            </div>
        </>
    );
};

export default Home;