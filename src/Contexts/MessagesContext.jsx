import { invoke } from "@tauri-apps/api";
import { createContext, useEffect, useState } from "react";

export const Messages_Context = createContext();

export default function MessagesContext({children}) {
    const [selected,Setselected] = useState(0);
    const [RedirectDM,SetRedirectDM] = useState(0);
    const [Conversations,setConversations] = useState([]);
    const [ConversationMessages,setConversationsMessages] = useState([]);
    const [Group,SetGroup] = useState({name:'',image:null,members:[]});
    const [ImgPreview,SetImgPreview] = useState(null);
    
    function Update(){
      invoke('get_conversations',{token:sessionStorage.getItem('token')}).then((e)=>{
        setConversations(JSON.parse(e).msg)
      });
    }
    function LoadMessages(){
      invoke('get_conversation_messages',{token:sessionStorage.getItem('token'),id:`${selected}`}).then((e)=>{
        setConversationsMessages(JSON.parse(e).msg.reverse())
      });
    }
    useEffect(()=>{
      if (selected){
        LoadMessages()
      }
    },[selected]);

  return (
    <Messages_Context.Provider value={{ RedirectDM,SetRedirectDM,selected,Setselected,Conversations,Update,ConversationMessages,LoadMessages,Group,SetGroup,ImgPreview,SetImgPreview }}>
      {children}
    </Messages_Context.Provider>
  )
}
