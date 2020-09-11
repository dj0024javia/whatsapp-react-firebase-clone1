import React, { useState, useEffect } from "react";
import "./Sidebar.css";
import { Avatar, IconButton } from "@material-ui/core";
import DonutLargeIcon from "@material-ui/icons/DonutLarge";
import ChatIcon from "@material-ui/icons/Chat";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import SearchIcon from "@material-ui/icons/Search";
import Sidebarchat from "./Sidebarchat";
import db from "./firebase";
import { useStateValue } from "./StateProvider";
import { useParams } from "react-router-dom";
import { actionTypes } from "./reducer";

function Sidebar() {
  const [rooms, setRooms] = useState([]);
  const [{ user, userDocId }, dispatch] = useStateValue();
  const [users, setUsers] = useState([]);
  const { chatId } = useParams()

  const [allchaturls, setAllChatUrls] = useState([])
  const [friendlist, setFriendList] = useState([])
  const [chatdocscombined, setDocsCombined] = useState([])

  console.log(userDocId)

  useEffect(() => {
    setAllChatUrls([])
    db.collection("userbase").doc(`${userDocId}`).collection("user_chats").onSnapshot(snapshot => {
      setAllChatUrls(snapshot.docs.map(doc => doc.data().chatId))
    })
    console.log(`All Chat URLs:${allchaturls}`)
  }, [userDocId])

  // console.log(allchaturls)

  useEffect(() => {
    console.log(allchaturls, allchaturls.length)
    if (allchaturls.length != 0) {
      setFriendList([])
      allchaturls.map(url => {
        db.collection("chats").doc(url).onSnapshot(snapshot => {
          if (snapshot.data().user1 === userDocId) {

            db.collection("userbase").doc(snapshot.data().user2).onSnapshot(snapshot2 =>
              (
                setFriendList(
                  friendlist =>
                    [
                      ...friendlist,
                      {
                        "id": snapshot2.data().id,
                        "name": snapshot2.data().name,
                        "photo": snapshot2.data().photo,
                        "email": snapshot2.data().email,
                        "chatURL": url,
                      }
                    ]
                )
              )

              // {
              //   dispatch(
              //     {
              //       type: actionTypes.SET_FRNDLST,
              //       allfriendlist:
              //       {
              //         "id": snapshot2.data().id,
              //         "name": snapshot2.data().name,
              //         "photo": snapshot2.data().photo,
              //         "email": snapshot2.data().email,
              //         "url": url
              //       }
              //     }
              //   )
              // }
            )


          }
          else {

            db.collection("userbase").doc(snapshot.data().user1).onSnapshot(snapshot3 =>
              (
                setFriendList(
                  friendlist =>
                    [
                      ...friendlist,
                      {
                        "id": snapshot3.data().id,
                        "name": snapshot3.data().name,
                        "photo": snapshot3.data().photo,
                        "email": snapshot3.data().email,
                        "chatURL": url,
                      }
                    ]
                )
              )

              // {
              //   dispatch(
              //     {
              //       type: actionTypes.SET_FRNDLST,
              //       allfriendlist:
              //       {
              //         "id": snapshot2.data().id,
              //         "name": snapshot2.data().name,
              //         "photo": snapshot2.data().photo,
              //         "email": snapshot2.data().email,
              //         "url": url
              //       }
              //     }
              //   )
              // }
            )

          }
        })
      })
    }

    // dispatch({
    //   type: actionTypes.SET_FRNDLST,
    //   allfriendlist: friendlist
    // })

  }, [allchaturls])

  // console.log(allfriendlist)
  console.log(allchaturls)
  console.log(friendlist)


  // useEffect(() => {

  //   db.collection("userbase").doc(`${userDocId}`)
  //     .collection('friends')
  //     .onSnapshot((snapshot) => {
  //       setFriendList(snapshot.docs.map(
  //         doc => doc.data().id

  //         // db.collection('chats')
  //         //   .doc(`${chatURL}`)
  //         //   .collection('chat_messages')
  //         //   .orderBy('timestamp', 'asc')
  //         //   .onSnapshot(snapshot => {
  //         //     setAllUserMsgs(...allusermsgs, snapshot.docs.map(doc => doc.data()))
  //         //   })

  //       ))

  //     })

  // }, [userDocId])

  console.log("Friendlist is", friendlist)

  useEffect(() => {
    const unsubscribe = db.collection("rooms").onSnapshot((snapshot) => {
      setRooms(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          data: doc.data(),
        }))
      );
    }
    );

    return () => {
      unsubscribe();
    }

  }, []);

  console.log(rooms)

  const [commonchaturl, setCommonChatUrl] = useState('')
  const createNewChat = async () => {
    const email = prompt("Enter Email id of the person you want to chat with:")
    // const email = "dhavaljavia.p@gmail.com"
    console.log(`Your entered email is:${email}`)
    const snapshot = await db.collection("userbase").where("email", '==', `${email}`).get()
    console.log(snapshot)
    if (snapshot.empty) {
      console.log("User not Found!!")
      return
    }
    else {
      console.log("User Found!!")
      const friendDocId = snapshot.docs.map(doc => doc.id)


      // Checking if friend is already there in our friendlist or not
      const snapshot1 = await db.collection("userbase").doc(userDocId).collection("friends").where("id", "==", `${friendDocId}`).get()


      // Friend is not present. Add him
      if (snapshot1.empty) {
        console.log("User not in your friendlist. Adding now.")
        db.collection("userbase").doc(userDocId).collection("friends").add({
          id: friendDocId[0]
        })
      }
      // Friend is present
      else {
        console.log("friend is already present in your friendlist!!")
      }

      // Loop through your chats, check each chat if user1/user2 is your new friend, if it is the case, then set commonchaturl to that chatid.

      if (allchaturls.length === 0) {

        console.log("ChatList is Empty...creating one now")
        db.collection("chats")
          .add(
            {
              user1: userDocId,
              user2: friendDocId[0],
              keepChatAgreement: [true, true]
            }
          )
          .then((docRef) => {
            console.log("Document written with ID: ", docRef.id);

            db.collection("userbase").doc(userDocId).collection("user_chats")
              .add({
                chatId: docRef.id
              })
              .then(function (docRef1) {
                console.log("ChatDocId added in user_chats with ID: ", docRef1.id);
              })
              .catch(function (error) {
                console.error("Error adding document in user_chats: ", error);
              });

            db.collection("userbase").doc(friendDocId[0]).collection("user_chats")
              .add({
                chatId: docRef.id
              })
              .then(function (docRef2) {
                console.log("ChatDocId added in user_chats with ID: ", docRef2.id);
              })
              .catch(function (error) {
                console.error("Error adding document in user_chats: ", error);
              });

          })
      } else {
        allchaturls.map(url => {
          const chatDocData = db.collection("chats").doc(url).onSnapshot(snapshot3 => snapshot3.data())

          if (chatDocData.user1 === friendDocId[0] || chatDocData.user2 === friendDocId[0]) {
            console.log("Chat already exits.", url)
            setCommonChatUrl(url)
          }
          // if not, then create new chat id with user1 as you, user2 as opponent party, get that newly created docId, set it inside user_chats of both you and friend's doc.
          else {
            console.log("ChatId does not exist in your user_chats")
            db.collection("chats")
              .add({
                user1: userDocId,
                user2: friendDocId[0],
                keepChatAgreement: [true, true]
              })
              .then((docRef) => {
                console.log("Document written with ID: ", docRef.id);

                db.collection("userbase").doc(userDocId).collection("user_chats")
                  .add({
                    chatId: docRef.id
                  })
                  .then(function (docRef1) {
                    console.log("ChatDocId added in user_chats with ID: ", docRef1.id);
                  })
                  .catch(function (error) {
                    console.error("Error adding document in user_chats: ", error);
                  });

                db.collection("userbase").doc(friendDocId[0]).collection("user_chats")
                  .add({
                    chatId: docRef.id
                  })
                  .then(function (docRef2) {
                    console.log("ChatDocId added in user_chats with ID: ", docRef2.id);
                  })
                  .catch(function (error) {
                    console.error("Error adding document in user_chats: ", error);
                  });


              })
              .catch((error) => {
                console.error("Error adding document: ", error);
              });
          }
        })

        // checking if your user id  is presnet in friend's user_chats list.

        db.collection("userbase").doc(friendDocId[0]).collection("user_chats").onSnapshot(snapshot => {
          snapshot.docs.map(doc => {
            const fChatId = doc.data().chatId;
            const fChatIdData = db.collection("chats").doc(fChatId).get()
            console.log(fChatIdData)
          })
        })
      }
    }

  }

  return (
    <div className="sidebar">
      <div className="sidebar__header">
        <Avatar src={user?.photoURL} />
        <div className="sidebar__headerRight">
          <IconButton>
            <DonutLargeIcon />
          </IconButton>
          <IconButton>
            <ChatIcon onClick={createNewChat} />
          </IconButton>
          <IconButton>
            <MoreVertIcon />
          </IconButton>
        </div>
      </div>

      <div className="sidebar__search">
        <div className="sidebar__searchContainer">
          <SearchIcon />
          <input
            placeholder="Search or start new chat"
            type="text"
            className="sidebar__input"
          />
        </div>
      </div>

      <div className="sidebar__chats">

        <Sidebarchat addNewChat />

        <div className="sidebar__chat__rooms">
          <h2>Rooms</h2>
          {rooms.map((room) => (
            <Sidebarchat
              key={room.id}
              id={room.id}
              roomname={room.data.roomname}
              user={false}
            />
          ))}
        </div>

        <div className="sidebar__chat__users">
          <h2>Users</h2>
          {friendlist.map((friend) => (
            <Sidebarchat
              key={friend.id}
              id={friend.chatURL}
              roomname={friend.name}
              user={true}
            />
          ))}
        </div>


      </div>
    </div>
  );
}

export default Sidebar;
