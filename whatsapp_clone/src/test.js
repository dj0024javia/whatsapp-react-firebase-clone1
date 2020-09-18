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
        const friendDocId1 = snapshot.docs.map(doc => doc.id)[0]
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

        // FriendChatIds setup here
        dispatch({
            type: "SET_FRNDDOCID",
            friendDoc: friendDocId1
        })

        // friendchatfetch(friendDocId1)

        // setExeUseEf(true)
        console.log("FriendDocId received is:", friendDoc)

        let temp = [];
        // Checking if friend's doc id is not null
        const snapshot4 = await db.collection("userbase").doc(`${friendDocId1}`).collection("user_chats").get()

        // fetch the data from db abt ur friend then fetch all the chat details and save it in temp.
        console.log(snapshot4)
        if (!snapshot4.empty) {
            snapshot4.docs.map(doc => temp.push(doc.data().chatId))
        }
        else {
            console.log("snapshot is empty:", snapshot4)
        }

        console.log("TEMP:", temp)

        // Checking if your chat list is empty or not.
        if (allchaturls.length === 0) {
            // Checking if your friend's chat list is empty or not.
            if (temp.length === 0) {

                // If both are empty then go ahead and create new chat doc and assign both  user to this doc and add records of it in individual users.
                console.log("ChatList is Empty...creating one now")
                db.collection("chats").add(
                    {
                        user1: userDocId,
                        user2: friendDocId1,
                        keepChatAgreement: [true, true]
                    }
                )
                    .then((docRef) => {
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

                        db.collection("userbase").doc(friendDocId1).collection("user_chats")
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

            // Your friend's chat list is not empty...check each chat for your presence. If found, assign it in commonchaturl variable.
            else {
                temp.map(async (eachFriendChatId) => {
                    const result = await db.collection("chats").doc(eachFriendChatId).get()
                    console.log("ChatID:", eachFriendChatId, " Result:", result)

                    if (result.data().user1 === userDocId || result.data().user2 === userDocId) {
                        setCommonChatUrl(eachFriendChatId)

                        dispatch({
                            type: "COMMON_CHAT_URL",
                            commonchaturl: commonchaturl
                        })

                    }
                })

                // If commonchaturl is not empty then old chat id is found and start chatting. else, add new chat id.
                if (commonchaturl) {
                    console.log("existing Chat Records Found!!---", commonchaturl)
                }
                else {

                    db.collection("chats")
                        .add(
                            {
                                user1: userDocId,
                                user2: friendDocId1,
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

                            db.collection("userbase").doc(friendDocId1).collection("user_chats")
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
            }


        }
        // If our chat ids are not 0 then, go through our chat ids and try to find your friend's chat.
        else {
            console.log(allchaturls)
            const res = allchaturls.some(
                async (mychatUrl) => {
                    const result = await db.collection("chats").doc(mychatUrl).get()

                    console.log("MyChatID:", mychatUrl, " MyResult:", result)
                    console.log("Checking user1:", (result.data().user1 === friendDocId1))
                    console.log("Checking user2:", (result.data().user2 === friendDocId1))

                    if ((result.data().user1 === friendDocId1) || (result.data().user2 === friendDocId1)) {

                        await setCommonChatUrl(result.id);

                        dispatch({
                            type: "COMMON_CHAT_URL",
                            commonchaturl: commonchaturl
                        })

                        console.log("existing Chat Records Found!!---", commonchaturl);
                        return true
                    }
                })

            // If your chat list is not empty and user and you never talked then create a new one else find that chat id and return it.

        }
        console.log("respose from:-", commonchaturl)
        if (commonchaturl) {
            console.log("existing Chat Records Found!!---", commonchaturl)
        }
        else {
            db.collection("chats")
                .add(
                    {
                        user1: userDocId,
                        user2: friendDocId1,
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

                    db.collection("userbase").doc(friendDocId1).collection("user_chats")
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



    }
}




















useEffect(() => {
    async function fetchData() {
        console.log("Flag1:", flag1, "AllChatURLs:", allchaturls, "AllChatURL Length:", allchaturls.length)
        if (flag1 && allchaturls) {
            // const temp = []
            // setFriendList(temp);
            if (allchaturls.length !== 0) {

                allchaturls.map(url => {
                    db.collection("chats").doc(url).onSnapshot((snapshot) => {
                        // Checking if user1 is me??
                        console.log(snapshot)
                        if (snapshot.data().user1 === userDocId) {

                            db.collection("userbase").doc(snapshot.data().user2).onSnapshot((snapshot2) =>
                                // (
                                //   setFriendList(
                                //     friendlist =>
                                //       [
                                //         ...friendlist,
                                //         {
                                //           "id": snapshot2.data().id,
                                //           "name": snapshot2.data().name,
                                //           "photo": snapshot2.data().photo,
                                //           "email": snapshot2.data().email,
                                //           "chatURL": url,
                                //         }
                                //       ]
                                //   )
                                // )
                                dispatch({
                                    type: actionTypes.SET_FRNDLST,
                                    allfriendlist:
                                    {
                                        "id": snapshot2.data().id,
                                        "name": snapshot2.data().name,
                                        "photo": snapshot2.data().photo,
                                        "email": snapshot2.data().email,
                                        "chatURL": url,
                                    }
                                })
                            )


                        }

                        // User2 is me...Yay!!!
                        else {

                            db.collection("userbase").doc(snapshot.data().user1).onSnapshot((snapshot3) =>
                                // (
                                //   setFriendList(
                                //     friendlist =>
                                //       [
                                //         ...friendlist,
                                //         {
                                //           "id": snapshot3.data().id,
                                //           "name": snapshot3.data().name,
                                //           "photo": snapshot3.data().photo,
                                //           "email": snapshot3.data().email,
                                //           "chatURL": url,
                                //         }
                                //       ]
                                //   )
                                // )

                                dispatch(
                                    {
                                        type: actionTypes.SET_FRNDLST,
                                        allfriendlist:
                                        {
                                            "id": snapshot3.data().id,
                                            "name": snapshot3.data().name,
                                            "photo": snapshot3.data().photo,
                                            "email": snapshot3.data().email,
                                            "url": url
                                        }
                                    }
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

}, [flag1, allchaturls])