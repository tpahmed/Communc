import { invoke } from "@tauri-apps/api";
import { createContext, useState } from "react";

export const Profile_Context = createContext();

export default function ProfileContext({children}) {
    const [Account,SetAccount] = useState({});
    async function getAccount(){
        const result = await invoke("get_profile",{token:sessionStorage.getItem('token')});
        if(!JSON.parse(result).msg){
            return SetAccount({});
        }
        SetAccount(JSON.parse(result).msg[0]);
    }

  return (
    <Profile_Context.Provider value={{ Account,SetAccount,getAccount }}>
      {children}
    </Profile_Context.Provider>
  )
}
