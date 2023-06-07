import CssFilterConverter from "css-filter-converter";
import Language from "../Languages.json";
import themeJSON from "../Theme.json";
import { useContext, useEffect, useState } from "react";
import { Main_Context } from "../Contexts/MainContext";
import ILogout from "../assets/Logout-Icon.svg";
import IPen from "../assets/Pen-Icon.svg";
import Container from "./Global/Container";
import "./Profile.css";
import { Profile_Context } from "../Contexts/ProfileContext";
import { ActionBar_Context } from "../Contexts/ActionBarContext";
import { useNavigate } from "react-router-dom";

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
                <span>{Language["ENG"]["Profile"]["First Name:"]}</span>
                <input type="text" onKeyDown={(e)=>e.key == 'Enter' ? Done() : null} value={Account.fname} onChange={(e)=>SetAccount({...Account,fname:e.target.value})} />
            </div>
            <div>
                <span>{Language["ENG"]["Profile"]["Last Name:"]}</span>
                <input type="text" onKeyDown={(e)=>e.key == 'Enter' ? Done() : null} value={Account.lname}  onChange={(e)=>SetAccount({...Account,lname:e.target.value})}/>
            </div>
            <button onClick={Done}>
                {Language["ENG"]["Profile"]["Done"]}
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
            <b className="Login-flash">{Language["ENG"]["BackEndErrors"][flash]}</b>
            <div>
                <span>{Language["ENG"]["Profile"]["Email:"]}</span>
                <input type="text" value={Account.email} onKeyDown={(e)=>e.key == 'Enter' ? Done() : null} onChange={(e)=>SetAccount({...Account,email:e.target.value})} />
            </div>
            <button onClick={Done}>
                {Language["ENG"]["Profile"]["Done"]}
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
            return setFlash(Language["ENG"]["Profile"]["Password and Password Confirmation must be identical"]);
        }
        const result = await CommitChanges();
        setFlash(result);
        if(!result){
            SetActionBar_Active(0);
        }
    }
    return (
        <div className="Profile-Change">
            <b className="Login-flash">{Language["ENG"]["BackEndErrors"][flash]}</b>
            <div>
                <span>{Language["ENG"]["Profile"]["Old Password:"]}</span>
                <input type="password" value={Account.old_pass} onKeyDown={(e)=>e.key == 'Enter' ? Done() : null} onChange={(e)=>SetAccount({...Account,old_pass:e.target.value})} />
            </div>
            <div>
                <span>{Language["ENG"]["Profile"]["New Password:"]}</span>
                <input type="password" value={Account.new_pass} onKeyDown={(e)=>e.key == 'Enter' ? Done() : null} onChange={(e)=>SetAccount({...Account,new_pass:e.target.value})} />
            </div>
            <div>
                <span>{Language["ENG"]["Profile"]["Confirm Password:"]}</span>
                <input type="password" value={conf_pass} onKeyDown={(e)=>e.key == 'Enter' ? Done() : null} onChange={(e)=>setConf_pass(e.target.value)} />
            </div>
            <button onClick={Done}>
                {Language["ENG"]["Profile"]["Done"]}
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
            <span>{Language["ENG"]["Profile"]["Select Language:"]}</span>
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
                {Language["ENG"]["Profile"]["Done"]}
            </button>
        </div>
    )
}

export default function Profile() {
    const {THEME} = useContext(Main_Context);
    const {SetActionBar_title,SetActionBar_content,SetActionBar_Active} = useContext(ActionBar_Context);
    const {Account,getAccount} = useContext(Profile_Context);
    const HTF = CssFilterConverter.hexToFilter;
    const [SVG_filter,SetSVG_filter] = useState(HTF(themeJSON[Account.theme].red).color);
    const Navigator = useNavigate();
    useEffect(()=>{
        SetSVG_filter(HTF(themeJSON[Account.theme].red).color);
    },[Account.theme]);
    useEffect(()=>{
        getAccount();
    },[]);
    
    function Logout(){
        sessionStorage.clear();
        localStorage.clear();
        Navigator('/login');
    }
    function Change_Name(){
        SetActionBar_title(Language["ENG"]["Profile"]["Change Name"]);
        SetActionBar_content(<ChangeName/>)
        SetActionBar_Active(1);
    }
    function Change_Email(){
        SetActionBar_title(Language["ENG"]["Profile"]["Change Email"]);
        SetActionBar_content(<ChangeEmail/>)
        SetActionBar_Active(1);
    }
    function Change_Password(){
        SetActionBar_title(Language["ENG"]["Profile"]["Change Password"]);
        SetActionBar_content(<ChangePassword/>)
        SetActionBar_Active(1);
    }
    function Change_Theme(){
        SetActionBar_title(Language["ENG"]["Profile"]["Change Theme"]);
        SetActionBar_content(<ChangeTheme/>)
        SetActionBar_Active(1);
    }
    return (
        <Container>
            <div className='Profile'>
                <div className="Profile-TitleBar">
                    <span>{Language["ENG"]["Profile"]["Your Profile"]}</span>
                    <span onClick={Logout}>{Language["ENG"]["Profile"]["Logout"]} <img src={ILogout} alt={Language["ENG"]["Profile"]["Logout"]} style={{ filter:SVG_filter }} width={"40px"} height={"40px"} /></span>
                </div>
                <div className="Profile-content">
                    <img src={Account.image} alt={Language["ENG"]["Profile"]["Profile Picture"]} width={'160px'} />
                    <div>
                        <span>{Account.fname} {Account.lname}</span>
                        <img onClick={Change_Name} src={IPen} alt={Language["ENG"]["Profile"]["Edit First and Last Name"]} width={'20px'} style={{ filter:HTF(themeJSON[Account.theme].text).color }} />
                    </div>
                    <span>@{Account.username}</span>
                    <div>
                        <button onClick={Change_Email}>
                            {Language["ENG"]["Profile"]["Change Email"]}
                        </button>
                        <button onClick={Change_Password}>
                            {Language["ENG"]["Profile"]["Change Password"]}
                        </button>
                        <button>
                            {Language["ENG"]["Profile"]["Report bug"]}
                        </button>
                    </div>
                    <div>
                        <button onClick={Change_Theme}>
                            {Language["ENG"]["Profile"]["Change Theme"]}
                        </button>
                        <button>
                            {Language["ENG"]["Profile"]["Change Language"]}
                        </button>
                    </div>
                </div>
            </div>
        </Container>
    )
}
