import React, { useState, useEffect } from 'react';
import { Todo } from './types/Todo';
import { getTodos } from './api';
import { TodoList } from './components/TodoList';
import { TodoFilter } from './components/TodoFilter';
import { TodoModal } from './components/TodoModal';
import { Loader } from './components/Loader';

type Status = 'all' | 'active' | 'completed';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);
  const [query, setQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<Status>('all');

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .finally(() => setLoading(false));
  }, []);

  const visibleTodos = todos.filter(todo => {
    const matchesQuery = todo.title.toLowerCase().includes(query.toLowerCase());
    const matchesStatus =
      filterStatus === 'all' ||
      (filterStatus === 'completed' && todo.completed) ||
      (filterStatus === 'active' && !todo.completed);

    return matchesQuery && matchesStatus;
  });

  return (
    <div className="section">
      <div className="container">
        <h1 className="title">Todo List</h1>

        <div className="box">
          <TodoFilter
            query={query}
            setQuery={setQuery}
            filterStatus={filterStatus}
            setFilterStatus={setFilterStatus}
          />

          {loading ? (
            <Loader />
          ) : (
            <TodoList
              todos={visibleTodos}
              onSelectTodo={setSelectedTodo}
              selectedTodoId={selectedTodo?.id || null}
            />
          )}
        </div>

        {selectedTodo && (
          <TodoModal
            todo={selectedTodo}
            onClose={() => setSelectedTodo(null)}
          />
        )}
      </div>
    </div>
  );
};
