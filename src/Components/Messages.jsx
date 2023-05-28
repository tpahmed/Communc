import Container from './Global/Container';
import Language from '../Languages.json';
import './Messages.css'
import ConversationList from './Messages/ConversationList';
import { useContext, useEffect } from 'react';
import { Messages_Context } from '../Contexts/MessagesContext';
import ConversationMessages from './Messages/ConversationMessages';

export default function Messages() {
  const {selected,Setselected} = useContext(Messages_Context);
  useEffect(()=>{
    Setselected(0);
  },[])
  return (
    <Container>
        <div className="Messages">
          <div className="Messages-Titles">
            <h2>{Language['ENG']["Messages"]['Your Messages']}</h2>
            <div>
              <button>{Language['ENG']["Messages"]['Create Group']}</button>
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
