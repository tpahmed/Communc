import PPlane from '../../assets/Paper-Plane.svg'
import IImage from '../../assets/Image-Icon.svg'
import Language from '../../Languages.json'
import themeJSON from '../../Theme.json';
import { useContext, useState } from 'react'
import { Messages_Context } from '../../Contexts/MessagesContext'
import CssFilterConverter from 'css-filter-converter';
import { Main_Context } from '../../Contexts/MainContext';
import './ConversationMessages.css'
import { invoke } from '@tauri-apps/api';

export default function ConversationMessages() {
    const {ConversationMessages,selected,LoadMessages} = useContext(Messages_Context);
    const {LANG,THEME} = useContext(Main_Context);
    const [Message,setMessage] = useState('');
    const HTF = CssFilterConverter.hexToFilter;
    const [SVG_filter,SetSVG_filter] = useState(HTF(themeJSON[THEME].text).color);
    async function sendMessage(){
        if (Message){
            await invoke('send_message',{token:sessionStorage.getItem('token'),id:`${selected}`,msgType:"text",content:Message});
            setMessage('');
            LoadMessages();
        }
    }
  return (
    <div className='ConversationMessages'>
        <ul>
            {
                ConversationMessages.map((e)=>{
                    return ( 
                        <li key={e.id} className={e.you ? 'ConversationMessages-Message-You' : 'ConversationMessages-Message'}>
                            <div className='ConversationMessages-title'>
                                <span>{e.lname} {e.fname} {e.you ? `(${Language['ENG']['ConversationMessages']['You']})` : ''}</span>
                                <span>{e.date}</span>
                            </div>
                            {
                                e.type === 'text' ? (
                                    <p>{e.content}</p>
                                ):(
                                    <img src={e.content} alt="" style={{ maxWidth:'100%' }}/>
                                )
                            }
                        </li>
                    )
                })
            }
        </ul>
        <div>
            <img src={IImage} alt={Language['ENG']['ConversationMessages']['Send Image']} style={{ filter:SVG_filter }}/>
            <input onKeyDown={(e)=>e.key == 'Enter' ? sendMessage() : null} type="text" value={Message} onChange={(e)=>setMessage(e.target.value)} />
            <img onClick={sendMessage} src={PPlane} alt={Language['ENG']['ConversationMessages']['Send']} style={{ filter:SVG_filter }} />
        </div>
    </div>
  )
}
