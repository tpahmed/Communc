import { useContext, useEffect, useState } from "react";
import { Main_Context } from "../Contexts/MainContext";
import LArrow from '../assets/Left-Arrow.svg';
import Language from '../Languages.json';
import themeJSON from '../Theme.json';
import './ForgotPass.css';
import CssFilterConverter from "css-filter-converter";
import { useNavigate, useParams } from "react-router-dom";
import Container from "./Global/Container";
import { invoke } from "@tauri-apps/api";

export default function ForgotPass() {

    const { param_email } = useParams();
    const Navigator = useNavigate();
    const {LANG,THEME} = useContext(Main_Context);
    const HTF = CssFilterConverter.hexToFilter;
    const [SVG_filter] = useState(HTF(themeJSON[THEME].text).color);

    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    
    const [email,setEmail] = useState('');
    const [code,setCode] = useState('');
    const [validated,setValidated] = useState(false);
    const [password,setPassword] = useState('');
    const [Cpassword,setCPassword] = useState('');
    const [flash,setFlash] = useState('');
    
    
    async function validate(){

        let result = JSON.parse(await invoke('check_recovery',{code,email}));
        console.log(result);
        if(!result.success){
            return setFlash(Language[LANG]['ForgotPass']["Wrong code"])
        }
        setFlash('');
        setValidated(true);
    }
    async function changePass(){
        if(password !== Cpassword){
            return setFlash(Language[LANG]['ForgotPass']['Password Confirmation must be identical'])
        }
        let result = JSON.parse(await invoke('change_password',{code,email,password}));
        if (!result.success){
            return setFlash(Language[LANG]['ForgotPass']['Internal error please try again'])
        }
        Navigator('/login')
        setFlash('');
    }
    async function send(){
        if(!email || !emailRegex.test(email)){
            return;
        }
        let result = JSON.parse(await invoke('forgot_pass',{email}));
        if (!result.success){
            setFlash(result.msg);
            return;
        }
        
        setCode('');
        setFlash('');
        Navigator('/forgot/'+email);
    }
    if (param_email && emailRegex.test(param_email)){
        return (
            <>
                {
                    !validated ? (
                        <Container>
                            <div className="ForgotPass">
                                <b className="Login-flash">{flash}</b>
                                <div onClick={()=>Navigator('/forgot')}><img src={LArrow} alt={Language[LANG]['ForgotPass']["Change Email"]} style={{ 'filter':SVG_filter }} width={'25px'} />{Language[LANG]['ForgotPass']["Change Email"]}</div>
                                <span>{Language[LANG]['ForgotPass']["Please enter the code sent to "]}<b style={{ 'color':'var(--accent)' }}>{param_email}</b></span>
                                <input type="text" placeholder={Language[LANG]['ForgotPass']["Code"]} value={code} onChange={(e)=>setCode(!isNaN(Number(e.target.value)) ? e.target.value : code)}/>
                                <button onClick={validate}>{Language[LANG]['ForgotPass']["Validate"]}</button>
                            </div>
                        </Container>
                        ):(
                        <Container>
                            <div className="ForgotPass">
                                <b className="Login-flash">{flash}</b>
                                <div onClick={()=>Navigator('/login')}><img src={LArrow} alt={Language[LANG]['ForgotPass']["Go Back to Login"]} style={{ 'filter':SVG_filter }} width={'25px'} />{Language[LANG]['ForgotPass']["Go Back to Login"]}</div>
                                <span>{Language[LANG]['ForgotPass']["Please enter Your new Password"]}</span>
                                <input type="password" placeholder={Language[LANG]['ForgotPass']["Password"]} value={password} onChange={(e)=>setPassword(e.target.value)}/>
                                <input type="password" placeholder={Language[LANG]['ForgotPass']["Confirm Password"]} value={Cpassword} onChange={(e)=>setCPassword(e.target.value)}/>
                                <button onClick={changePass}>{Language[LANG]['ForgotPass']["Change"]}</button>
                            </div>
                        </Container>
                    )
                }
                
            </>
        )
    }
    return (
    <Container>
        <div className="ForgotPass">
            <b className="Login-flash">{flash}</b>
            <div onClick={()=>Navigator('/login')}><img src={LArrow} alt={Language[LANG]['ForgotPass']["Go Back"]} style={{ 'filter':SVG_filter }} width={'25px'} />{Language[LANG]['ForgotPass']["Go Back"]}</div>
            <input type="text" placeholder={Language[LANG]['ForgotPass']["Email"]} value={email} onChange={(e)=>setEmail(e.target.value)}/>
            <button onClick={send}>{Language[LANG]['ForgotPass']["Send"]}</button>
        </div>
    </Container>
    )
}
