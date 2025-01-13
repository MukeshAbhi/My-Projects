import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import { Signup } from './pages/Signup'
import { Login } from './pages/Login'
import { Home } from './pages/Home'
import { Avatars } from './pages/Avatars'
import { Maps } from './pages/Maps'
import { Space } from './pages/Space'
import Game from './game/game'



function App() {
  

  return (
      <BrowserRouter>
        <Routes>
          <Route path='/signup' element={<Signup />}/>
          <Route path='/login' element={<Login />} />
          <Route path='/home' element={<Home />} />
          <Route path='/avatars' element={<Avatars />}/>
          <Route path='/maps' element={<Maps />} />
          <Route path='/space' element={<Space />} />
          <Route path='/game' element= {<Game />} />
        </Routes>
      </BrowserRouter>
  )
}

export default App
