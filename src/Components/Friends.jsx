import Container from "./Global/Container"
import './Friends.css'
import axios from "axios"
import IMail from '../assets/Mail-Icon.svg';
import IClose from '../assets/Close-Icon.svg';
import { useContext, useEffect, useState } from "react";
import Language from '../Languages.json';
import CssFilterConverter from 'css-filter-converter';
import themeJSON from '../Theme.json';
import { Main_Context } from "../Contexts/MainContext";
import { invoke } from "@tauri-apps/api";

export default function Friends() {
  const {LANG,THEME} = useContext(Main_Context);

  const [friendList,setfriendList] = useState([]);
  const HTF = CssFilterConverter.hexToFilter;
  function delete_Friend(id){
    invoke('delete_Friend',{token:sessionStorage.getItem('token'),id:`${id}`});
    Update();
  }
  useEffect(()=>{
    Update();
  },[]);
  function Update(){
    invoke('get_friends',{token:sessionStorage.getItem('token')}).then((e)=>{
      setfriendList(JSON.parse(e).msg);
    });
  }
  return (
    <Container>
        <div className="Friends">
          <div className="Friends-Titles">
            <h2>{Language['ENG']["Friends"]['Your Friends']}</h2>
            <div>
              <button>{Language['ENG']["Friends"]['Requests']}</button>
              <button>{Language['ENG']["Friends"]['Add Friends']}</button>
            </div>
          </div>
          <ul className="Friends-List">
            {
              friendList.map((e)=>
                {
                  if (e.isfriend){
                  return (
                  <li key={e.id}>
                    <div>
                      <img src={e.image} alt={e.username} width={'30px'} height={'30px'} />
                      <div>
                        <span>{e.lname} {e.fname}</span>
                        <span>@{e.username}</span>
                      </div>
                    </div>
                    <div>
                      <img src={IMail} alt={Language['ENG']["Friends"]['Message'] + ' ' + e.username} width={'30px'} height={'30px'} style={{ filter: HTF(themeJSON[THEME].text).color}} />
                      <img src={IClose} alt={Language['ENG']["Friends"]['Delete friend'] + ' ' + e.username} width={'30px'} height={'30px'} style={{ filter: HTF(themeJSON[THEME].red).color}} onClick={()=>delete_Friend(e.id)} />
                    </div>
                  </li>
                  )
                  }
                  return 
                }
              )
            }
          </ul>
        </div>
    </Container>
  )
}
