import React from 'react'
import ReactDOM from 'react-dom/client'
import MainContext from './Contexts/MainContext'
import App from './App'
import './index.css'
import ActionBarContext from './Contexts/ActionBarContext'
import FriendsContext from './Contexts/FriendsContext'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <MainContext>
      <ActionBarContext>
        <FriendsContext>
          <App />
        </FriendsContext>
      </ActionBarContext>
    </MainContext>
  </React.StrictMode>,
)
