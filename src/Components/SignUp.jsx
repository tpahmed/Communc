import { useContext, useState } from 'react';
import Container from './Global/Container';
import Language from '../Languages.json';

import "./SignUp.css";
import { Main_Context } from "../Contexts/MainContext";
import { useNavigate } from 'react-router-dom';


export default function SignUp() {
    
    const [AddAccount,setAddAccount] = useState({email:'',password:'', confirm_password:'', username:''});
    const [Confirm, setConfirm] = useState();
    const {LANG} = useContext(Main_Context);
    const Navigator = useNavigate();
    const confirm = ()=>{
        if (AddAccount.password !== AddAccount.confirm_password){
            setConfirm(false)
        } else {
            setConfirm(true);
        }
    }

  return (
    <Container>
        <div className='SignUp'>
            <input type="text" placeholder={Language[LANG]['SignUp']['Username']} value={AddAccount.username} onChange={(e)=>setAddAccount({...AddAccount, username:e.target.value})} />
            <input type="text" placeholder={Language[LANG]['SignUp']['Email']} value={AddAccount.email} onChange={(e)=>setAddAccount({...AddAccount, email:e.target.value})} />
            <input type="password" placeholder={Language[LANG]['SignUp']['Password']} value={AddAccount.password} onChange={(e)=>setAddAccount({...AddAccount, password:e.target.value})} />
            <input type="password" placeholder={Language[LANG]['SignUp']['Confirm Password']} value={AddAccount.confirm_password} onChange={(e)=>setAddAccount({...AddAccount, confirm_password:e.target.value})} />
            <button>{Language[LANG]['SignUp']['SignUp']}</button>
            <b onClick={()=>Navigator('/login')}>I have an account</b>
        </div>
    </Container>
  )
}
