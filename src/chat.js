import React, { useEffect } from 'react';
import io from 'socket.io-client';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';


const socket = io('http://localhost:4000');
const name = localStorage.getItem('userName')
socket.emit('new-user-joined', name)

function Chat() {
    const [userJoined, setUserjoined] = useState([])
    const [userLeft, setUserleft] = useState([])
    const [msgSend, setMsgsend] = useState("")
    const [msgReceive, setMsgreceive] = useState([])
    const navigate = useNavigate();
    
    
   


    const handleSendMessage = (e) => {
        e.preventDefault()
        if (msgSend === "") return;
        socket.emit('send', msgSend);
        setMsgreceive([...msgReceive, { message: msgSend, name: localStorage.getItem('userName') }])
        setMsgsend(" ");
    }

    const handleLeave = () =>{
        localStorage.removeItem('userName')
        socket.on('left', name => {
            setUserleft([...userLeft, name])
        })
        navigate('/')
        window.location.reload()
    }

    socket.on('user-joined', userData => {
        setUserjoined([...userJoined, userData])
    })

    socket.on('recieve', data => {
        setMsgreceive([...msgReceive, data])
    })

    // socket.on('left', name => {
    //     setUserleft([...userLeft, name])
    // })
    return (
        <div className='chat'>

            <div className="chat_sidebar">
                <h2>Open Chat</h2>

                <div>
                    <h4 className="chat_header">NOTIFICATIONS</h4>
                    <div className="chat_users">
                        {userJoined.map((user, index) => (
                            <p key={index}>{user} joined the chat</p>
                        ))}
                       
                         {userLeft.map((user, index) => (
                            <p key={index}>{user} left the chat</p>
                        ))}
                        {console.log(userJoined)}
                    </div>
                </div>
            </div>
            <div className='chat_main'>

                <header className="chat__mainHeader">
                    <button className="leaveChat__btn" onClick={handleLeave}>
                        LEAVE CHAT
                    </button>
                </header>
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

    )
}

export default Chat
