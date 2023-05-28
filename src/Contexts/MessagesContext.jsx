import { invoke } from "@tauri-apps/api";
import { createContext, useEffect, useState } from "react";

export const Messages_Context = createContext();

export default function MessagesContext({children}) {
    const [selected,Setselected] = useState(0);
    const [Conversations,setConversations] = useState([]);
    const [ConversationMessages,setConversationsMessages] = useState([]);
    function Update(){
      invoke('get_conversations',{token:sessionStorage.getItem('token')}).then((e)=>{
        setConversations(JSON.parse(e).msg)
      });
    }
    function LoadMessages(){
      invoke('get_conversation_messages',{token:sessionStorage.getItem('token'),id:`${selected}`}).then((e)=>{
        setConversationsMessages(JSON.parse(e).msg)
      });
    }
    useEffect(()=>{
      if (selected){
        LoadMessages()
      }
    },[selected]);

  return (
    <Messages_Context.Provider value={{ selected,Setselected,Conversations,Update,ConversationMessages }}>
      {children}
    </Messages_Context.Provider>
  )
}
