import { BrowserRouter, Routes, Route } from 'react-router-dom'
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
        <Routes>
          <Route index path='/' element={<></>}/>
          <Route path='/login' element={<Login/>}/>
          <Route path='/signUp' element={<SignUp/>}/>
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
