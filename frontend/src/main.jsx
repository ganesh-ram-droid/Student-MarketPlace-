import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Login from './Pages/Login.jsx'
import SignUp from './Pages/SignUp.jsx'

createRoot(document.getElementById('root')).render(
 <BrowserRouter>
 <Routes>
  <Route path="/" element={<Login/>}/>
  <Route path='/login' element={<Login/>}/>
  <Route path='/login' element={<SignUp/>}/>
 </Routes>
 </BrowserRouter>
)
