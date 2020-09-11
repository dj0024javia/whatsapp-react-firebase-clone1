import React, { useEffect, useState } from "react";
import { Avatar } from "@material-ui/core";
import "./Sidebarchat.css";
import db from "./firebase";
import { Route, Link } from "react-router-dom";

function Sidebarchat({ id, roomname, addNewChat, user = false }) {
    const [seed, setSeed] = useState("");
    const [rooms, setRooms] = useState([]);
    const [allgrpmsgs, setAllGrpMsgs] = useState([])
    const [allusermsgs, setAllUserMsgs] = useState([])

    useEffect(() => {
        setSeed(Math.random() * 10000);
    }, []);

    useEffect(() => {
        if (!user) {
            if (id) {
                db.collection('rooms')
                    .doc(id)
                    .collection('messages')
                    .orderBy('timestamp', 'desc')
                    .onSnapshot(snapshot =>
                        setAllGrpMsgs(snapshot.docs.map(doc => doc.data()))
                    )
            }
        }
        else {
            // Fetch all msgs for particular chatId passed via user
            if (id) {
                db.collection("chats")
                    .doc(id)
                    .collection("chat_messages")
                    .orderBy("timestamp", "desc")
                    .onSnapshot(snapshot => {
                        setAllUserMsgs(snapshot.docs.map(doc => doc.data()))
                    })
            }
        }
    }, [user, id])

    const createChat = () => {
        const room_name = prompt("Enter New Room Name:");
        if (room_name) {
            console.log(`new room ${room_name} added`);
            db.collection("rooms").add({ roomname: room_name });
        }
    };


    return !addNewChat ? (!user ? (
        <Link to={`/rooms/${id}`}>
            <div className="sidebarchat">
                <Avatar src={`https://avatars.dicebear.com/api/human/${seed}.svg`} />
                <div className="sidebarchat__info">
                    <h2>{roomname}</h2>
                    <p>{allgrpmsgs[0]?.message}</p>
                </div>
            </div>
        </Link>) : (
            <Link to={`/userbase/${id}`}>
                <div className="sidebarchat">
                    <Avatar src={`https://avatars.dicebear.com/api/human/${seed}.svg`} />
                    <div className="sidebarchat__info">
                        <h2>{roomname}</h2>
                        <p>{allusermsgs[0]?.message}</p>
                    </div>
                </div>
            </Link>)
    ) : (
            <div className="sidebarchat" onClick={createChat}>
                <h2>Add New Room</h2>
            </div>
        );
}

export default Sidebarchat;
