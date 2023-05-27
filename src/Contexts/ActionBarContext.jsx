import { createContext, useState } from "react";


export const ActionBar_Context = createContext();


export default function ActionBarContext({children}) {
  const [ActionBar_Active,SetActionBar_Active] = useState(0);
  const [ActionBar_title,SetActionBar_title] = useState('');
  const [ActionBar_options,SetActionBar_options] = useState(<></>);
  const [ActionBar_content,SetActionBar_content] = useState(<></>);

    return (
    <ActionBar_Context.Provider value={{ ActionBar_Active,SetActionBar_Active,ActionBar_title,SetActionBar_title,ActionBar_options,SetActionBar_options,ActionBar_content,SetActionBar_content }}>{children}</ActionBar_Context.Provider>
  )
}
