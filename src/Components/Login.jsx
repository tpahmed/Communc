import { useContext, useState } from "react";
import Container from "./Global/Container"
import Language from '../Languages.json'

import './Login.css';
import { Main_Context } from "../Contexts/MainContext";
import { useNavigate } from "react-router-dom";
import { invoke } from "@tauri-apps/api";
import { Profile_Context } from "../Contexts/ProfileContext";


export default function Login() {
    const [LoginAccount,setLoginAccount] = useState({email:'',password:''});
    const {Account,getAccount} = useContext(Profile_Context);
    const [Remember,setRemember] = useState(false);
    const [flash,setFlash] = useState('');
    const Navigator = useNavigate();
    const loginAction = async ()=>{
      const result = await invoke('login',LoginAccount);
      const result_json = JSON.parse(result);
      if (result_json.success){
        sessionStorage.setItem('token',result_json.msg.token);
        if (Remember){
          localStorage.setItem('token',result_json.msg.token);
        }
        setFlash('');
        await getAccount();
        Navigator('/')
        return
      }
      setFlash(result_json.msg);

    }
    
  return (
    <Container>
        <div className="Login">
            <b className="Login-flash">{flash}</b>
            <input onKeyDown={(e)=>e.key == 'Enter' ? loginAction() : null} type="text" placeholder={Language[Account.language]['Login']["Email"]} value={LoginAccount.email} onChange={(e)=>setLoginAccount({...LoginAccount,email:e.target.value})}/>
            <input onKeyDown={(e)=>e.key == 'Enter' ? loginAction() : null} type="password" placeholder={Language[Account.language]['Login']["Password"]} value={LoginAccount.password} onChange={(e)=>setLoginAccount({...LoginAccount,password:e.target.value})}/>
            <span onClick={()=>Navigator('/forgot')}>Forgot password</span>
            <div onClick={()=>setRemember(!Remember)}><div className="W-Hub-CheckBox"><div style={!Remember ? { 'transform' : 'translateX(-50%) translateY(-50%) scale(0)' } : null}></div></div> Remember me</div>
            <button onClick={loginAction}>{Language[Account.language]['Login']["Login"]}</button>
            <b onClick={()=>Navigator('/signup')}>create an account</b>
            
        </div>
    </Container>
  )
}
