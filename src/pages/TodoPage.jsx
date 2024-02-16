import React, { useState } from 'react';
import { Footer, Header, TodoCollection, TodoInput } from 'components';
export const dummyTodos = [
  {
    title: 'Learn react-router',
    isDone: true,
    id: 1,
  },
  {
    title: 'Learn to create custom hooks',
    isDone: false,
    id: 2,
  },
  {
    title: 'Learn to use context',
    isDone: true,
    id: 3,
  },
  {
    title: 'Learn to implement auth',
    isDone: false,
    id: 4,
  },
];

const TodoPage = () => {
  const [inputValue, setInputValue] = useState('');
  const [todos, setTodos] = useState(dummyTodos);
  const [remainingItems, setRemainingItems] = useState(todos.length);

  //   更新剩餘項目數的函數
  const updateRemainingItems = (newTodos) => {
    setRemainingItems(newTodos.length);
  };

  //onChange 依input取得value
  const handleChange = (value) => {
    setInputValue(value);
  };

  //onClick button新增item
  const handleAddTodo = () => {
    if (inputValue.length === 0) {
      return;
    }

    setTodos((prevTodos) => {
      const updatedTodos = [
        ...prevTodos,
        {
          id: Math.random() * 100,
          title: inputValue,
          isDone: false,
        },
      ];
      //  更新剩餘項目數
      updateRemainingItems(updatedTodos);
      return updatedTodos;
    });
    setInputValue('');
  };
  //onKeyDown Enter新增item
  const handleKeyDone = () => {
    if (inputValue.length === 0) {
      return;
    }

    setTodos((prevTodos) => {
      const updatedTodos = [
        ...prevTodos,
        {
          id: Math.random() * 100,
          title: inputValue,
          isDone: false,
        },
      ];
      //  更新剩餘項目數
      updateRemainingItems(updatedTodos);
      return updatedTodos;
    });
    setInputValue('');
  };
  //onDoubleClick toggle isEdit
  const handleChangeMode = ({ id, isEdit }) => {
    setTodos((prevTodos) => {
      return prevTodos.map((todo) => {
        if (todo.id === id) {
          return {
            ...todo,
            isEdit,
          };
        }
        return { ...todo, isEdit: false };
      });
    });
  };
  //onClick toggle isDone
  const handleToggleDone = (id) => {
    setTodos((prevTodos) => {
      return prevTodos.map((todo) => {
        if (todo.id === id) {
          return {
            ...todo,
            isDone: !todo.isDone,
          };
        }
        return todo;
      });
    });
  };
  //
  const handleSave = ({ id, title }) => {
    setTodos((prevTodos) => {
      return prevTodos.map((todo) => {
        if (todo.id === id) {
          return {
            ...todo,
            title,
            isEdit: false,
          };
        }
        return todo;
      });
    });
  };
  //onClick Delete item
  const handleDelete = (id) => {
    setTodos((prevTodos) => {
      const updatedTodos = prevTodos.filter((todo) => todo.id !== id);
      updateRemainingItems(updatedTodos);
      return updatedTodos;
    });
  };

  return (
    <div>
      TodoPage
      <Header />
      <TodoInput
        inputValue={inputValue}
        onChange={handleChange}
        onAddTodo={handleAddTodo}
        onKeyDone={handleKeyDone}
      />
      <TodoCollection
        todos={todos}
        onToggleDone={handleToggleDone}
        onChangeMode={handleChangeMode}
        onSave={handleSave}
        onDelete={handleDelete}
      />
      <Footer remainingItems={remainingItems} />
    </div>
  );
};

export default TodoPage;
