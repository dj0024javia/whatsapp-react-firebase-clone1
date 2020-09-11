import React, { useState, useEffect } from 'react';
import './App.css';
import Sidebar from './Sidebar';
import Chat from './Chat';
import './Chat.css'
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import LoginScreen from './LoginScreen';
import { useStateValue } from './StateProvider';
import db from './firebase';



function App() {
  // const [user, setUser] = useState(null)
  const [{ user, userDocId }, dispatch] = useStateValue()

  console.log(userDocId)



  return (

    < div className="app" >
      {!user ? (
        <LoginScreen />
      ) : (

          <div className="app__body">
            <Router>
              <Switch>

                <Route path='/rooms/:roomId'>
                  <Sidebar />
                  <Chat />
                </Route>

                <Route path='/userbase/:chatId'>
                  <Sidebar />
                  <Chat />
                </Route>

                <Route path="/">
                  <Sidebar />
                  <Chat />
                </Route>

              </Switch>
            </Router>
          </div>

        )
      }
    </div >
  )
}

export default App;
