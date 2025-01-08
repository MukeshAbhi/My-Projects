import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import { Signup } from './pages/Signup'


function App() {
  

  return (
      <BrowserRouter>
        <Routes>
          <Route path='/signup' element={<Signup />}/>
        </Routes>
      </BrowserRouter>
  )
}

export default App
