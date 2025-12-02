import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Content from './components/Content';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthContext } from './content';
import { useState } from 'react';

function App() {
  const [balance, setBalance] = useState(0);
  const [userId, setUserId] = useState<string | null>(() => {
    return sessionStorage.getItem('userId');
  });
  const [isAuth, setIsAuth] = useState<boolean>(() => {
    return !!sessionStorage.getItem('token');
  })
  return (
    <AuthContext.Provider value={{ isAuth, setIsAuth, balance, setBalance, userId, setUserId }}>
      <div className='app_container'>
        <BrowserRouter>
          <Routes>
            <Route path='/*' element={<Content />} />
          </Routes>
        </BrowserRouter>

        <ToastContainer
          position="top-center"
          autoClose={1000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </div>
    </AuthContext.Provider>
  )
}

export default App
