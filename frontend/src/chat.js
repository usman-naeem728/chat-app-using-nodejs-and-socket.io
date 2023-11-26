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
    const [typingStatus, setTypingStatus] = useState('');
    const state = {
        audio: new Audio(audio)
    }





    useEffect(() => {
        socket.on('typingResponse', (data) => setTypingStatus(data));
    }, [socket]);

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
    //     navigate('/')
    //     // window.location.reload()
    
    // }
    window.addEventListener('beforeunload', function (e) {
        e.preventDefault();
        localStorage.removeItem('userName')
        e.returnValue = '';
    });

    socket.on('user-joined', userData => {
        setUserjoined([...userJoined, userData])
        state.audio.play()
    })

    socket.on('recieve', data => {
        setMsgreceive([...msgReceive, data])
        state.audio.play()
    })

    const handleTyping = () =>
        socket.emit('typing', `${localStorage.getItem('userName')} is typing`);

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

                        </div>

                    </div>
                </div>
                <div className='chat_main'>

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
                            <p>{typingStatus}</p>
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
                                onKeyDown={handleTyping}
                            />
                            <button className="sendBtn" disabled={msgSend === " "? true : false}>SEND</button>
                        </form>
                    </div>
                </div >
            </div>

        </>
    )
}

export default Chat
