import { BrowserRouter, Navigate, Outlet, Route, Routes, useLocation } from 'react-router-dom'
import './App.css'
import { Home } from './pages/Home'
import { Profile } from './pages/Profile';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { ResetPassword } from './pages/ResetPassword';
import { useRecoilValue } from 'recoil';
import { userAtom } from './store/atoms/userAtom';
import { themeAtom } from './store/atoms/themeAtom';



//Function to check authentication 
const Layout = () => {
  const user = useRecoilValue(userAtom).user ;
  console.log(user);
  const location = useLocation();

  return <Outlet />

  // return user?.token ? (
  //   <Outlet />
  // ) : (
  //   <Navigate to={'/login'} state={{from : location}} replace />
  // )
}

function App() {
  
  const theme = useRecoilValue(themeAtom);
  console.log(theme);

  return (
    <div  data-theme={theme} className='w-full min-h-[100vh]'>
      <BrowserRouter>
        <Routes>
          {/* authenticated routes */}
          <Route element={<Layout />}>
            <Route path='/' element={<Home />}/>
            <Route path='/profile/:id?' element={<Profile />} />
          </Route>
          {/* non authenticated routes */}
          <Route path='/register' element={<Register />} />
          <Route path='/login' element={<Login />} />
          <Route path='/reset-password' element={<ResetPassword />} /> 
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
