import { useLocation, useNavigate } from 'react-router-dom';
import './Container.css';
import { invoke } from "@tauri-apps/api";
import { useContext, useEffect } from 'react';
import { Main_Context } from '../../Contexts/MainContext';
import { motion } from 'framer-motion';
import { ActionBar_Context } from '../../Contexts/ActionBarContext';

export default function Container({children}) {
  const location = useLocation();
  const Navigator = useNavigate();
  const {ActionBar_Active,SetActionBar_Active} = useContext(ActionBar_Context);
  const check_token = ()=>{
    let token = sessionStorage.getItem('token');
    if(!token && !(['/login','/signup','/forgot'].includes(location.pathname) || /\/forgot\/./.test(location.pathname))){
      Navigator('/login');
      return
    }
    if(!token){
      return
    }
    invoke('check_token',{token}).then((res)=>{
      const res_json = JSON.parse(res);
      if (res_json.success && (['/login','/signup','/forgot'].includes(location.pathname) || /\/forgot\/./.test(location.pathname))){
        Navigator('/');
      }
      else if(!res_json.success && !(['/login','/signup','/forgot'].includes(location.pathname) || /\/forgot\/./.test(location.pathname))){
        sessionStorage.clear();
        localStorage.clear();
        Navigator('/login');
      }
  
    });
  }
  useEffect(()=>{
    check_token();
  },[]);
  if (localStorage.getItem('token')){
    sessionStorage.setItem('token',localStorage.getItem('token'));
    
  }
  return (
    <motion.div className={`Container ${ActionBar_Active ? "Container-Blur" : ''}`} transition={{ duration:0.3 }} initial={{ 'top':'100%','opacity':'0%' }} animate={{ 'top':'calc(50% + 1.25em)','opacity':'100%',transition:{opacity:{duration: 0.2,delay: 0.1}} }} exit={{ 'top':'100%','opacity':'0%' }}>{children}</motion.div>
  )
}
