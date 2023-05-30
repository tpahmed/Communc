import { Main_Context } from '../../Contexts/MainContext';
import CssFilterConverter from 'css-filter-converter';
import {ReactComponent as HMenu} from '../../assets/Haburger-Menu.svg';
import IClose from '../../assets/Close-Icon.svg';
import IMaximize from '../../assets/Maximize-Icon.svg';
import IMinimize from '../../assets/Minimize-Icon.svg';
import { useContext, useEffect, useState } from 'react';
import { appWindow } from "@tauri-apps/api/window";
import Language from '../../Languages.json';
import themeJSON from '../../Theme.json';

import './NavBar.css';
import { useLocation } from 'react-router-dom';
import { Messages_Context } from '../../Contexts/MessagesContext';

export default function NavBar() {
    const {LANG,THEME,Search,SetSearch} = useContext(Main_Context);
    const {selected,LoadMessages} = useContext(Messages_Context);
    const HTF = CssFilterConverter.hexToFilter;
    const location = useLocation();
    
    const [SVG_filter,SetSVG_filter] = useState(HTF(themeJSON[THEME].text).color);
    const [SearchPH,SetSearchPH] = useState('');
    useEffect(()=>{
        SetSVG_filter(HTF(themeJSON[THEME].text).color);
        const TitleBarOPTS = document.querySelectorAll('.NavBar > div:last-of-type > div');

        TitleBarOPTS[0].addEventListener('mouseenter',(e)=>{
            e.preventDefault();
            document.getElementById('NavBar-Minimize').style.filter = HTF(themeJSON[THEME].yellow).color +  ' drop-shadow(1px 1px 2px var(--yellow))'
        });
        TitleBarOPTS[0].addEventListener('mouseleave',(e)=>{e.preventDefault();document.getElementById('NavBar-Minimize').style.filter = SVG_filter});
        TitleBarOPTS[1].addEventListener('mouseenter',(e)=>{e.preventDefault();document.getElementById('NavBar-Maximize').style.filter = HTF(themeJSON[THEME].green).color +  ' drop-shadow(1px 1px 2px var(--green))'});
        TitleBarOPTS[1].addEventListener('mouseleave',(e)=>{e.preventDefault();document.getElementById('NavBar-Maximize').style.filter = SVG_filter});
        TitleBarOPTS[2].addEventListener('mouseenter',(e)=>{e.preventDefault();document.getElementById('NavBar-Close').style.filter = HTF(themeJSON[THEME].red).color +  ' drop-shadow(1px 1px 2px var(--red))'});
        TitleBarOPTS[2].addEventListener('mouseleave',(e)=>{e.preventDefault();document.getElementById('NavBar-Close').style.filter = SVG_filter});
        window.addEventListener('resize',()=>appWindow.isMaximized().then((val)=>document.querySelector('.NavBar').style.borderRadius = val ? '0' : '.4em .4em 0 0'))
    },[THEME]);
    useEffect(()=>{
        if(['/login','/signup','/forgot'].includes(location.pathname) || /\/forgot\/./.test(location.pathname)){
            document.querySelectorAll('.NavBar > div:not(:last-of-type)').forEach((e)=>e.style.marginTop = '-25%');
        }
        else{
            document.querySelectorAll('.NavBar > div:not(:last-of-type)').forEach((e)=>e.style.marginTop = null);
            
        }
        SetSearchPH(Language['ENG']['NavBar']['Search in '+location.pathname.split('/')[1]])
        if (location.pathname == '/messages'){
            connectWS()
        }
    },[location.pathname]);
    function connectWS(){
        const ws = new WebSocket('ws://localhost:4055/messages');
            ws.onmessage = (msg)=>{
                console.log(msg.data)
                if (JSON.parse(msg.data).type == 'refresh' && JSON.parse(msg.data).data == selected){
                    LoadMessages();
                }
            }
            ws.onclose = ()=>{
                setTimeout(()=>{
                    connectWS();
                  }, 1000);
            }
    }
  return (
    <nav data-tauri-drag-region className="NavBar">
        <div>
        </div>
        <div>
            <div>
                <input type="text" spellCheck="false" autoCorrect='false' autoComplete='false' value={Search} onChange={(e)=>SetSearch(e.target.value)} placeholder={SearchPH} />
            </div>
        </div>
        
        <div>
            <div onClick={()=>appWindow.minimize()}>
                <img id='NavBar-Minimize' src={IMinimize} alt={Language['ENG'].NavBar['Minimize']} onClick={()=>appWindow.minimize()} style={{ 'filter':SVG_filter }} width={'20px'}/>
            </div>
            <div onClick={()=>appWindow.toggleMaximize()}>
                <img id='NavBar-Maximize' src={IMaximize} alt={Language['ENG'].NavBar['Maximize']} style={{ 'filter':SVG_filter }} width={'20px'}/>
            </div>
            <div onClick={()=>appWindow.close()}>
                <img id='NavBar-Close' src={IClose} alt={Language['ENG'].NavBar['Close']} style={{ 'filter':SVG_filter }} width={'20px'}/>
            </div>
        </div>
    </nav>
  )
}
