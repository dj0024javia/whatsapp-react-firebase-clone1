import { useStateValue } from "./StateProvider"
import db from "./firebase"
import { useState } from "react"
import { actionTypes } from "./reducer"

const [{ }, dispatch] = useStateValue()


const fetchAllMsgs = ({ userDocId }) => {

    db.collection("userbase").doc(`${userDocId}`)
        .collection('user_chats')
        .onSnapshot((snapshot) => {
            setAllChatUrls(snapshot.docs.map(
                doc => doc.data().chatId

                // db.collection('chats')
                //   .doc(`${chatURL}`)
                //   .collection('chat_messages')
                //   .orderBy('timestamp', 'asc')
                //   .onSnapshot(snapshot => {
                //     setAllUserMsgs(...allusermsgs, snapshot.docs.map(doc => doc.data()))
                //   })

            ))
        })
    console.log(allchaturls)
    // Store allChatUrls to cache

    dispatch({
        type: actionTypes.SET_CHATIDS,
        chatIds: allchaturls
    })

}

export default fetchAllMsgs