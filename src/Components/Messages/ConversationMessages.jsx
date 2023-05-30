import PPlane from '../../assets/Paper-Plane.svg'
import IImage from '../../assets/Image-Icon.svg'
import Language from '../../Languages.json'
import themeJSON from '../../Theme.json';
import { useContext, useRef, useState } from 'react'
import { Messages_Context } from '../../Contexts/MessagesContext'
import CssFilterConverter from 'css-filter-converter';
import { Main_Context } from '../../Contexts/MainContext';
import './ConversationMessages.css'
import { invoke } from '@tauri-apps/api';
import axios from 'axios';

export default function ConversationMessages() {
    const {ConversationMessages,selected,LoadMessages} = useContext(Messages_Context);
    const {LANG,THEME} = useContext(Main_Context);
    const imginputRef = useRef(null);
    const [Message,setMessage] = useState('');
    const [Image,setImage] = useState(null);
    const [ImagePreview,SetImagePreview] = useState('');
    const HTF = CssFilterConverter.hexToFilter;
    const [SVG_filter,SetSVG_filter] = useState(HTF(themeJSON[THEME].text).color);
    async function sendMessage(){
        if (Message){
            await invoke('send_message',{token:sessionStorage.getItem('token'),id:`${selected}`,msgType:"text",content:Message});
            setMessage('');
            LoadMessages();
        }
        else if(Image){
            const formData = new FormData();
            formData.append('content',Image);
            formData.append('token',sessionStorage.getItem('token'));
            formData.append('id',`${selected}`);
            formData.append('type',"image");
            await axios.post('//localhost:4055/messages/send',formData,{
                headers:'multipart/form-data'
            })
            setImage(null);
            SetImagePreview('');
            LoadMessages();

        }
    }
    function selectFile(e){
        if (e.target.files[0] && /image\/./.test(e.target.files[0].type)){
            setImage(e.target.files[0]);
            const Obj_URL = URL.createObjectURL(e.target.files[0]);
            SetImagePreview(Obj_URL);

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
            <input
            style={{display: 'none'}}
            ref={imginputRef}
            type="file"
            onChange={selectFile}
            accept='image/*' />
            <img onClick={()=>{imginputRef.current.click()}} src={IImage} alt={Language['ENG']['ConversationMessages']['Send Image']} style={{ filter:SVG_filter }}/>
            {
                Image ?
                <div>
                    <img src={ImagePreview} alt={Language['ENG']['ConversationMessages']['Image Preview']} height={'40px'}/>
                    <span>{Image.name}</span>
                </div>
                :
                <input onKeyDown={(e)=>e.key == 'Enter' ? sendMessage() : null} type="text" value={Message} onChange={(e)=>setMessage(e.target.value)} />
            }
            <img onClick={sendMessage} src={PPlane} alt={Language['ENG']['ConversationMessages']['Send']} style={{ filter:SVG_filter }} />
        </div>
    </div>
  )
}
