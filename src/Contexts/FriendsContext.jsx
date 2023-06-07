import { invoke } from "@tauri-apps/api";
import { createContext, useState } from "react";

export const Friends_Context = createContext();

export default function FriendsContext({children}) {
  const [friendList,setfriendList] = useState([]);
  const [requestsList,setrequestsList] = useState([]);
    
  function Update(){
    invoke('get_friends',{token:sessionStorage.getItem('token')}).then((e)=>{
      if(!JSON.parse(e).msg){
        return setfriendList([]);
      }
      setfriendList(JSON.parse(e).msg);
    });
    invoke('get_friend_requests',{token:sessionStorage.getItem('token')}).then((e)=>{
      if(!JSON.parse(e).msg){
        return setrequestsList([]);
      }
      setrequestsList(JSON.parse(e).msg);
    });
  }
  return (
    <Friends_Context.Provider value={{ friendList,setfriendList,Update,requestsList,setrequestsList }}>
      {children}
    </Friends_Context.Provider>
  )
}
