import Container from "./Global/Container"
import './Friends.css'
import IMail from '../assets/Mail-Icon.svg';
import IClose from '../assets/Close-Icon.svg';
import APlus from '../assets/Add-Plus.svg';
import { useContext, useEffect, useState } from "react";
import Language from '../Languages.json';
import CssFilterConverter from 'css-filter-converter';
import themeJSON from '../Theme.json';
import { Main_Context } from "../Contexts/MainContext";
import { invoke } from "@tauri-apps/api";
import { ActionBar_Context } from "../Contexts/ActionBarContext";

function AddFriend({friendList,Update}){
  const [AddfriendSearch,setAddfriendSearch] = useState('');
  const HTF = CssFilterConverter.hexToFilter;
  const {LANG,THEME} = useContext(Main_Context);
  function sendRequest(id){
    invoke('send_friend_request',{token:sessionStorage.getItem('token'),id:`${id}`});
    Update();
  }
  return (
  <>
    <div>
      <span>{Language['ENG']["Friends"]['Username']} :</span>
      <input type="text" value={AddfriendSearch} onChange={(e)=>setAddfriendSearch(e.target.value)}/>
    </div>
    <ul className="Friends-List">
    {
          friendList.filter((e)=>e.username.includes(AddfriendSearch)).map((e)=>
            {
              if (!e.isfriend){
              return (
              <li key={e.id}>
                <div>
                  <img src={e.image} alt={e.username} width={'30px'} height={'30px'}/>
                  <div>
                    <span>{e.lname} {e.fname}</span>
                    <span>@{e.username}</span>
                  </div>
                </div>
                <div>
                  <img src={APlus} alt={Language['ENG']["Friends"]['Message'] + ' ' + e.username} width={'30px'} height={'30px'} style={{ filter: HTF(themeJSON[THEME].green).color}} onClick={()=>sendRequest(e.id)} />
                </div>
              </li>
              )
              }
              return 
            }
          )
        }
    </ul>
  </>
  )
}

export default function Friends() {
  const {LANG,THEME} = useContext(Main_Context);
  const {SetActionBar_title,SetActionBar_options,SetActionBar_content,SetActionBar_Active} = useContext(ActionBar_Context);

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
  function Add_Friends(){
    SetActionBar_title(Language['ENG']["Friends"]['Add Friends']);
    SetActionBar_options(<></>);
    SetActionBar_content(
      <AddFriend friendList={friendList} Update={Update}/>
    )
    SetActionBar_Active(1);
  }
  return (
    <Container>
        <div className="Friends">
          <div className="Friends-Titles">
            <h2>{Language['ENG']["Friends"]['Your Friends']}</h2>
            <div>
              <button>{Language['ENG']["Friends"]['Requests']}</button>
              <button onClick={Add_Friends}>{Language['ENG']["Friends"]['Add Friends']}</button>
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
