import { useState } from 'react'
import {BrowserRouter,Routes,Route} from 'react-router-dom'
import Login from './pages/login.tsx'
import Dashboard from './pages/Dashboard.tsx'
import Download from './pages/Download.tsx'
import Previous from './pages/Previous.tsx'

function App() {
  const [count, setCount] = useState(0)



  return (
    <>
    <BrowserRouter>
       <Routes>
          <Route path='/' element={<Login/>}/>
          <Route path='/dashboard' element={<Dashboard/>}/>
          <Route path='/download' element={<Download/>}/>
          <Route path='/previous-download' element={<Previous/>}/>
       </Routes>
    </BrowserRouter>
     </>
  )
}

export default App
