import { createContext, useState } from "react";

export const Main_Context = createContext();

export default function MainContext({children}) {
    const [LANG,SetLANG] = useState('ENG');
    const [THEME,SetTHEME] = useState('Dark');
    const [SideBarActive,SetSideBarActive] = useState(false);
  return (
    <Main_Context.Provider value={{ LANG,SetLANG,THEME,SetTHEME,SideBarActive,SetSideBarActive }}>{children}</Main_Context.Provider>
  )
}
