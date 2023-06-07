import React from 'react'
import ReactDOM from 'react-dom/client'
import MainContext from './Contexts/MainContext'
import App from './App'
import './index.css'
import ActionBarContext from './Contexts/ActionBarContext'
import FriendsContext from './Contexts/FriendsContext'
import MessagesContext from './Contexts/MessagesContext'
import ProfileContext from './Contexts/ProfileContext'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <MainContext>
      <ActionBarContext>
        <FriendsContext>
          <MessagesContext>
            <ProfileContext>
              <App />
            </ProfileContext>
          </MessagesContext>
        </FriendsContext>
      </ActionBarContext>
    </MainContext>
  </React.StrictMode>,
)
