import { useContext, useState } from "react";
import Container from "./Global/Container"
import Language from '../Languages.json'

import './Login.css';
import { Main_Context } from "../Contexts/MainContext";

export default function Login() {
    const [Account,setAccount] = useState({email:'',password:''});
    const [Remember,setRemember] = useState(false);
    const {LANG} = useContext(Main_Context);
  return (
    <Container>
        <div className="Login">
            <input type="text" placeholder={Language[LANG]['Login']["Email"]} value={Account.email} onChange={(e)=>setAccount({...Account,email:e.target.value})}/>
            <input type="password" placeholder={Language[LANG]['Login']["Password"]} value={Account.password} onChange={(e)=>setAccount({...Account,password:e.target.value})}/>
            <span>Forgot password</span>
            <div><div className="W-Hub-CheckBox" onClick={()=>setRemember(!Remember)}><div style={Remember ? { 'transform' : 'translateX(-50%) translateY(-50%) scale(0)' } : null}></div></div> Remember me</div>
            <button>{Language[LANG]['Login']["Login"]}</button>
            
        </div>
    </Container>
  )
}
