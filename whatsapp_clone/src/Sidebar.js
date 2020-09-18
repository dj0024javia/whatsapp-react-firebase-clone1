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
  // const [present, setPresent] = useState(false)
  const [flag1, setFlag1] = useState(false)
  const [flag2, setFlag2] = useState(false)
  const [flag3, setFlag3] = useState(false)
  const [flag4, setFlag4] = useState(false)
  const [goSetChat, setGoSetChat] = useState(false)
  const [present1, setPresent1] = useState(false)
  const [present2, setPresent2] = useState(false)

  const [{ user, userDocId, friendDocId, commonchaturl }, dispatch] = useStateValue();
  // const [exeuseEf, setExeUseEf] = useState(false);
  const { chatId } = useParams()

  const [allchaturls, setAllChatUrls] = useState([])
  const [friendlist, setFriendList] = useState([])
  const [chatdocscombined, setDocsCombined] = useState([])
  const [commonchaturl1, setCommonChatUrl1] = useState('')
  const [friendChatIds, setFriendChatIds] = useState([])


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
    async function fetchData() {
      const temp = []
      setAllChatUrls(temp)
      await db.collection("userbase").doc(`${userDocId}`).collection("user_chats").onSnapshot((snapshot) =>
        (setAllChatUrls(snapshot.docs.map(doc => doc.data().chatId)))
      )
      console.log(`All Chat URLs:${allchaturls}`)
      setFlag1(true)
    }

    fetchData();

  }, [userDocId])



  useEffect(() => {

    async function fetchData() {
      // You can await here

      console.log("Flag3:", flag3, "FriendDocId:", friendDocId)
      if (flag3 && friendDocId) {
        console.log("success1")
        db.collection("userbase").doc(`${friendDocId}`).collection("user_chats").onSnapshot((snapshot) =>
          (setFriendChatIds(
            snapshot.docs.map
              (doc => doc.data().chatId)
          ))
        )
        setFlag3(false)
      }
      // ...
    }
    fetchData();


    // async () => {
    //   if (friendDocId) {
    //     console.log("FriendDocId received UseEffect:", friendDocId)
    //     db.collection("userbase").doc(`${friendDocId}`).collection("user_chats").onSnapshot((snapshot) =>
    //       (setFriendChatIds(snapshot.docs.map(doc => doc.data().chatId)))
    //     )
    //     console.log(`All Friend's Chat URLs:${friendChatIds}`)

    //   }
    // }
  }, [flag3])

  // const [friendDocId, setFriendDocId] = useState()

  // console.log(allchaturls)

  // Setting FriendDetails based on your chat urls.
  useEffect(() => {
    async function fetchData() {
      console.log("Flag1:", flag1, "AllChatURLs:", allchaturls, "AllChatURL Length:", allchaturls.length)
      if (flag1 && allchaturls) {
        // const temp = []
        // setFriendList(temp);
        if (allchaturls.length !== 0) {

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
      }

      setFlag1(false)
    }

    fetchData();

    // dispatch({
    //   type: actionTypes.SET_FRNDLST,
    //   allfriendlist: friendlist
    // })

  }, [flag1])

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

  useEffect(() => {
    console.log("UserDocId:", userDocId, "friendDocId:", friendDocId, "Present1?:", present1)
    if (userDocId && friendDocId && present1) {

      if (present1) {
        setPresent1(false)
        return
      }
      else {
        db.collection("chats").add(
          {
            user1: userDocId,
            user2: friendDocId,
            keepChatAgreement: [true, true]
          }
        ).then((docRef) => {
          console.log("Document written with ID: ", docRef.id);

          dispatch({
            type: "COMMON_CHAT_URL",
            commonchaturl: docRef.id
          })

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
        })
        setPresent1(false)
      }
    }
  }, [present1])

  useEffect(() => {
    // Checking if friend is already there in your friendlist or not.
    // If not, then add new chat id.
    console.log("UserDocId:", userDocId, "friendDocId:", friendDocId, "Present2?:", present1)
    if (userDocId && friendDocId) {
      if (present2) {
        alert("Ask your friend to add you. He is already there in your records. When both of you add each other, then only you can start chatting.")
        return
      }
      else {
        db.collection("chats").add(
          {
            user1: userDocId,
            user2: friendDocId,
            keepChatAgreement: [true, true]
          }
        ).then((docRef) => {
          console.log("Document written with ID: ", docRef.id);

          dispatch({
            type: "COMMON_CHAT_URL",
            commonchaturl: docRef.id
          })

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
        })
      }
    }
  }, [present2])

  useEffect(() => {
    async function fetchData() {
      console.log("goSetChat:", goSetChat)
      if (goSetChat) {

        if (allchaturls.length === 0) {
          if (friendChatIds.length === 0) {
            console.log("friend's chat list and your chat list both are empty")

            // Create new chat doc and add it in both users' user_chats.
            db.collection("chats").add(
              {
                user1: userDocId,
                user2: friendDocId,
                keepChatAgreement: [true, true]
              }
            ).then((docRef) => {
              console.log("Document written with ID: ", docRef.id);

              dispatch({
                type: "COMMON_CHAT_URL",
                commonchaturl: docRef.id
              })

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

              // db.collection("userbase").doc(friendDocId1).collection("user_chats")
              //   .add({
              //     chatId: docRef.id
              //   })
              //   .then(function (docRef2) {
              //     console.log("ChatDocId added in user_chats with ID: ", docRef2.id);
              //   })
              //   .catch(function (error) {
              //     console.error("Error adding document in user_chats: ", error);
              //   });

            })

          }
          else {
            // Friend's chat list is not empty. Search through it and check if you exist there.


            friendChatIds.map(async (eachChatId) => {
              const result = await db.collection("chats").doc(eachChatId).get()
              console.log("Each FriendChatId Result:", result)

              if (result.data().user1 === userDocId || result.data().user2 === userDocId) {
                console.log("Existing Chat records Found in your friend's chats. Linking them now.")



                db.collection("userbase").doc(userDocId).collection("user_chats")
                  .add({
                    chatId: eachChatId
                  })
                  .then(function (docRef1) {
                    dispatch({
                      type: "COMMON_CHAT_URL",
                      commonchaturl: eachChatId
                    });
                    console.log("ChatDocId added in your user_chats with ID: ", docRef1.id);
                  })
                  .catch(function (error) {
                    console.error("Error adding document in user_chats: ", error);
                  });
                setPresent1(true);
                return
              }


            })
            // If you are not there in your friend's existing chat list, then create a new chat id and add it in your user_chats as well as ask your friend to add your email in new chat.


          }
        }
        else {
          console.log("your chat list is not empty.:", friendlist)

          friendlist.map(async (eachFriendDetail) => {
            console.log(eachFriendDetail)
            const friendid = await db.collection("userbase")?.doc(friendDocId).get()
            if (!friendid.empty) {
              console.log("friendId:", friendid)
              if (eachFriendDetail.id === friendid.data().id) {
                console.log("Friend already exists in your chat records!!");

                setCommonChatUrl1(eachFriendDetail.chatURL);
                await dispatch({
                  type: actionTypes.COMMON_CHAT_URL,
                  commonchaturl: eachFriendDetail.chatURL
                })
                setPresent2(true)
                return
              }
            }

          })

          //   // if (friendChatIds.length === 0) {
          //   //   console.log("friend's chat list is empty")

          //   // }
          //   // else {
          //   //   friendChatIds.map(async (eachChatId) => {
          //   //     const result = await db.collection("chats").doc(eachChatId).get()
          //   //     console.log("Each FriendChatId Result:", result)

          //   //     if (result.data().user1 === userDocId || result.data().user2 === userDocId) {
          //   //       console.log("Existing Chat records Found in your friend's chats. Linking them now.")

          //   //       db.collection("userbase").doc(userDocId).collection("user_chats")
          //   //         .add({
          //   //           chatId: eachChatId
          //   //         })
          //   //         .then(function (docRef1) {
          //   //           console.log("ChatDocId added in your user_chats with ID: ", docRef1.id);
          //   //         })
          //   //         .catch(function (error) {
          //   //           console.error("Error adding document in user_chats: ", error);
          //   //         });
          //   //     }


          //   //   })
          //   // }

          // }

        }


        setGoSetChat(false)
      }
    }
    fetchData();

  }, [goSetChat])

  const createNewChat = async () => {

    const email = prompt("Enter Email id of the person you want to chat with:")
    // const email = "dj0024javia@gmail.com"
    console.log(`Your entered email is:${email}`)
    const snapshot = await db.collection("userbase").where("email", '==', `${email}`).get()
    console.log(snapshot)
    if (snapshot.empty) {
      console.log("User not Found!!")
      return
    }
    else {
      console.log("User Found!!")

      const friendDocId1 = snapshot.docs.map(doc => doc.id)[0]

      await dispatch({
        type: actionTypes.SET_FRNDDOCID,
        friendDocId: friendDocId1
      })

      setFlag3(true)

      console.log("friendDocID:", friendDocId1)
      // setFriendDocId(friendDocId1[0])

      console.log(await db.collection("userbase").doc(userDocId).collection("friends").where("id", "==", `${friendDocId1}`).get())

      // Checking if friend is already there in our friendlist or not
      const snapshot1 = await db.collection("userbase").doc(userDocId).collection("friends").where("id", "==", `${friendDocId1}`).get()


      // Friend is not present. Add him
      if (snapshot1.empty) {
        console.log("User not in your friendlist. Adding now.")
        db.collection("userbase").doc(userDocId).collection("friends").add({
          id: friendDocId1
        })
      }
      // Friend is present
      else {
        console.log("friend is already present in your friendlist!!")
      }

      // Adding your name in friend's friendlist

      const snapshot_friend = await db.collection("userbase").doc(friendDocId1).collection("friends").where("id", "==", `${userDocId}`).get()


      // Friend is not present. Add him
      if (snapshot_friend.empty) {
        console.log("You are not in your friend's friendlist. Adding now.")
        db.collection("userbase").doc(friendDocId1).collection("friends").add({
          id: userDocId
        })
      }
      // Friend is present
      else {
        console.log("You are there in your friendlist!! Start Chatting.")
      }

      // Checking if friend is alreday there in our chats.


      // FriendChatIds setup here





      console.log("My Chat URLs':", allchaturls)
      console.log("Friend's Chat URLs':", friendChatIds)

      console.log("Reducer FriendDoc:", friendDocId)
      setGoSetChat(true)
    }


    // End of createChat Function
  }



  // useEffect(() => {
  //   console.log("Flag4:", flag4)
  //   if (flag4) {
  //     setChat()
  //     setFlag4(false)
  //   }
  // }, [flag4])






  // End of Set Chat Function

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
