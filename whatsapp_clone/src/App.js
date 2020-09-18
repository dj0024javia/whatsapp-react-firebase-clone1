import React, { useState, useEffect } from 'react';
import './App.css';
import Sidebar from './Sidebar';
import Chat from './Chat';
import './Chat.css'
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import LoginScreen from './LoginScreen';
import { useStateValue } from './StateProvider';
import db from './firebase';
import { auth } from './firebase';
import { actionTypes } from './reducer';



function App() {
  // const [user, setUser] = useState(null)
  const [{ user, userDocId, friendDocId }, dispatch] = useStateValue()
  console.log(friendDocId)
  useEffect(() => {

    auth.onAuthStateChanged(async authUser => {
      console.log("AuthUser is :", authUser)

      if (authUser) {
        dispatch({
          type: actionTypes.SET_USER,
          user: authUser
        })

        const snapshot1 = await db.collection("userbase")
          .where("id", "==", `${authUser.uid}`).get()

        await console.log(snapshot1)
        if (!snapshot1.empty) {
          // Existing User
          snapshot1
            .docs.map(
              (doc) => {
                dispatch({
                  type: actionTypes.SET_USERDOCID,
                  userDocId: doc.id
                });
              }
            )
          // Add chatUrls to store.
        }
      }
      else {
        dispatch({
          type: actionTypes.SET_USER,
          user: null
        });

        // dispatch({
        //   type: actionTypes.SET_FRNDLST,
        //   allfriendlist: []
        // })

        // dispatch({
        //   type: actionTypes.SET_USERDOCID,
        //   userDocId: null
        // })

      }

    })
  }, [])

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
