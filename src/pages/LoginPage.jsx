import {
  AuthContainer,
  AuthInputContainer,
  AuthButton,
  AuthLinkText,
} from 'components/common/auth.styled';

import { ACLogoIcon } from 'assets/images';
import { AuthInput } from 'components';
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useAuth } from 'contexts/AuthContext'; // 引用封裝好的資訊

//click,呼叫login()
const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const { login, isAuthenticated } = useAuth(); // 取出需要的狀態與方法

  const handleClick = async () => {
    if (username.length === 0) {
      return;
    }
    if (password.length === 0) {
      return;
    }

    //設Context後,抽換 { success, authToken } --> success
    //只負責傳入{ username, password } 回傳值變成只有一個布林值
    const success = await login({ username, password });
    if (success) {
      Swal.fire({
        title: '登入成功',
        icon: 'success',
        showConfirmButton: false,
        timer: 2000,
        position: 'top',
      });
      return;
    }
    Swal.fire({
      title: '登入失敗',
      icon: 'error',
      showCancelButton: false,
      timer: 2000,
      position: 'top',
    });
  };

  //每當navigate || isAuthenticated 改變
  //都會檢查isAuthenticated
  //驗證成功 則 導引至/todos
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/todos');
    }
  }, [navigate, isAuthenticated]);

  return (
    <AuthContainer>
      <div>
        <ACLogoIcon />
      </div>
      <h1>登入 Todo</h1>

      <AuthInputContainer>
        <AuthInput
          label="帳號"
          placeholder="請輸入帳號"
          value={username}
          onChange={(nameInputValue) => setUsername(nameInputValue)}
        />
      </AuthInputContainer>

      <AuthInputContainer>
        <AuthInput
          type="password"
          label="密碼"
          placeholder="請輸入密碼"
          value={password}
          onChange={(passwordInputValue) => setPassword(passwordInputValue)}
        />
      </AuthInputContainer>
      <AuthButton onClick={handleClick}>登入</AuthButton>
      <Link to="/signUp">
        <AuthLinkText>註冊</AuthLinkText>
      </Link>
    </AuthContainer>
  );
};

export default LoginPage;
