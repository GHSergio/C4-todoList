import axios from 'axios';
// baseUrl 替換成 Todo List API
const baseUrl = 'https://todo-list.alphacamp.io/api';

//新增 axios instance；
const axiosInstance = axios.create({
  baseURL: baseUrl,
});

//在 header 中加上從 Local Storage 拿的 token，如果 token 存在，就透過 config.headers 來設定 headers，並回傳 config
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error(error);
  },
);

//根據API規定,各自發送請求 --> 獲取data
export const getTodos = async () => {
  try {
    //發送Get請求到Url,請求內容:Get Url數據
    const res = await axiosInstance.get(`${baseUrl}/todos`);
    return res.data.data;
  } catch (err) {
    console.error('Get Todos failed', err);
  }
};

export const createTodo = async (payload) => {
  const { title, isDone } = payload;
  try {
    //發送Post請求到Url , 請求內容:Post對象,屬性為{title,isDone}
    const res = await axiosInstance.post(`${baseUrl}/todos`, { title, isDone });
    return res.data;
  } catch (err) {
    console.error('Post Todo failed', err);
  }
};

export const patchTodo = async (payload) => {
  const { id, title, isDone } = payload;
  try {
    //發送Patch請求到Url+{id} , 請求內容:Patch對象{id},屬性{title,isDone}
    const res = await axiosInstance.patch(`${baseUrl}/todos/${id}`, {
      title,
      isDone,
    });
    return res.data;
  } catch (err) {
    console.error('Patch Todos failed', err);
  }
};

export const deleteTodo = async (id) => {
  try {
    //發送Delete請求到Url+{id} , 請求內容:delete對象{id}
    const res = await axiosInstance.delete(`${baseUrl}/todos/${id}`);
    return res.data;
  } catch (err) {
    console.error('Delete Todo failed', err);
  }
};
