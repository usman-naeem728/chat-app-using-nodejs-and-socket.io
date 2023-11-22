import React, { useEffect } from 'react';
import io from 'socket.io-client';
import { useState } from 'react';
import audio from "./ting.mp3"


const socket = io('http://localhost:4000');
let i;
for (i = 0; i < localStorage.length; i++) {
    let findingName = localStorage.key(i);
    if (findingName === "userName") {
        const name = localStorage.getItem('userName')
        socket.emit('new-user-joined', name)
    }
}
function Chat() {
    const [userJoined, setUserjoined] = useState([])
    const [msgSend, setMsgsend] = useState("")
    const [msgReceive, setMsgreceive] = useState([])

    const state = {
        audio: new Audio(audio)
    }
   
   

    


    const handleSendMessage = (e) => {
        e.preventDefault()
        if (msgSend === "") return;
        socket.emit('send', msgSend);
        setMsgreceive([...msgReceive, { message: msgSend, name: localStorage.getItem('userName') }])
        setMsgsend(" ");
    }

    // const handleLeave = () =>{
    //     const name = localStorage.getItem('userName')
    //     socket.emit('new-user-disconnect', name)
    //     localStorage.removeItem('userName')
    //     navigate('/')
    //     // window.location.reload()

    // }

    socket.on('user-joined', userData => {
        setUserjoined([...userJoined, userData])
        state.audio.play()
    })

    socket.on('recieve', data => {
        setMsgreceive([...msgReceive, data])
        state.audio.play()
    })


    return (
        <>
            <div className='chat'>

                <div className="chat_sidebar">
                    
                    <h2>YOU: {localStorage.getItem('userName')}</h2>

                    <div>
                        <h4 className="chat_header">NOTIFICATIONS</h4>
                        <div className="chat_users">
                            {userJoined.map((user, index) => (
                                <p key={index}>{user} joined the chat</p>

                            ))}

                            {/* {console.log(userJoined)} */}
                        </div>
                      
                    </div>
                </div>
                <div className='chat_main'>

                    {/* <header className="chat__mainHeader">
                    <button className="leaveChat__btn" onClick={handleLeave}>
                        LEAVE CHAT
                    </button>
                </header> */}
                    <div className='message_container'>
                        {msgReceive.map((data, index) =>
                            data.name === localStorage.getItem('userName') ? (
                                <div className="message_chats" key={index}>
                                    <p className="sender_name">You</p>
                                    <div className="message_sender">
                                        <p>{data.message}</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="message_chats" key={index}>
                                    <p>{data.name}</p>
                                    <div className="message_recipient">
                                        <p>{data.message}</p>
                                    </div>
                                </div>
                            )
                        )}
                        {/*This is triggered when a user is typing*/}
                        <div className="message_status">
                            <p>Someone is typing...</p>
                        </div>
                    </div>

                    <div className="chat_footer">
                        <form className="form" onSubmit={handleSendMessage}>
                            <input
                                type="text"
                                placeholder="Write message"
                                className="message"
                                value={msgSend}
                                onChange={(e) => setMsgsend(e.target.value)}
                            />
                            <button className="sendBtn">SEND</button>
                        </form>
                    </div>
                </div >
            </div>

        </>
    )
}

export default Chat
