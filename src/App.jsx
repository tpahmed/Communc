import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import { Main_Context } from './Contexts/MainContext'
import NavBar from './Components/Global/NavBar'
import { appWindow } from "@tauri-apps/api/window";
import { invoke } from '@tauri-apps/api'
import { useState, useContext, useEffect } from 'react'
import themeJSON from './Theme.json';
import SideBar from './Components/Global/SideBar'
import Login from './Components/Login';
import SignUp from './Components/SignUp';
import ForgotPass from './Components/ForgotPass';
import Home from './Components/Home';
import { AnimatePresence } from 'framer-motion';
import Friends from './Components/Friends';

function App() {
  // const [name,setName] = useState('');
  // const [result,setResult] = useState('');
  const { THEME } = useContext(Main_Context);

  // async function TEST(){
  //   setResult(await invoke('greet',{name}));
  // }
  const root = document.documentElement;
  const colors = themeJSON[THEME];
  for (const color in colors) {
    const value = colors[color];
    root.style.setProperty(`--${color}`, value);
  }
  useEffect(()=>{
    window.addEventListener('resize',()=>appWindow.isMaximized().then((val)=>document.querySelector('.App').style.borderRadius = val ? '0' : '.4em'))
  },[]);
  return (
    <div className="App">
      <BrowserRouter>
        <NavBar/>
        <SideBar/>
        <AnimatePresence>
          <Routes>
              <Route index path='/projects' element={<Home/>}/>
              <Route index path='/friends' element={<Friends/>}/>
              <Route path='/login' element={<Login/>}/>
              <Route path='/signup' element={<SignUp/>}/>
              <Route path='/forgot' element={<ForgotPass/>}/>
              <Route path='/forgot/:param_email' element={<ForgotPass/>}/>
              <Route path='*' element={<Navigate to={'/projects'}/>}/>
          </Routes>
        </AnimatePresence>
      </BrowserRouter>
    </div>
  )
}

export default App
