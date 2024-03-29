import { useContext } from 'react'
import './ActionBar.css'
import { ActionBar_Context } from '../../Contexts/ActionBarContext'
import LArrow from '../../assets/Left-Arrow.svg'
import Languages from '../../Languages.json'
import themeJSON from '../../Theme.json'
import { Main_Context } from '../../Contexts/MainContext'
import CssFilterConverter from 'css-filter-converter'
import { Profile_Context } from '../../Contexts/ProfileContext'


export default function ActionBar() {
  const {ActionBar_Active,SetActionBar_Active,ActionBar_title,ActionBar_options,ActionBar_content} = useContext(ActionBar_Context);
  const {Account} = useContext(Profile_Context);
  const HTF = CssFilterConverter.hexToFilter;
  return (
    <div className={`ActionBar ${ActionBar_Active ? 'ActionBar-Active' : ''}`}>
        <div className="ActionBar-Title">
            <h3><img src={LArrow} alt={Languages[Account.language]['ActionBar']['Close']} width={'30px'} style={{ filter:HTF(themeJSON[Account.theme].text).color }} onClick={()=>SetActionBar_Active(0)} />{ActionBar_title}</h3>
            <div>
              {ActionBar_options}
            </div>
        </div>
        <div className="ActionBar-Content">
          {ActionBar_content}
        </div>
    </div>
  )
}
