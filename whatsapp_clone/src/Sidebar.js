import React, { useState, useEffect } from "react";
import "./Sidebar.css";
import { Avatar, IconButton, Menu, MenuItem } from "@material-ui/core";
import DonutLargeIcon from "@material-ui/icons/DonutLarge";
import ChatIcon from "@material-ui/icons/Chat";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import SearchIcon from "@material-ui/icons/Search";
import Sidebarchat from "./Sidebarchat";
import db from "./firebase";
import { useStateValue } from "./StateProvider";
import { useParams } from "react-router-dom";
import { actionTypes } from "./reducer";
import { auth } from "./firebase";

function Sidebar() {
  const [rooms, setRooms] = useState([]);
  const [{ user, userDocId }, dispatch] = useStateValue();
  const [users, setUsers] = useState([]);
  const { chatId } = useParams()

  const [allchaturls, setAllChatUrls] = useState([])
  const [friendlist, setFriendList] = useState([])
  const [chatdocscombined, setDocsCombined] = useState([])

  console.log(userDocId)

  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  // Fuction to handle logout event
  const handleSignOut = async () => {
    if (user) {
      auth.signOut()

      dispatch({
        type: actionTypes.SET_USER,
        user: null
      });
    }

  }

  useEffect(() => {
    db.collection("userbase").doc(`${userDocId}`).collection("user_chats").onSnapshot(snapshot => {
      setAllChatUrls(snapshot.docs.map(doc => doc.data().chatId))
    })
    console.log(`All Chat URLs:${allchaturls}`)
  }, [userDocId])

  // console.log(allchaturls)

  // Setting FriendDetails based on your chat urls.
  useEffect(() => {
    console.log(allchaturls, allchaturls.length)
    if (allchaturls.length != 0) {
      setFriendList([])
      allchaturls.map(url => {
        db.collection("chats").doc(url).onSnapshot(snapshot => {
          // Checking if user1 is me??
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

          // User2 is me...Yay!!!
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
  // console.log(friendlist)


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

  // Fetching groups doc id and data.
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
  const [friendChatIds, setFriendChatIds] = useState([])

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

      console.log(db.collection("userbase").doc(userDocId).collection("friends").where("id", "==", `${friendDocId}`).get())

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

      // Adding your name in friend's friendlist

      const snapshot_friend = await db.collection("userbase").doc(friendDocId[0]).collection("friends").where("id", "==", `${userDocId}`).get()


      // Friend is not present. Add him
      if (snapshot_friend.empty) {
        console.log("You are not in your friend's friendlist. Adding now.")
        db.collection("userbase").doc(friendDocId[0]).collection("friends").add({
          id: userDocId
        })
      }
      // Friend is present
      else {
        console.log("You are there in your friendlist!! Start Chatting.")
      }


      // Loop through your chats, check each chat if user1/user2 is your new friend, if it is the case, then set commonchaturl to that chatid.

      db.collection("userbase").doc(friendDocId[0]).collection("user_chats").onSnapshot((snapshot) => {
        setFriendChatIds(snapshot.docs.map(doc => doc.data().ChatId))
      })

      console.log(friendChatIds)

      if (allchaturls.length === 0) {
        if (friendChatIds.length === 0) {
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
        }
        else {
          friendChatIds.map(eachFriendChatId => {
            db.collection("chats").doc(eachFriendChatId).collection("").onSnapshot(snapshot => {
              console.log("friendChatId:", eachFriendChatId, " Data:", snapshot.data())

              if (snapshot.data().user1 === userDocId || snapshot.data().user2 === userDocId) {
                console.log("Chat exists with your friend in it. Start Chatting.!!!", eachFriendChatId)
                setCommonChatUrl(eachFriendChatId)
              }


            })
          })
        }



      }
      else {
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

          {/* 3 vertical dot  more Button */}
          <IconButton>
            <MoreVertIcon
              aria-controls="simple-menu"
              aria-haspopup="true"
              onClick={handleClick}
            />
          </IconButton>
          <Menu
            id="simple-menu"
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem onClick={handleClose}>Profile</MenuItem>
            <MenuItem onClick={handleClose}>My account</MenuItem>
            <MenuItem onClick={handleSignOut}>Logout</MenuItem>
          </Menu>
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
