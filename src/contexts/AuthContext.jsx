import { useState, createContext, useEffect, useContext } from 'react';
import { login, register, checkPermission } from '../api/auth';
import * as jwt from 'jsonwebtoken';
import { useLocation } from 'react-router-dom';

//定義想共享的狀態與方法;
const defaultAuthContext = {
  isAuthenticated: false, // 使用者是否登入的判斷依據，預設為 false，若取得後端的有效憑證，則切換為 true
  currentMember: null, // 當前使用者相關資料，預設為 null，成功登入後就會有使用者資料
  register: null, // 註冊方法
  login: null, // 登入方法
  logout: null, // 登入方法
};

//建立context
const AuthContext = createContext(defaultAuthContext);
//創建自定義的 useAuth Hook，不需要每次都使用 useContext(AuthContext)，
//而是可以直接使用 useAuth()
export const useAuth = () => useContext(AuthContext);
//用來管理狀態, 封裝會影響身分狀態的方法
export const AuthProvider = ({ children }) => {
  //設定狀態 --> props給Provider
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [payload, setPayload] = useState(null);
  const { pathname } = useLocation();

  //每當pathname變動,就執行checkTokenIsValid
  useEffect(() => {
    const checkTokenIsValid = async () => {
      //檢查localStorage是否有authToken
      const authToken = localStorage.getItem('authToken');
      //authToken不存在
      if (!authToken) {
        setIsAuthenticated(false);
        setPayload(null);
        return;
      }
      //若autoToken存在 代入checkPermission --> success? 檢查是否有效
      const result = await checkPermission(authToken);
      //success true --> 更改狀態 已驗證,authToken
      if (result) {
        setIsAuthenticated(true);
        //解碼authToken
        const temPayload = jwt.decode(authToken);
        //破解後的data --> 憑證更新
        setPayload(temPayload);
      } else {
        //success false --> 更改狀態 未驗證,null
        setIsAuthenticated(false);
        setPayload(null);
      }
    };
    checkTokenIsValid();
    //每當pathname變動,就執行checkTokenIsValid
  }, [pathname]);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        //有可能是null --> payload true 則
        currentMember: payload && {
          id: payload.sub,
          name: payload.name,
        },

        register: async (data) => {
          //發送新增data請求給register,
          //並解構回傳的data 取得 success & authToken
          const { success, authToken } = await register({
            username: data.username,
            email: data.email,
            password: data.password,
          });
          //解碼還原取得的authToken --> 需安裝jsonwebtoken套件
          const tempPayload = jwt.decode(authToken);
          //解碼成功 --> 更新到payload,已驗證true,auth存入localStorage
          if (tempPayload) {
            setPayload(tempPayload);
            setIsAuthenticated(true);
            localStorage.setItem('authToken', authToken);
          } else {
            //解碼失敗 --> payload(null),已驗正false
            setPayload(null);
            setIsAuthenticated(false);
          }
          //回傳註冊success結果(由register取得)
          return success;
        },

        //除了代入login的參數不用email,其他同register
        login: async (data) => {
          const { success, authToken } = await login({
            username: data.username,
            password: data.password,
          });
          //解碼還原取得的authToken --> 需安裝jsonwebtoken套件
          const tempPayload = jwt.decode(authToken);
          //解碼成功 --> 更新到payload,已驗證true,auth存入localStorage
          if (tempPayload) {
            setPayload(tempPayload);
            setIsAuthenticated(true);
            localStorage.setItem('authToken', authToken);
          } else {
            //解碼失敗 --> payload(null),已驗正false
            setPayload(null);
            setIsAuthenticated(false);
          }
          //回傳註冊success結果(由register取得)
          return success;
        },

        //登出 --> 移除authToken
        logout: () => {
          localStorage.removeItem('authToken');
          setPayload(null);
          setIsAuthenticated(false);
        },
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
