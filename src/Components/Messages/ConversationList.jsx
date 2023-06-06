import { Main_Context } from '../../Contexts/MainContext';
import { Messages_Context } from '../../Contexts/MessagesContext';
import './ConversationList.css'
import { useContext, useEffect, useState } from 'react';

export default function ConversationList() {
  const {Update,Conversations,Setselected,selected,RedirectDM,SetRedirectDM} = useContext(Messages_Context);
  const {Search} = useContext(Main_Context);
  useEffect(()=>{
    Update();
  },[]);
  useEffect(()=>{
    if(RedirectDM){
      Setselected(Conversations.filter((e)=>e.acc_id == RedirectDM)[0].id)
    }
  },[]);
  useEffect(()=>{
    Update();
    SetRedirectDM(0);
  },[selected]);
  return (
    <ul className='ConversationList'>
        {
          Conversations.filter((e)=>{
            return e.name.toLowerCase().includes(Search.toLowerCase());
          }).map((e)=>{
            return <li onClick={()=>Setselected(e.id)} className={e.id == selected ? 'ConversationList-selected' : ''} key={e.id}><img src={e.image} alt={e.name} width={'40px'} height={'40px'} /><span>{e.name}</span></li>
          })
        }
    </ul>
  )
}
