import NBell from '../../assets/Notification-Bell.svg';
import { Main_Context } from '../../Contexts/MainContext';

import DAccount from '../../assets/Account-Demo.svg';
import MBuble from '../../assets/Message-Buble.svg';
import CssFilterConverter from 'css-filter-converter';
import PCube from '../../assets/Project-Cube.svg';
import Language from '../../Languages.json';
import themeJSON from '../../Theme.json';
import './SideBar.css';
import { useContext, useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function SideBar() {
  const {LANG,THEME,SideBarActive} = useContext(Main_Context);
  const location = useLocation();
  const HTF = CssFilterConverter.hexToFilter;
  const [SVG_filter] = useState(HTF(themeJSON[THEME].text).color);
  const Navigator = useNavigate();
  useEffect(()=>{
    const TitleBarOPTS = document.querySelectorAll('.SideBar > div');
    TitleBarOPTS.forEach((el)=>{
      el.addEventListener('mouseenter',(e)=>el.querySelector('img').style.filter = HTF(themeJSON[THEME]["container-background"]).color);
      el.addEventListener('mouseleave',(e)=>el.querySelector('img').style.filter = HTF(themeJSON[THEME].text).color);
    })
  },[]);
  useEffect(()=>{
    if(['/login','/signup','/forgot'].includes(location.pathname) || /\/forgot\/./.test(location.pathname)){
    if(['/login','/signUp'].includes(location.pathname)){
        document.querySelectorAll('.SideBar').forEach((e)=>e.style.marginLeft = '-25%');
    }
    else{
        document.querySelectorAll('.SideBar').forEach((e)=>e.style.marginLeft = null);
    }
  }
},[location.pathname]);
  return (
    <div className="SideBar" style={SideBarActive ? { "left":"1em" } : null}>
      <div>
          <img src={PCube} alt={Language[LANG].SideBar['Projects']} style={{ 'filter':SVG_filter }}/>
      </div>
      <div>
          <img src={MBuble} alt={Language[LANG].SideBar['Messages']} style={{ 'filter':SVG_filter }}/>
      </div>
      <div>
          <img src={NBell} alt={Language[LANG].SideBar['Notifications']} style={{ 'filter':SVG_filter }} onClick={()=>Navigator('/')}/>
      </div>
      <div onClick={()=>Navigator('/login')}>
          <img src={DAccount} alt={Language[LANG].SideBar['Account']} style={{ 'filter':SVG_filter }}/>
      </div>
    </div>
  )
}
