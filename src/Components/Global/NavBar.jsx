import { Main_Context } from '../../Contexts/MainContext';
import CssFilterConverter from 'css-filter-converter';
import {ReactComponent as HMenu} from '../../assets/Haburger-Menu.svg';
import IClose from '../../assets/Close-Icon.svg';
import IMaximize from '../../assets/Maximize-Icon.svg';
import IMinimize from '../../assets/Minimize-Icon.svg';
import { useContext, useEffect, useRef, useState } from 'react';
import { appWindow } from "@tauri-apps/api/window";
import Language from '../../Languages.json';
import themeJSON from '../../Theme.json';

import './NavBar.css';
import { useLocation } from 'react-router-dom';
import { Profile_Context } from '../../Contexts/ProfileContext';

export default function NavBar() {
    const {Search,SetSearch} = useContext(Main_Context);
    const { Account,getAccount } = useContext(Profile_Context);
    const NavBarRef = useRef(null);
    const NavBarButtonsRef = useRef([]);
    const TitleBarOPTS = useRef([]);
    const location = useLocation();
    const HTF = CssFilterConverter.hexToFilter;
    
    const [SVG_filter,SetSVG_filter] = useState(HTF(themeJSON['Dark'].text).color);
    const [SearchPH,SetSearchPH] = useState('');
    useEffect(()=>{
        if(Account.theme){
            SetSVG_filter(HTF(themeJSON[Account.theme].text).color);
        }

        TitleBarOPTS.current[0].onmouseenter = (e)=>{
            NavBarButtonsRef.current[0].style.filter = HTF(themeJSON[Account.theme].yellow).color +  ' drop-shadow(1px 1px 2px var(--yellow))'
        };
        TitleBarOPTS.current[0].onmouseleave = (e)=>{
            NavBarButtonsRef.current[0].style.filter = HTF(themeJSON[Account.theme].text).color
        };
        TitleBarOPTS.current[1].onmouseenter = (e)=>{
            NavBarButtonsRef.current[1].style.filter = HTF(themeJSON[Account.theme].green).color +  ' drop-shadow(1px 1px 2px var(--green))'
        };
    
        TitleBarOPTS.current[1].onmouseleave = (e)=>{NavBarButtonsRef.current[1].style.filter = HTF(themeJSON[Account.theme].text).color};
        TitleBarOPTS.current[2].onmouseenter = (e)=>{NavBarButtonsRef.current[2].style.filter = HTF(themeJSON[Account.theme].red).color +  ' drop-shadow(1px 1px 2px var(--red))'};
        TitleBarOPTS.current[2].onmouseleave = (e)=>{NavBarButtonsRef.current[2].style.filter = HTF(themeJSON[Account.theme].text).color};
        window.addEventListener('resize',()=>appWindow.isMaximized().then((val)=>NavBarRef.current.style.borderRadius = val ? '0' : '.4em .4em 0 0'))
    },[Account.theme]);
    useEffect(()=>{
        if(['/login','/signup','/forgot','/profile'].includes(location.pathname) || /\/forgot\/./.test(location.pathname)){
            document.querySelectorAll('.NavBar > div:not(:last-of-type)').forEach((e)=>e.style.marginTop = '-25%');
        }
        else{
            getAccount();
            document.querySelectorAll('.NavBar > div:not(:last-of-type)').forEach((e)=>e.style.marginTop = null);
            
        }
        SetSearchPH(Language[Account.language]['NavBar']['Search in '+location.pathname.split('/')[1]])
    },[location.pathname]);
   
  return (
    <nav data-tauri-drag-region className="NavBar" ref={NavBarRef}>
        <div>
        </div>
        <div>
            <div>
                <input type="text" spellCheck="false" autoCorrect='false' autoComplete='false' value={Search} onChange={(e)=>SetSearch(e.target.value)} placeholder={SearchPH} />
            </div>
        </div>
        
        <div>
            <div onClick={()=>appWindow.minimize()} ref={(e)=>TitleBarOPTS.current[0] = e}>
                <img id='NavBar-Minimize' src={IMinimize} ref={(e)=>NavBarButtonsRef.current[0] = e} alt={Language[Account.language].NavBar['Minimize']} onClick={()=>appWindow.minimize()} style={{ 'filter':SVG_filter }} width={'20px'}/>
            </div>
            <div onClick={()=>appWindow.toggleMaximize()} ref={(e)=>TitleBarOPTS.current[1] = e}>
                <img id='NavBar-Maximize' src={IMaximize} ref={(e)=>NavBarButtonsRef.current[1] = e} alt={Language[Account.language].NavBar['Maximize']} style={{ 'filter':SVG_filter }} width={'20px'}/>
            </div>
            <div onClick={()=>appWindow.close()} ref={(e)=>TitleBarOPTS.current[2] = e}>
                <img id='NavBar-Close' src={IClose} ref={(e)=>NavBarButtonsRef.current[2] = e} alt={Language[Account.language].NavBar['Close']} style={{ 'filter':SVG_filter }} width={'20px'}/>
            </div>
        </div>
    </nav>
  )
}
