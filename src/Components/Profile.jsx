import CssFilterConverter from "css-filter-converter";
import Language from "../Languages.json";
import themeJSON from "../Theme.json";
import { useContext, useEffect, useRef, useState } from "react";
import { Main_Context } from "../Contexts/MainContext";
import ILogout from "../assets/Logout-Icon.svg";
import IPen from "../assets/Pen-Icon.svg";
import Container from "./Global/Container";
import "./Profile.css";
import { Profile_Context } from "../Contexts/ProfileContext";
import { ActionBar_Context } from "../Contexts/ActionBarContext";
import { useNavigate } from "react-router-dom";
import { invoke } from "@tauri-apps/api";
import axios from "axios";

function ChangeImage(){
    const {Account,getAccount} = useContext(Profile_Context);
    const {SetActionBar_Active} = useContext(ActionBar_Context);
    const UploadInput = useRef();
    const [Image,setImage] = useState(null);
    const [ImagePrev,setImagePrev] = useState('');
    function handleImage(e){
        if(e.target.files[0] && /image\/./.test(e.target.files[0].type)){
            setImage(e.target.files[0]);
            const Obj_URL = URL.createObjectURL(e.target.files[0]);
            setImagePrev(Obj_URL);
        }
    }

    const Done = async ()=>{
        if(Image){
            const formData = new FormData();
            formData.append('token',sessionStorage.getItem('token'));
            formData.append('old_image',Account.image);
            formData.append('image',Image);
            await axios.post('//localhost:4055/profile/edit/image',formData,{
                headers:'multipart/form-data'
            })
            setImage(null);
            setImagePrev('');
            await getAccount();
        }
        SetActionBar_Active(0);
    }
    return (
        <div className="Profile-Change">
            <input type="file" style={{ display:"none" }} ref={UploadInput} onChange={handleImage}/>
            <img src={ImagePrev ? ImagePrev : Account.image} alt={Language[Account.language]["Profile"]["Profile Picture"]}/>
            
            <button onClick={()=>UploadInput.current.click()}>
                {Language[Account.language]["Profile"]["Upload"]}
            </button>
            <button onClick={Done}>
                {Language[Account.language]["Profile"]["Done"]}
            </button>
        </div>
    )
}

function ChangeName(){
    const {Account,SetAccount,CommitChanges} = useContext(Profile_Context);
    const {SetActionBar_Active} = useContext(ActionBar_Context);
    const Done = ()=>{
        CommitChanges();
        SetActionBar_Active(0);
    }
    return (
        <div className="Profile-Change">
            <div>
                <span>{Language[Account.language]["Profile"]["First Name:"]}</span>
                <input type="text" onKeyDown={(e)=>e.key == 'Enter' ? Done() : null} value={Account.fname} onChange={(e)=>SetAccount({...Account,fname:e.target.value})} />
            </div>
            <div>
                <span>{Language[Account.language]["Profile"]["Last Name:"]}</span>
                <input type="text" onKeyDown={(e)=>e.key == 'Enter' ? Done() : null} value={Account.lname}  onChange={(e)=>SetAccount({...Account,lname:e.target.value})}/>
            </div>
            <button onClick={Done}>
                {Language[Account.language]["Profile"]["Done"]}
            </button>
        </div>
    )
}
function ChangeEmail(){
    const {Account,SetAccount,CommitChanges} = useContext(Profile_Context);
    const {SetActionBar_Active} = useContext(ActionBar_Context);
    const [flash,setFlash] = useState('');
    const Done = async ()=>{
        const result = await CommitChanges();
        setFlash(result);
        if(!result){
            SetActionBar_Active(0);
        }
    }
    return (
        <div className="Profile-Change">
            <b className="Login-flash">{Language[Account.language]["BackEndErrors"][flash]}</b>
            <div>
                <span>{Language[Account.language]["Profile"]["Email:"]}</span>
                <input type="text" value={Account.email} onKeyDown={(e)=>e.key == 'Enter' ? Done() : null} onChange={(e)=>SetAccount({...Account,email:e.target.value})} />
            </div>
            <button onClick={Done}>
                {Language[Account.language]["Profile"]["Done"]}
            </button>
        </div>
    )
}
function ChangePassword(){
    const {Account,SetAccount,CommitChanges} = useContext(Profile_Context);
    const {SetActionBar_Active,ActionBar_Active} = useContext(ActionBar_Context);
    const [conf_pass,setConf_pass] = useState('');
    const [flash,setFlash] = useState('');
    useEffect(()=>{
        SetAccount({...Account,new_pass:'',old_pass:''});
        setFlash('');
        setConf_pass('');
    },[ActionBar_Active]);
    const Done = async ()=>{
        if (conf_pass !== Account.new_pass){
            return setFlash(Language[Account.language]["Profile"]["Password and Password Confirmation must be identical"]);
        }
        const result = await CommitChanges();
        setFlash(result);
        if(!result){
            SetActionBar_Active(0);
        }
    }
    return (
        <div className="Profile-Change">
            <b className="Login-flash">{Language[Account.language]["BackEndErrors"][flash]}</b>
            <div>
                <span>{Language[Account.language]["Profile"]["Old Password:"]}</span>
                <input type="password" value={Account.old_pass} onKeyDown={(e)=>e.key == 'Enter' ? Done() : null} onChange={(e)=>SetAccount({...Account,old_pass:e.target.value})} />
            </div>
            <div>
                <span>{Language[Account.language]["Profile"]["New Password:"]}</span>
                <input type="password" value={Account.new_pass} onKeyDown={(e)=>e.key == 'Enter' ? Done() : null} onChange={(e)=>SetAccount({...Account,new_pass:e.target.value})} />
            </div>
            <div>
                <span>{Language[Account.language]["Profile"]["Confirm Password:"]}</span>
                <input type="password" value={conf_pass} onKeyDown={(e)=>e.key == 'Enter' ? Done() : null} onChange={(e)=>setConf_pass(e.target.value)} />
            </div>
            <button onClick={Done}>
                {Language[Account.language]["Profile"]["Done"]}
            </button>
        </div>
    )
}
function ChangeTheme(){
    const {Account,SetAccount,CommitChanges} = useContext(Profile_Context);
    const {SetActionBar_Active} = useContext(ActionBar_Context);
    
    const Done = async ()=>{
        const result = await CommitChanges();
        SetActionBar_Active(0);
    }
    return (
        <div className="Profile-Change">
            <span>{Language[Account.language]["Profile"]["Select Theme:"]}</span>
            <ul>
                {
                    Object.keys(themeJSON).map((e)=>{
                        return (
                            <li key={e} onClick={()=>SetAccount({...Account,theme:e})} style={e == Account.theme ? { borderColor:'var(--green)' } : null}>{e}</li>
                        )
                    })
                }
            </ul>
            <button onClick={Done}>
                {Language[Account.language]["Profile"]["Done"]}
            </button>
        </div>
    )
}
function ChangeLanguage(){
    const {Account,SetAccount,CommitChanges} = useContext(Profile_Context);
    const {SetActionBar_Active} = useContext(ActionBar_Context);
    
    const Done = async ()=>{
        await CommitChanges();
        SetActionBar_Active(0);
    }
    return (
        <div className="Profile-Change">
            <span>{Language[Account.language]["Profile"]["Select Language:"]}</span>
            <ul>
                {
                    Object.keys(Language).map((e)=>{
                        return (
                            <li key={e} onClick={()=>SetAccount({...Account,language:e})} style={e == Account.language ? { borderColor:'var(--green)' } : null}>{e}</li>
                        )
                    })
                }
            </ul>
            <button onClick={Done}>
                {Language[Account.language]["Profile"]["Done"]}
            </button>
        </div>
    )
}

function Reportbug(){
    const {SetActionBar_Active} = useContext(ActionBar_Context);
    const [Message,SetMessage] = useState('');
    const Done = async ()=>{
        const result = await invoke('bug_report',{token:sessionStorage.getItem('token'),message:Message});
        SetActionBar_Active(0);
    }
    return (
        <div className="Profile-Change">
            <span>{Language[Account.language]["Profile"]["Bug Description:"]}</span>
            <textarea cols="30" rows="10" value={Message} onChange={(e)=>SetMessage(e.target.value)}></textarea>
            <button onClick={Done}>
                {Language[Account.language]["Profile"]["Send"]}
            </button>
        </div>
    )
}

export default function Profile() {
    const {SetActionBar_title,SetActionBar_content,SetActionBar_Active,ActionBar_Active} = useContext(ActionBar_Context);
    const {Account,getAccount} = useContext(Profile_Context);
    const HTF = CssFilterConverter.hexToFilter;
    const [SVG_filter,SetSVG_filter] = useState(HTF(themeJSON[Account.theme].red).color);
    const Navigator = useNavigate();
    useEffect(()=>{
        SetSVG_filter(HTF(themeJSON[Account.theme].red).color);
    },[Account.theme]);
    useEffect(()=>{
        getAccount();
    },[ActionBar_Active]);
    
    function Logout(){
        sessionStorage.clear();
        localStorage.clear();
        Navigator('/login');
    }
    function Change_Image(){
        SetActionBar_title(Language[Account.language]["Profile"]["Profile Picture Preview"]);
        SetActionBar_content(<ChangeImage/>)
        SetActionBar_Active(1);
    }
    function Change_Name(){
        SetActionBar_title(Language[Account.language]["Profile"]["Change Name"]);
        SetActionBar_content(<ChangeName/>)
        SetActionBar_Active(1);
    }
    function Change_Email(){
        SetActionBar_title(Language[Account.language]["Profile"]["Change Email"]);
        SetActionBar_content(<ChangeEmail/>)
        SetActionBar_Active(1);
    }
    function Change_Password(){
        SetActionBar_title(Language[Account.language]["Profile"]["Change Password"]);
        SetActionBar_content(<ChangePassword/>)
        SetActionBar_Active(1);
    }
    function Change_Theme(){
        SetActionBar_title(Language[Account.language]["Profile"]["Change Theme"]);
        SetActionBar_content(<ChangeTheme/>)
        SetActionBar_Active(1);
    }
    function Change_Language(){
        SetActionBar_title(Language[Account.language]["Profile"]["Change Language"]);
        SetActionBar_content(<ChangeLanguage/>)
        SetActionBar_Active(1);
    }
    function Report_Bug(){
        SetActionBar_title(Language[Account.language]["Profile"]["Report bug"]);
        SetActionBar_content(<Reportbug/>)
        SetActionBar_Active(1);
    }
    return (
        <Container>
            <div className='Profile'>
                <div className="Profile-TitleBar">
                    <span>{Language[Account.language]["Profile"]["Your Profile"]}</span>
                    <span onClick={Logout}>{Language[Account.language]["Profile"]["Logout"]} <img src={ILogout} alt={Language[Account.language]["Profile"]["Logout"]} style={{ filter:SVG_filter }} width={"40px"} height={"40px"} /></span>
                </div>
                <div className="Profile-content">
                    <img src={Account.image} alt={Language[Account.language]["Profile"]["Profile Picture"]} width={'160px'} height={'160px'} onClick={Change_Image} />
                    <div>
                        <span>{Account.fname} {Account.lname}</span>
                        <img onClick={Change_Name} src={IPen} alt={Language[Account.language]["Profile"]["Edit First and Last Name"]} width={'20px'} style={{ filter:HTF(themeJSON[Account.theme].text).color }} />
                    </div>
                    <span>@{Account.username}</span>
                    <div>
                        <button onClick={Change_Email}>
                            {Language[Account.language]["Profile"]["Change Email"]}
                        </button>
                        <button onClick={Change_Password}>
                            {Language[Account.language]["Profile"]["Change Password"]}
                        </button>
                        <button onClick={Report_Bug}>
                            {Language[Account.language]["Profile"]["Report bug"]}
                        </button>
                    </div>
                    <div>
                        <button onClick={Change_Theme}>
                            {Language[Account.language]["Profile"]["Change Theme"]}
                        </button>
                        <button onClick={Change_Language}>
                            {Language[Account.language]["Profile"]["Change Language"]}
                        </button>
                    </div>
                </div>
            </div>
        </Container>
    )
}
