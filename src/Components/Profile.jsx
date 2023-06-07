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

export default function Profile() {
    const {THEME} = useContext(Main_Context);
    const {Account,getAccount} = useContext(Profile_Context);
    const HTF = CssFilterConverter.hexToFilter;
    const [SVG_filter,SetSVG_filter] = useState(HTF(themeJSON[THEME].red).color);
    useEffect(()=>{
        SetSVG_filter(HTF(themeJSON[THEME].red).color);
    },[THEME]);
    useEffect(()=>{
        getAccount();
    },[]);
    
    return (
        <Container>
            <div className='Profile'>
                <div className="Profile-TitleBar">
                    <span>{Language["ENG"]["Profile"]["Your Profile"]}</span>
                    <span>{Language["ENG"]["Profile"]["Logout"]} <img src={ILogout} alt={Language["ENG"]["Profile"]["Logout"]} style={{ filter:SVG_filter }} width={"40px"} height={"40px"} /></span>
                </div>
                <div className="Profile-content">
                    <img src={Account.image} alt={Language["ENG"]["Profile"]["Profile Picture"]} width={'160px'} />
                    <div>
                        <span>{Account.fname} {Account.lname}</span>
                        <img src={IPen} alt={Language["ENG"]["Profile"]["Edit First and Last Name"]} width={'20px'} style={{ filter:HTF(themeJSON[THEME].text).color }} />
                    </div>
                    <span>@{Account.username}</span>
                    <div>
                        <button>
                            {Language["ENG"]["Profile"]["Change Email"]}
                        </button>
                        <button>
                            {Language["ENG"]["Profile"]["Change Password"]}
                        </button>
                        <button>
                            {Language["ENG"]["Profile"]["Report bug"]}
                        </button>
                    </div>
                    <div>
                        <button>
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
