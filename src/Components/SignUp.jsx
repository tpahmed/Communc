import { useContext, useRef, useState } from 'react';
import Container from './Global/Container';
import Language from '../Languages.json';
import themeJSON from '../Theme.json';
import '@fortawesome/fontawesome-free/css/all.min.css';
import Logo from '../assets/logo.svg'
import IImage from '../assets/Image-Icon.svg';
import "./SignUp.css";
import { Main_Context } from "../Contexts/MainContext";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Profile_Context } from '../Contexts/ProfileContext';
import CssFilterConverter from 'css-filter-converter';


export default function SignUp() {
    
    const [AddAccount,setAddAccount] = useState({photo:'', first_name:'', last_name:'',email:'',password:'', confirm_password:'', username:''});
    const [ImgPreview,SetImgPreview] = useState(null);
    const [flash,setFlash] = useState('')
    const {Account,getAccount} = useContext(Profile_Context);
    const HTF = CssFilterConverter.hexToFilter;
    const [SVG_filter,SetSVG_filter] = useState(HTF(themeJSON[Account.theme].text).color);
    const Navigator = useNavigate();
    const imageInput = useRef(null);
    
    const SignupAction = async()=>{
        
        if (!AddAccount.password){
            setFlash(Language[Account.language]['SignUp']['All fields are required']);
            return;
        }
        if (AddAccount.password !== AddAccount.confirm_password){
            setFlash(Language[Account.language]['SignUp']['Password Confirmation must be identical']);
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
                setFlash('');
                getAccount();
                Navigator('/');
                return
            }
            setFlash(res.data.msg);
            
        })
      }
      const handleimage = (e)=>{
        if (e.target.files[0] && /image\/./.test(e.target.files[0].type)){
        setAddAccount({...AddAccount,image:e.target.files[0]});
          const imageUrl = URL.createObjectURL(e.target.files[0]);
          SetImgPreview(imageUrl);
        }
      }
  return (
    <Container>
        <div className='SignUp'>
            <img src={Logo} alt={Language[Account.language]['SignUp']["Logo"]} height={'10%'}  style={{ 'filter':HTF(themeJSON[Account.theme].text).color }} />
            {flash ? <b className="Login-flash">{flash}</b> : <></>}
            <div className='SignUp-image-input'>
                <input type="file" ref={imageInput} onChange={handleimage} style={{ display:'none' }}/>
                <img src={ImgPreview ? ImgPreview : IImage} onClick={()=>imageInput.current.click()} alt={Language[Account.language]['SignUp']['Profile picture']} style={{ filter:ImgPreview ? null : SVG_filter,height:'100px',borderRadius:"100%" }} />
            </div>

            <div className='name'>
            <input onKeyDown={(e)=>e.key == 'Enter' ? SignupAction() : null} className='first_name' type="text" placeholder={Language[Account.language]['SignUp']['First Name']} value={AddAccount.first_name} onChange={(e)=>setAddAccount({...AddAccount, first_name:e.target.value})} />
            <input onKeyDown={(e)=>e.key == 'Enter' ? SignupAction() : null} className='last_name' type="text" placeholder={Language[Account.language]['SignUp']['Last Name']} value={AddAccount.last_name} onChange={(e)=>setAddAccount({...AddAccount, last_name:e.target.value})} />
            </div>
            <input onKeyDown={(e)=>e.key == 'Enter' ? SignupAction() : null} type="text" placeholder={Language[Account.language]['SignUp']['Username']} value={AddAccount.username} onChange={(e)=>setAddAccount({...AddAccount, username:e.target.value})} />
            <input onKeyDown={(e)=>e.key == 'Enter' ? SignupAction() : null} type="text" placeholder={Language[Account.language]['SignUp']['Email']} value={AddAccount.email} onChange={(e)=>setAddAccount({...AddAccount, email:e.target.value})} />
            <input onKeyDown={(e)=>e.key == 'Enter' ? SignupAction() : null} type="password" placeholder={Language[Account.language]['SignUp']['Password']} value={AddAccount.password} onChange={(e)=>setAddAccount({...AddAccount, password:e.target.value})} />
            <input onKeyDown={(e)=>e.key == 'Enter' ? SignupAction() : null} type="password" placeholder={Language[Account.language]['SignUp']['Confirm Password']} value={AddAccount.confirm_password} onChange={(e)=>setAddAccount({...AddAccount, confirm_password:e.target.value})} />
            <button onClick={SignupAction}>{Language[Account.language]['SignUp']['SignUp']}</button>
            <b onClick={()=>Navigator('/login')}>I have an account</b>
        </div>
    </Container>
  )
}
