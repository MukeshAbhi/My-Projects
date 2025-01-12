import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import  NewGame  from './game/main'

function App() {
  

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<NewGame />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
