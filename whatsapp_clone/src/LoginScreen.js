import React, { useState, useEffect } from 'react'
import './LoginScreen.css'
import { Button } from '@material-ui/core'
import db, { auth, provider } from './firebase'
import { useStateValue } from './StateProvider'
import { actionTypes } from './reducer'
import { useHistory } from 'react-router-dom'
// import fetchAllMsgs from './fetchAllMsgs'
// import result from './Dummyuser'

function LoginScreen() {

    const [{ }, dispatch] = useStateValue()
    const [tempUserDetails, setTempUserDetails] = useState('')

    const signIn = async (e) => {
        e.preventDefault();

        auth.signInWithPopup(provider).then(async (result) => {
            console.log(result)
            if (result) {

                dispatch({
                    type: actionTypes.SET_USER,
                    user: result.user
                });
            }
            // setTempUserDetails(result);

            const snapshot1 = await db.collection("userbase")
                .where("id", "==", `${result.user.uid}`).get()

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
            else {
                // New User
                db.collection("userbase").add({
                    email: result.user.email,
                    id: result.user.uid,
                    name: result.user.displayName,
                    photo: result.user.photoURL,
                })
                // Since the user is new, add empty chatIds to store.
            }


        }).catch(error => alert(error.message))

    };
    // ).catch (error => alert(error.message))
    // }
    // const [allchaturls, setAllChatUrls] = useState([])

    // useEffect(() => {
    //     console.log(`Temp User Doc ID:${userDocId}`)
    //     db.collection("userbase").doc(`${tempUserDocId}`)
    //         .collection('user_chats')
    //         .onSnapshot((snapshot) => {
    //             setAllChatUrls(snapshot.docs.map(
    //                 doc => doc.data().chatId

    //                 // db.collection('chats')
    //                 //   .doc(`${chatURL}`)
    //                 //   .collection('chat_messages')
    //                 //   .orderBy('timestamp', 'asc')
    //                 //   .onSnapshot(snapshot => {
    //                 //     setAllUserMsgs(...allusermsgs, snapshot.docs.map(doc => doc.data()))
    //                 //   })

    //             ))
    //         })
    //     console.log(allchaturls)
    //     // Store allChatUrls to cache

    //     dispatch({
    //         type: actionTypes.SET_CHATIDS,
    //         chatIds: allchaturls
    //     })
    // }, [])


    return (
        <div className="login">
            <div className="login__container">


                <img src="https://whatsappbrand.com/wp-content/themes/whatsapp-brc/images/WhatsApp_Logo_1.png" />

                <div className="login__text">
                    <h1>Welcome to Whatsapp</h1>
                </div>

                <Button onClick={signIn}>Sign in With Google</Button>
            </div>
        </div>
    )
}

export default LoginScreen
