import { useContext, useState } from 'react';
import Container from './Global/Container';
import Language from '../Languages.json';
import '@fortawesome/fontawesome-free/css/all.min.css';

import "./SignUp.css";
import { Main_Context } from "../Contexts/MainContext";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';


export default function SignUp() {
    
    const [AddAccount,setAddAccount] = useState({photo:'', first_name:'', last_name:'',email:'',password:'', confirm_password:'', username:''});
    const [flash,setFlash] = useState('')

    const {LANG,SetLANG,SetTHEME} = useContext(Main_Context);
    const Navigator = useNavigate();
   
    
    const SignupAction = async()=>{
        
        if (!AddAccount.password){
            setFlash(Language[LANG]['SignUp']['All fields are required']);
            return;
        }
        if (AddAccount.password !== AddAccount.confirm_password){
            setFlash(Language[LANG]['SignUp']['Password Confirmation must be identical']);
            return;
        }
        const formData = new FormData();
        formData.append('pfp',AddAccount.photo);
        formData.append('Account',JSON.stringify(AddAccount));
        axios.post('//localhost:4055/signup',formData,{
          headers:'multipart/form-data'
        })
        .then((res)=>{
            console.log(res);
            if (res.data.success){
                sessionStorage.setItem('token',res.data.msg.token);
                localStorage.setItem('token',res.data.msg.token);
                sessionStorage.setItem('pfp',res.data.msg.pfp);
                localStorage.setItem('pfp',res.data.msg.pfp);
                sessionStorage.setItem('params',JSON.stringify({'theme':res.data.msg.theme,'lang':res.data.msg.lang}));
                SetLANG(res.data.msg.lang);
                SetTHEME(res.data.msg.theme);
                setFlash('');
                Navigator('/')
                return
            }
            setFlash(res.data.msg);
            
        })
      }

  return (
    <Container>
        <div className='SignUp'>
            <b className="Login-flash">{flash}</b>
            <div className='image-input'>
                <input type="file" alt={Language[LANG]['SignUp']['Profile picture']} onChange={(e)=>setAddAccount({...AddAccount,photo:e.target.files[0]})}/>
            </div>

            <div className='name'>
            <input className='first_name' type="text" placeholder={Language[LANG]['SignUp']['First Name']} value={AddAccount.first_name} onChange={(e)=>setAddAccount({...AddAccount, first_name:e.target.value})} />
            <input className='last_name' type="text" placeholder={Language[LANG]['SignUp']['Last Name']} value={AddAccount.last_name} onChange={(e)=>setAddAccount({...AddAccount, last_name:e.target.value})} />
            </div>
            <input type="text" placeholder={Language[LANG]['SignUp']['Username']} value={AddAccount.username} onChange={(e)=>setAddAccount({...AddAccount, username:e.target.value})} />
            <input type="text" placeholder={Language[LANG]['SignUp']['Email']} value={AddAccount.email} onChange={(e)=>setAddAccount({...AddAccount, email:e.target.value})} />
            <input type="password" placeholder={Language[LANG]['SignUp']['Password']} value={AddAccount.password} onChange={(e)=>setAddAccount({...AddAccount, password:e.target.value})} />
            <input type="password" placeholder={Language[LANG]['SignUp']['Confirm Password']} value={AddAccount.confirm_password} onChange={(e)=>setAddAccount({...AddAccount, confirm_password:e.target.value})} />
            <button onClick={SignupAction}>{Language[LANG]['SignUp']['SignUp']}</button>
            <b onClick={()=>Navigator('/login')}>I have an account</b>
        </div>
    </Container>
  )
}
