import IFriends from '../../assets/Friends-Icon.svg';
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
import { ActionBar_Context } from '../../Contexts/ActionBarContext';
import { Profile_Context } from '../../Contexts/ProfileContext';

export default function SideBar() {
  const {LANG,THEME} = useContext(Main_Context);
  const {Account} = useContext(Profile_Context);
  const {SetActionBar_Active} = useContext(ActionBar_Context);
  const location = useLocation();
  const HTF = CssFilterConverter.hexToFilter;
  const [SVG_filter,SetSVG_filter] = useState(HTF(themeJSON[Account.theme].text).color);
  const Navigator = useNavigate();
  useEffect(()=>{
    const TitleBarOPTS = document.querySelectorAll('.SideBar > div:not(:last-of-type)');
    TitleBarOPTS.forEach((el)=>{
      
      el.addEventListener('mouseenter',(e)=>{e.preventDefault();el.querySelector('img').style.filter = HTF(themeJSON[Account.theme]["container-background"]).color});
      el.addEventListener('mouseleave',(e)=>{e.preventDefault();el.querySelector('img').style.filter = HTF(themeJSON[Account.theme].text).color});
    })
  },[]);
  useEffect(()=>{
    if(['/login','/signup','/forgot'].includes(location.pathname) || /\/forgot\/./.test(location.pathname)){
        document.querySelectorAll('.SideBarContainer').forEach((e)=>e.style.marginLeft = '-25%');
    }
    else{
        document.querySelectorAll('.SideBarContainer').forEach((e)=>e.style.marginLeft = null);
    }
    SetActionBar_Active(0);
  },[location.pathname]);

  useEffect(()=>{
    if(Account.theme){
      SetSVG_filter(HTF(themeJSON[Account.theme].text).color);
    }
    const TitleBarOPTS = document.querySelectorAll('.SideBar > div:not(:last-of-type)');
    TitleBarOPTS.forEach((el)=>{
      
      el.addEventListener('mouseenter',(e)=>{e.preventDefault();el.querySelector('img').style.filter = HTF(themeJSON[Account.theme]["container-background"]).color});
      el.addEventListener('mouseleave',(e)=>{e.preventDefault();el.querySelector('img').style.filter = HTF(themeJSON[Account.theme].text).color});
    })
  },[Account.theme]);
  return (
    <div className="SideBarContainer">
      <div className="SideBar">

        <div onClick={()=>Navigator('/communities')}>
          <div>
                <img src={PCube} alt={Language[LANG]['SideBar']['Communities']} style={{ 'filter':SVG_filter }}/>
          </div>
          <div>
            {Language[LANG]['SideBar']['Communities']}
          </div>
        </div>
        <div>
          <div onClick={()=>Navigator('/messages')}>
              <img src={MBuble} alt={Language[LANG]['SideBar']['Messages']} style={{ 'filter':SVG_filter }}/>
          </div>
          <div>
            {Language[LANG]['SideBar']['Messages']}
          </div>
        </div>
        <div>
          <div onClick={()=>Navigator('/friends')}>
              <img src={IFriends} alt={Language[LANG]['SideBar']['Friends']} style={{ 'filter':SVG_filter }} />
          </div>
          <div>
            {Language[LANG]['SideBar']['Friends']}
          </div>
        </div>
        <div>
          <div onClick={()=>Navigator('/profile')}>
              <img src={Account.image ? Account.image : DAccount} alt={Language[LANG]['SideBar']['Profile']} />
          </div>
          <div>
            {Language[LANG]['SideBar']['Profile']}
          </div>
        </div>
      </div>
    </div>
  )
}
