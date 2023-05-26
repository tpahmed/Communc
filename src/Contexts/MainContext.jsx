import { createContext, useState } from "react";

export const Main_Context = createContext();

export default function MainContext({children}) {
    const [LANG,SetLANG] = useState('ENG');
    const [THEME,SetTHEME] = useState('Gruvbox Dark');
    const [SideBarActive,SetSideBarActive] = useState(false);
    const [Search,SetSearch] = useState('');

  return (
    <Main_Context.Provider value={{ LANG,SetLANG,THEME,SetTHEME,SideBarActive,SetSideBarActive,Search,SetSearch }}>
      {children}
    </Main_Context.Provider>
  )
}
