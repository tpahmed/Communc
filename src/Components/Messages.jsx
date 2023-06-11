import Container from './Global/Container';
import Language from '../Languages.json';
import themeJSON from '../Theme.json';
import ConversationList from './Messages/ConversationList';
import { useContext, useEffect, useRef, useState } from 'react';
import { Messages_Context } from '../Contexts/MessagesContext';
import ConversationMessages from './Messages/ConversationMessages';
import { ActionBar_Context } from '../Contexts/ActionBarContext';
import IImage from '../assets/Image-Icon.svg';
import IBin from '../assets/Bin-Icon.svg';
import MInfo from '../assets/More-Info.svg';
import ILogout from '../assets/Logout-Icon.svg';
import CssFilterConverter from 'css-filter-converter';
import './Messages.css';
import { Main_Context } from '../Contexts/MainContext';
import { invoke } from '@tauri-apps/api';
import axios from 'axios';
import { Profile_Context } from '../Contexts/ProfileContext';

function AddMembersInfo(){
  const [Friends,SetFriends] = useState([]);
  const [members,Setmembers] = useState([]);
  const {selected,Update} = useContext(Messages_Context);
  const {ActionBar_Active,SetActionBar_content,SetActionBar_title} = useContext(ActionBar_Context);
  const {Account} = useContext(Profile_Context);
  const Update_ = async ()=>{
    const response = await invoke('get_friends_add',{token:sessionStorage.getItem('token'),id:`${selected}`});
    SetFriends(JSON.parse(response).msg);
  }
  useEffect(()=>{
    Update_();
  },[]);
  const AddAction = async (e)=>{
    await invoke('add_conversation_participent',{token:sessionStorage.getItem('token'),id:`${selected}`,members:JSON.stringify(members)});
    await Update();
    SetActionBar_content(<ShowGroupInfo/>);
    SetActionBar_title(Language[Account.language]["Messages"]['Group Info']);
  }
  return (
    <div className='Messages-CreateGroupe-AddMembers'>
        <ul>
            {
              Friends.map((e)=>{
                return (
                <li key={e.id} onClick={members.includes(e.id) ? ()=>Setmembers(members.filter((el)=>el !== e.id)) : ()=>Setmembers([...members,e.id])}>
                  <img src={e.image} alt={e.fname + ' ' + e.lname} width={'40px'} height={'40px'} />
                  <span>{e.fname + ' ' + e.lname}</span>
                  <div style={{ backgroundColor:members.includes(e.id) ? 'var(--green)' : 'var(--text)' }}></div>
                </li>
                )
              })
            }
        </ul>
        <div>
          <input type="button" value={Language[Account.language]["Messages"]['Done']} onClick={AddAction}/>
        </div>
    </div>
  )
}

function ShowGroupInfo(){
  const {GroupInfo,selected,Update} = useContext(Messages_Context);
  const {SetActionBar_content,SetActionBar_title} = useContext(ActionBar_Context);
  const {Account} = useContext(Profile_Context);
  const HTF = CssFilterConverter.hexToFilter;
  const [SVG_filter,SetSVG_filter] = useState(HTF(themeJSON[Account.theme].red).color);
  const delete_member = async (id)=>{
    await invoke('delete_conversation_participent',{token:sessionStorage.getItem('token'),id:`${selected}`,memberid:`${id}`});
    await Update();
  };
  return (
    <div className='Messages-GroupeInfo'>

        <div>
          <img src={GroupInfo.image} alt={Language[Account.language]["Messages"]['Group Name']} width={"140px"} height={"140px"} />
          <span>{GroupInfo.name}</span>
        </div>
        <div>{Language[Account.language]["Messages"]['Group Members :']}</div>
        <ul>
            {
              GroupInfo.participents ? GroupInfo.participents.sort((e)=>e.role == 'owner').map((e)=>{
                return (
                <li key={e.id}>
                  <span>{e.fname + ' ' + e.lname} {e.role == 'owner' ? `(${Language[Account.language]["Messages"]['Chef']})` : ''}</span>
                  {
                    GroupInfo.role == 'owner' && e.role != 'owner' ?
                    (<img src={ILogout} alt={Language[Account.language]["Messages"]['Leave Groupe']} onClick={()=>delete_member(e.id)} width={"30px"} height={"30px"} style={{ filter:SVG_filter }} />)
                    :
                    <></>

                  }
                </li>
                )
              }):<></>
            }
        </ul>
{
        GroupInfo.role == 'owner' ?
        (
          <div>
            <input type="button" value={Language[Account.language]["Messages"]['Add Members']} onClick={()=>{SetActionBar_content(<AddMembersInfo/>);SetActionBar_title(Language[Account.language]["Messages"]['Select Friends to Add'])}} />
          </div>
        )
        :
        <></>
}
    </div>
  )
}
function AddMembers(){
  const [Friends,SetFriends] = useState([]);
  const {Group,SetGroup,SetImgPreview} = useContext(Messages_Context);
  const {ActionBar_Active,SetActionBar_content,SetActionBar_title} = useContext(ActionBar_Context);
  const {Account} = useContext(Profile_Context);
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
          <span>{Group.members.length} {Language[Account.language]["Messages"]['Selected']}</span>
          <input type="button" value={Language[Account.language]["Messages"]['Done']} onClick={()=>{SetActionBar_content(<CreateGroupe/>);SetActionBar_title(Language[Account.language]["Messages"]['Create a New Group'])}}/>
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
          <span>{Language[Account.language]["Messages"]['Group Name :']}</span>
          <input type="text" value={Group.name} onChange={(e)=>SetGroup({...Group,name:e.target.value})}/>
        </li>
        <li>
          <span>{Language[Account.language]["Messages"]['Group Image :']}</span>
          <input type="file" ref={imageInput} onChange={handleimage} style={{ display:'none' }}/>
          <img src={ImgPreview ? ImgPreview : IImage} onClick={()=>imageInput.current.click()} alt={Language[Account.language]["Messages"]['Group Image']} style={{ filter:ImgPreview ? null : SVG_filter }} />
        </li>
        <li>
          
          <input type="button" value={Language[Account.language]["Messages"]['Add Members'] + ` (${Group.members.length})`} onClick={()=>{SetActionBar_content(<AddMembers/>);SetActionBar_title(Language[Account.language]["Messages"]['Select Friends to Add'])}} />
        </li>
        <li>
          <input type="button" value={Language[Account.language]["Messages"]['Create']} onClick={Create} />
        </li>
      </ul>
    </>
  );
}

export default function Messages() {
  const {selected,Setselected,GroupInfo} = useContext(Messages_Context);
  const {SetActionBar_title,SetActionBar_options,SetActionBar_content,SetActionBar_Active} = useContext(ActionBar_Context);
  
  const {Account,getAccount} = useContext(Profile_Context);
  const HTF = CssFilterConverter.hexToFilter;
  const [SVG_filter,SetSVG_filter] = useState(HTF(themeJSON[Account.theme].text).color);
  async function DeleteGroup(){
    await invoke('delete_group',{token:sessionStorage.getItem('token'),id:`${selected}`});
    SetActionBar_Active(false);
    Setselected(0);
  }
  async function GroupQuit(){
    await invoke('quit_conversation',{token:sessionStorage.getItem('token'),id:`${selected}`});
    SetActionBar_Active(false);
    Setselected(0);
  }

  function CreateGroupeAction(){
    SetActionBar_title(Language[Account.language]["Messages"]['Create a New Group']);
    SetActionBar_options(null);
    SetActionBar_content(<CreateGroupe/>)
    SetActionBar_Active(true);
  }
  function GetInfo(){
    SetActionBar_title(Language[Account.language]["Messages"]['Group Info']);
    SetActionBar_options(GroupInfo.role == 'owner' ? <img src={IBin} onClick={DeleteGroup} style={{ filter:HTF(themeJSON[Account.theme].red).color }} alt={Language[Account.language]["Messages"]['Delete group']} width={'30px'}/> : <img src={ILogout} onClick={GroupQuit} style={{ filter:HTF(themeJSON[Account.theme].yellow).color }} alt={Language[Account.language]["Messages"]['Leave Groupe']} width={'30px'}/>);
    SetActionBar_content(<ShowGroupInfo/>);
    SetActionBar_Active(true);

  }
  return (
    <Container>
        <div className="Messages">
          <div className="Messages-Titles">
            <h2>{Language[Account.language]["Messages"]['Your Messages']}</h2>
            {
              GroupInfo.type == "group" ? (
                <div className='Messages-Conversation-Info' style={{ cursor:'pointer' }} onClick={GetInfo}>
                  <img src={GroupInfo.image} alt={Language[Account.language]["Messages"]['Groupe Image']} style={{ borderRadius:"100%" }} width={"60px"} height={"60px"}/>
                  <span>{GroupInfo.name}</span>
                  <img src={MInfo} alt={Language[Account.language]["Messages"]['More Info']} width={'25px'} style={{ filter:SVG_filter }}/>
                </div>
              ):(
                <></>
              )
            }
            <div>
                
            </div>
            <div>
              <button onClick={CreateGroupeAction}>{Language[Account.language]["Messages"]['Create Group']}</button>
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
