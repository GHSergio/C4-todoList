import axios from 'axios';

const authURL = 'https://todo-list.alphacamp.io/api/auth';
//註冊 --> 會代入兩個參數

//帶著username , password 發出新增請求 --> 回傳data內是否有authToken
//-->有就添加success:true屬性
export const register = async ({ username, password }) => {
  //發送新增data請求 屬性username,password
  //回傳res,解構出data
  try {
    const { data } = await axios.post(`${authURL}/signUp`, {
      username,
      password,
    });
    // 從data解構出authToken
    const { authToken } = data;
    //true --> 新增success:true至data
    if (authToken) {
      return { ...data, success: true };
    }
    //不對data做更動
    return data;
  } catch (err) {
    console.error('[Register failed]', err);
  }
};

//登入 --> 會代入兩個參數
export const login = async ({ username, password }) => {
  try {
    //發送新增data的請求 屬性為username password
    //回傳res,解構出data
    const { data } = await axios.post(`${authURL}/login`, {
      username,
      password,
    });
    console.log(data);

    //從data解構出authToken
    const { authToken } = data;
    if (authToken) {
      return { ...data, success: true };
    }

    return data;
  } catch (err) {
    console.error('[Login failed]', err);
  }
};

//檢查權限 --> 取得Authorization
export const checkPermission = async (authToken) => {
  try {
    // 發送請求至後端, 請求獲得headers內Authorization數據;
    const response = await axios.get(`${authURL}/test-token`, {
      headers: {
        //字串 'Bearer ' 需要手動保留一個空格
        Authorization: 'Bearer ' + authToken,
      },
    });
    //回傳response.data的success
    return response.data.success;
  } catch (err) {
    console.error('[Check Permission failed]:', err);
  }
};
