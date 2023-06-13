import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import NavBar from './Components/Global/NavBar'
import { appWindow } from "@tauri-apps/api/window";
import { invoke } from '@tauri-apps/api'
import { useState, useContext, useEffect } from 'react'
import themeJSON from './Theme.json';
import SideBar from './Components/Global/SideBar'
import Login from './Components/Login';
import SignUp from './Components/SignUp';
import ForgotPass from './Components/ForgotPass';
import { AnimatePresence } from 'framer-motion';
import Friends from './Components/Friends';
import ActionBar from './Components/Global/ActionBar';
import Messages from './Components/Messages';
import Profile from './Components/Profile';
import { Profile_Context } from './Contexts/ProfileContext';
import Communities from './Components/communities';
import Community from './Components/Communities/Community';

function App() {
  // const [name,setName] = useState('');
  // const [result,setResult] = useState('');
  const { Account } = useContext(Profile_Context);

  // async function TEST(){
  //   setResult(await invoke('greet',{name}));
  // }
  const root = document.documentElement;
  const colors = themeJSON[Account.theme];
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
        <ActionBar title={"test"} content={<div>test</div>}/>
        <AnimatePresence>
          <Routes>
              <Route index path='/communities' element={<Communities/>}/>
              <Route index path='/communities/:id' element={<Community/>}/>
              <Route index path='/profile' element={<Profile/>}/>
              <Route index path='/friends' element={<Friends/>}/>
              <Route index path='/messages' element={<Messages/>}/>
              <Route path='/login' element={<Login/>}/>
              <Route path='/signup' element={<SignUp/>}/>
              <Route path='/forgot' element={<ForgotPass/>}/>
              <Route path='/forgot/:param_email' element={<ForgotPass/>}/>
              <Route path='*' element={<Navigate to={'/communities'}/>}/>
          </Routes>
        </AnimatePresence>
      </BrowserRouter>
    </div>
  )
}

export default App
