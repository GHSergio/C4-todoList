import './App.scss';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { TodoPage, LoginPage, SignUpPage, HomePage } from 'pages';
import { AuthProvider } from 'contexts/AuthContext';
function App() {
  return (
    <div className="app">
      <BrowserRouter>
        {/* 掛載Provider */}
        <AuthProvider>
          <Routes>
            <Route path="login" element={<LoginPage />}></Route>
            <Route path="signUp" element={<SignUpPage />}></Route>
            <Route path="todos" element={<TodoPage />}></Route>
            <Route path="*" element={<HomePage />}></Route>
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
