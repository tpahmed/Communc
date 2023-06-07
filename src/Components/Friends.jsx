import Container from "./Global/Container"
import './Friends.css'
import IMail from '../assets/Mail-Icon.svg';
import IClose from '../assets/Close-Icon.svg';
import IYes from '../assets/Yes-Icon.svg';
import APlus from '../assets/Add-Plus.svg';
import CSearch from '../assets/Search-Cross.svg';
import { useContext, useEffect, useState } from "react";
import Language from '../Languages.json';
import CssFilterConverter from 'css-filter-converter';
import themeJSON from '../Theme.json';
import { Main_Context } from "../Contexts/MainContext";
import { invoke } from "@tauri-apps/api";
import { ActionBar_Context } from "../Contexts/ActionBarContext";
import { Friends_Context } from "../Contexts/FriendsContext";
import { Messages_Context } from "../Contexts/MessagesContext";
import { useNavigate } from "react-router-dom";
import { Profile_Context } from "../Contexts/ProfileContext";

function AddFriend(){
  const [AddfriendSearch,setAddfriendSearch] = useState('');
  const {friendList,Update} = useContext(Friends_Context);
  const HTF = CssFilterConverter.hexToFilter;
  const {LANG,THEME} = useContext(Main_Context);
  const { Account } = useContext(Profile_Context);
  function sendRequest(id){
    invoke('send_friend_request',{token:sessionStorage.getItem('token'),id:`${id}`});
    Update();
  }
  
  function cancelRequest(id){
    invoke('friend_request_action',{token:sessionStorage.getItem('token'),id:`${id}`,action:'cancel'});
    Update();
  }
  
  
  return (
  <>
    <div>
      <span>{Language['ENG']["Friends"]['Username']} :</span>
      <input className="Friends-Search" type="text" value={AddfriendSearch} onChange={(e)=>setAddfriendSearch(e.target.value)}/>
    </div>
    <ul className="Friends-List">
    {
      
          friendList.filter((e)=>e.username.toLowerCase().includes(AddfriendSearch.toLowerCase())).length ? 
          friendList.sort((e)=>e.friend_requested ? -1 : 1).filter((e)=>e.username.includes(AddfriendSearch)).map((e)=>
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
                  {
                    e.friend_requested ? (
                        <img src={IClose} alt={Language['ENG']["Friends"]["Cancel friend request"]} width={'30px'} height={'30px'} style={{ filter: HTF(themeJSON[Account.theme].red).color}} onClick={()=>cancelRequest(e.id)} />
                    )
                    :
                    (
                      <img src={APlus} alt={Language['ENG']["Friends"]["Send friend request"]} width={'30px'} height={'30px'} style={{ filter: HTF(themeJSON[Account.theme].green).color}} onClick={()=>sendRequest(e.id)} />
                    )
                  }
                </div>
              </li>
              )
              }
              return 
            }
          )
          :
          <h3>{Language['ENG']["Friends"]["User Not Found :("]} <img src={CSearch} alt={Language['ENG']["Friends"]["User Not Found :("]} width={'60%'} style={{ filter: HTF(themeJSON[Account.theme].text).color}} /> </h3>
        }
    </ul>
  </>
  )
}

function FriendRequests(){
  const {requestsList,Update} = useContext(Friends_Context);
  const HTF = CssFilterConverter.hexToFilter;
  const {LANG,THEME} = useContext(Main_Context);
  const { Account } = useContext(Profile_Context);
  
  function declineRequest(id){
    invoke('friend_request_action',{token:sessionStorage.getItem('token'),id:`${id}`,action:'decline'});
    Update();
  }
  
  function acceptRequest(id){
    invoke('friend_request_action',{token:sessionStorage.getItem('token'),id:`${id}`,action:'accept'});
    Update();
  }
  
  
  return (
  <>
    <ul className="Friends-List">
    {
          requestsList.length ? 
          requestsList.map((e)=>
            {
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
                  <img src={IClose} alt={Language['ENG']["Friends"]["Decline friend request"]} width={'30px'} height={'30px'} style={{ filter: HTF(themeJSON[Account.theme].red).color}} onClick={()=>declineRequest(e.id)} />
                  <img src={IYes} alt={Language['ENG']["Friends"]["Accept friend request"]} width={'30px'} height={'30px'} style={{ filter: HTF(themeJSON[Account.theme].green).color}} onClick={()=>acceptRequest(e.id)} />
                </div>
              </li>
              )
            }
          )
          :
          <h3>{Language['ENG']["Friends"]["No Friend Request Recieved"]}</h3>
        }
    </ul>
  </>
  )
}

export default function Friends() {
  const {LANG,THEME} = useContext(Main_Context);
  const { Account } = useContext(Profile_Context);

  const {SetRedirectDM} = useContext(Messages_Context);
  const {friendList,Update,requestsList} = useContext(Friends_Context);
  const {SetActionBar_title,SetActionBar_options,SetActionBar_content,SetActionBar_Active} = useContext(ActionBar_Context);
  
  const Navigator = useNavigate();
  const HTF = CssFilterConverter.hexToFilter;
  function delete_Friend(id){
    invoke('delete_Friend',{token:sessionStorage.getItem('token'),id:`${id}`});
    Update();
  }
  useEffect(()=>{
    Update();
  },[]);
  function Add_Friends(){
    SetActionBar_title(Language['ENG']["Friends"]['Add a new Friend']);
    SetActionBar_options(<></>);
    SetActionBar_content(
      <AddFriend/>
    )
    SetActionBar_Active(1);
  }
  function Friend_requests(){
    SetActionBar_title(Language['ENG']["Friends"]['Incoming Requests']);
    SetActionBar_options(<></>);
    SetActionBar_content(
      <FriendRequests/>
    )
    SetActionBar_Active(1);
  }
  function Message_Friend(id){
    Navigator('/messages');
    SetRedirectDM(id);
  }
  return (
    <Container>
        <div className="Friends">
          <div className="Friends-Titles">
            <h2>{Language['ENG']["Friends"]['Your Friends']}</h2>
            <div>
              <button onClick={Friend_requests}>{Language['ENG']["Friends"]['Requests']} {requestsList.length ? <div className="Friends-Notification"><span>{requestsList.length}</span></div> : <></>}</button>
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
                      <img src={IMail} alt={Language['ENG']["Friends"]['Message'] + ' ' + e.username} width={'30px'} height={'30px'} style={{ filter: HTF(themeJSON[Account.theme].text).color}} onClick={()=>Message_Friend(e.id)} />
                      <img src={IClose} alt={Language['ENG']["Friends"]['Delete friend'] + ' ' + e.username} width={'30px'} height={'30px'} style={{ filter: HTF(themeJSON[Account.theme].red).color}} onClick={()=>delete_Friend(e.id)} />

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
