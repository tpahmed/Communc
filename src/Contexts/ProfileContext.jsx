import { invoke } from "@tauri-apps/api";
import { createContext, useEffect, useState } from "react";

export const Profile_Context = createContext();

export default function ProfileContext({children}) {
  const [Account,SetAccount] = useState({old_pass:'',new_pass:'',theme:'Dark',language:'ENG'});
  async function getAccount(){
      const result = await invoke("get_profile",{token:sessionStorage.getItem('token')});
      if(!JSON.parse(result).msg){
        return SetAccount({});
      }
      SetAccount({...Account,...JSON.parse(result).msg[0]});
    }
  async function CommitChanges(){
    const result = await invoke("edit_profile",{token:sessionStorage.getItem('token'),account:JSON.stringify(Account)});
    if (!JSON.parse(result).success){
      return JSON.parse(result).msg;
    }
    await getAccount();
    return '';
  }
  return (
    <Profile_Context.Provider value={{ Account,SetAccount,getAccount,CommitChanges }}>
      {children}
    </Profile_Context.Provider>
  )
}
