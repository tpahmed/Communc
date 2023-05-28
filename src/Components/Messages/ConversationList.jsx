import { Messages_Context } from '../../Contexts/MessagesContext';
import './ConversationList.css'
import { useContext, useEffect, useState } from 'react';

export default function ConversationList() {
  const {Update,Conversations,Setselected,selected} = useContext(Messages_Context);
  useEffect(()=>{
    Update();
  },[]);
  return (
    <ul className='ConversationList'>
        {
          Conversations.map((e)=>{
            return <li onClick={()=>Setselected(e.id)} className={e.id == selected ? 'ConversationList-selected' : ''} key={e.id}><img src={e.image} alt={e.name} width={'40px'} height={'40px'} /><span>{e.name}</span></li>
          })
        }
    </ul>
  )
}
