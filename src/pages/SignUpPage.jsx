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

const SignUpPage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();
  const { register, isAuthenticated } = useAuth(); // 取出需要的狀態與方法
  const handleClick = async () => {
    if (username.length === 0) {
      return;
    }
    if (email.length === 0) {
      return;
    }
    if (password.length === 0) {
      return;
    }
    //發送註冊請求 期望取得success
    const success = await register({
      username,
      email,
      password,
    });
    //true --> authToken存入localStorage
    if (success) {
      //彈出提示訊息
      Swal.fire({
        title: '註冊成功',
        icon: 'success',
        showConfirmButton: false,
        timer: 2000,
        position: 'top',
      });
      return;
    }
    Swal.fire({
      title: '註冊失敗',
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
      <h1>建立您的帳號</h1>

      <AuthInputContainer>
        <AuthInput
          label="帳號"
          placeholder="請輸入帳號"
          value={username}
          onChange={(usernameInputValue) => setUsername(usernameInputValue)}
        />
      </AuthInputContainer>

      <AuthInputContainer>
        <AuthInput
          label="Email"
          placeholder="請輸入email"
          value={email}
          onChange={(emailInputValue) => setEmail(emailInputValue)}
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
      <AuthButton onClick={handleClick}>註冊</AuthButton>
      <Link to="/Login">
        <AuthLinkText>取消</AuthLinkText>
      </Link>
    </AuthContainer>
  );
};

export default SignUpPage;
