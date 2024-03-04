import { useState, useEffect } from 'react';
import { Footer, Header, TodoCollection, TodoInput } from 'components';
import { getTodos, createTodo, patchTodo, deleteTodo } from '../api/todos';
import { useNavigate } from 'react-router-dom';
import { useAuth } from 'contexts/AuthContext'; // 引用封裝好的資訊

const TodoPage = () => {
  const [inputValue, setInputValue] = useState('');
  const [todos, setTodos] = useState([]);
  const [remainingItems, setRemainingItems] = useState(todos.length);
  const navigate = useNavigate();
  const { isAuthenticated, currentMember } = useAuth(); // 取出需要的狀態與方法

  //代入新的Todos --> 並將newTodos.length 設為剩餘項目數
  const updateRemainingItems = (newTodos) => {
    setRemainingItems(newTodos.length);
  };

  //處理onChange --> 接收回傳Value 並 更新inputValue
  const handleChange = (value) => {
    setInputValue(value);
  };

  //處理onAddTodo -->
  //將inputValue 新增為Todo 並回傳newTodos && 更新剩餘項目
  //更改為async
  const handleAddTodo = async () => {
    if (inputValue.length === 0) {
      return;
    }

    try {
      //發送create請求並修改後端data的title & isDone
      const data = await createTodo({ title: inputValue, isDone: false });
      //將後端修改後的data置換到前端畫面內
      setTodos((prevTodos) => {
        const updatedTodos = [
          ...prevTodos,
          {
            id: data.id,
            title: data.title,
            isDone: data.isDone,
            isEdit: false,
          },
        ];
        //  更新剩餘項目數
        updateRemainingItems(updatedTodos);
        return updatedTodos;
      });
      setInputValue('');
    } catch (error) {
      console.error(error);
    }
  };
  //處理onKeyDown -->
  //將inputValue 新增為Todo 並回傳newTodos && 更新剩餘項目
  const handleKeyDone = async () => {
    if (inputValue.length === 0) {
      return;
    }
    try {
      //獲取後端data,並修改data的title & isDone
      const data = await createTodo({
        title: inputValue,
        isDone: false,
      });
      setTodos((prevTodos) => {
        const updatedTodos = [
          ...prevTodos,
          {
            //將修改後data內容,置換入各properties
            id: data.id,
            title: data.title,
            isDone: data.isDone,
            isEdit: false,
          },
        ];
        //  更新剩餘項目數
        updateRemainingItems(updatedTodos);
        return updatedTodos;
      });
      setInputValue('');
    } catch (error) {
      console.error(error);
    }
  };
  //toggle isDone
  const handleToggleDone = async (id) => {
    //需要先確認當前id 的 isDone狀態
    const currentTodo = todos.find((todo) => todo.id === id);
    try {
      //發送請求並 更改後端data的isDone 為相反值
      await patchTodo({ id, isDone: !currentTodo.isDone });
      //前端處理isDone
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
    } catch (err) {
      console.error(err);
    }
  };
  //toggle isEditMode (只是進入模式,但無法更改)
  //回傳目標isEdit:true,其他 false
  const handleChangeMode = ({ id, isEdit }) => {
    setTodos((prevTodos) => {
      return prevTodos.map((todo) => {
        if (todo.id === id) {
          return {
            ...todo,
            isEdit,
          };
        }
        // return todo;
        return { ...todo, isEdit: false };
      });
    });
  };

  //處理onSave --> 修改title & isEdit
  const handleSave = async ({ id, title }) => {
    //不需要find --> 只要獲得當前title,更新就好
    try {
      //獲取patchTodo data
      await patchTodo({ id, title });
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
    } catch (err) {
      console.err(err);
    }
  };
  //處理onDelete -->
  //篩選出todo.id以外的id 並回傳newTodos && 更新剩餘項目
  const handleDelete = async (id) => {
    try {
      await deleteTodo(id);
      setTodos((prevTodos) => {
        const updatedTodos = prevTodos.filter((todo) => todo.id !== id);
        updateRemainingItems(updatedTodos);
        return updatedTodos;
      });
    } catch (err) {
      console.error(err);
    }
  };

  //初始渲染畫面 非同步-->try, catch
  useEffect(() => {
    const getTodosAsync = async () => {
      try {
        //獲取getTodos data
        const todos = await getTodos();
        //setTodos data內的每筆todo
        setTodos(
          todos.map((todo) => {
            return {
              ...todo,
              isEdit: false,
            };
          }),
        );
        //初始獲取todos後,顯示剩餘項目數
        updateRemainingItems(todos);
      } catch (e) {
        console.error(e);
      }
    };
    getTodosAsync();
  }, []);

  //每當navigate || isAuthenticated 改變
  //都會檢查isAuthenticated
  //驗證失敗 則 導引回/login
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [navigate, isAuthenticated]);

  return (
    <div>
      TodoPage
      <Header username={currentMember?.name} />
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
