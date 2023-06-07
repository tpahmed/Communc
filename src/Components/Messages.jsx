import Container from './Global/Container';
import Language from '../Languages.json';
import themeJSON from '../Theme.json';
import ConversationList from './Messages/ConversationList';
import { useContext, useEffect, useRef, useState } from 'react';
import { Messages_Context } from '../Contexts/MessagesContext';
import ConversationMessages from './Messages/ConversationMessages';
import { ActionBar_Context } from '../Contexts/ActionBarContext';
import IImage from '../assets/Image-Icon.svg';
import CssFilterConverter from 'css-filter-converter';
import './Messages.css';
import { Main_Context } from '../Contexts/MainContext';
import { invoke } from '@tauri-apps/api';
import axios from 'axios';
import { Profile_Context } from '../Contexts/ProfileContext';


function AddMembers(){
  const [Friends,SetFriends] = useState([]);
  const {Group,SetGroup,SetImgPreview} = useContext(Messages_Context);
  const {ActionBar_Active,SetActionBar_content,SetActionBar_title} = useContext(ActionBar_Context);

  const Update = async ()=>{
    const response = await invoke('get_friends',{token:sessionStorage.getItem('token')});
    SetFriends(JSON.parse(response).msg);
  }
  useEffect(()=>{
    Update();
  },[]);
  useEffect(()=>{
    if(!ActionBar_Active){
      SetGroup({name:'',image:null,members:[]});
      SetImgPreview(null);
    }
  },[ActionBar_Active]);
  const AddAction = (e)=>{
    if (Group.members.includes(e.id)){
      SetGroup({...Group,members:Group.members.filter((el)=>el!=e.id)});
      return;
    }
    SetGroup({...Group,members:[...Group.members,e.id]});
  }
  return (
    <div className='Messages-CreateGroupe-AddMembers'>
        <ul>
            {
              Friends.filter((e)=>e.isfriend).map((e)=>{
                return (
                <li key={e.id} onClick={()=>AddAction(e)}>
                  <img src={e.image} alt={e.fname + ' ' + e.lname} width={'40px'} height={'40px'} />
                  <span>{e.fname + ' ' + e.lname}</span>
                  <div style={{ backgroundColor:Group.members.includes(e.id) ? 'var(--green)' : 'var(--text)' }}></div>
                </li>
                )
              })
            }
        </ul>
        <div>
          <span>{Group.members.length} {Language['ENG']["Messages"]['Selected']}</span>
          <input type="button" value={Language['ENG']["Messages"]['Done']} onClick={()=>{SetActionBar_content(<CreateGroupe/>);SetActionBar_title(Language['ENG']["Messages"]['Create a New Group'])}}/>
        </div>
    </div>
  )
}

function CreateGroupe(){
  
  const {Group,SetGroup,ImgPreview,SetImgPreview,Update} = useContext(Messages_Context);
  const {ActionBar_Active,SetActionBar_content,SetActionBar_Active,SetActionBar_title} = useContext(ActionBar_Context);
  const {THEME} = useContext(Main_Context);
  const { Account } = useContext(Profile_Context);

  const imageInput = useRef(null);
  const HTF = CssFilterConverter.hexToFilter;
  useEffect(()=>{
    if(!ActionBar_Active){
      SetGroup({name:'',image:null,members:[]});
      SetImgPreview(null);
    }
  },[ActionBar_Active]);
    
    const [SVG_filter,SetSVG_filter] = useState(HTF(themeJSON[Account.theme].background).color);
    const [SearchPH,SetSearchPH] = useState('');
    useEffect(()=>{
        SetSVG_filter(HTF(themeJSON[Account.theme].text).color);
    },[Account.theme]);
  
  const handleimage = (e)=>{
    if (e.target.files[0] && /image\/./.test(e.target.files[0].type)){
      SetGroup({...Group,image:e.target.files[0]});
      const imageUrl = URL.createObjectURL(e.target.files[0]);
      SetImgPreview(imageUrl);
    }
  }
  
  async function Create(){
    const form = new FormData();
    form.append('token',sessionStorage.getItem('token'));  
    form.append('name',Group.name);  
    form.append('image',Group.image);  
    form.append('members',JSON.stringify(Group.members));
    await axios.post('//localhost:4055/group/create',form);
    Update();
    SetActionBar_Active(false);
  }


  return (
    <>
      <ul className='Messages-CreateGroupe'>
        <li>
          <span>{Language['ENG']["Messages"]['Group Name :']}</span>
          <input type="text" value={Group.name} onChange={(e)=>SetGroup({...Group,name:e.target.value})}/>
        </li>
        <li>
          <span>{Language['ENG']["Messages"]['Group Image :']}</span>
          <input type="file" ref={imageInput} onChange={handleimage} style={{ display:'none' }}/>
          <img src={ImgPreview ? ImgPreview : IImage} onClick={()=>imageInput.current.click()} alt={Language['ENG']["Messages"]['Group Image']} style={{ filter:ImgPreview ? null : SVG_filter }} />
        </li>
        <li>
          
          <input type="button" value={Language['ENG']["Messages"]['Add Members'] + ` (${Group.members.length})`} onClick={()=>{SetActionBar_content(<AddMembers/>);SetActionBar_title(Language['ENG']["Messages"]['Select Friends to Add'])}} />
        </li>
        <li>
          <input type="button" value={Language['ENG']["Messages"]['Create']} onClick={Create} />
        </li>
      </ul>
    </>
  );
}

export default function Messages() {
  const {selected,Setselected} = useContext(Messages_Context);
  const {SetActionBar_title,SetActionBar_options,SetActionBar_content,SetActionBar_Active} = useContext(ActionBar_Context);
  function CreateGroupeAction(){
    SetActionBar_title(Language['ENG']["Messages"]['Create a New Group']);
    SetActionBar_options(null);
    SetActionBar_content(<CreateGroupe/>)
    SetActionBar_Active(true);
  }
  return (
    <Container>
        <div className="Messages">
          <div className="Messages-Titles">
            <h2>{Language['ENG']["Messages"]['Your Messages']}</h2>
            <div>
                
            </div>
            <div>
              <button onClick={CreateGroupeAction}>{Language['ENG']["Messages"]['Create Group']}</button>
            </div>
          </div>
          <div className="Messages-Content">
            <ConversationList/>
            <div className="Messages-Separator"></div>
            {
              selected ? <ConversationMessages/> : <div className='ConversationMessages'></div>
            }
          </div>
        </div>
    </Container>
  )
}
