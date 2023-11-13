import './App.css';
import io from 'socket.io-client';
import { useState } from 'react';

const socket = io('http://localhost:4000');
const name = prompt("your name")
socket.emit('new-user-joined', name)
localStorage.setItem('name', name)
function App() {
  const [userJoined, setUserjoined] = useState([])
  const [msgSend, setMsgsend] = useState("")
  const [msgReceive, setMsgreceive] = useState([])

  const handleSendMessage = (e) => {
    e.preventDefault()
    if (msgSend === "") return;
    socket.emit('send', msgSend);
    setMsgreceive([...msgReceive, { message: msgSend, name: localStorage.getItem('name') }])
    setMsgsend(" ");
  }

  socket.on('user-joined', name => {
    setUserjoined([...userJoined, name])
  })

  socket.on('recieve', data => {
    setMsgreceive([...msgReceive, data])
  })
  return (
    <div className='chat'>

      <div className="chat_sidebar">
        <h2>Open Chat</h2>

        <div>
          <h4 className="chat_header">ACTIVE USERS</h4>
          <div className="chat_users">
            {userJoined.map((user, index) => (
              <div className="container send" key={index} >
                <p>{user}</p>
              </div>
            ))

            }
          </div>
        </div>
      </div>
      <div className='chat_main'>

        {/* <header className="chat__mainHeader">
          <p>Hangout with Colleagues</p>
          <button className="leaveChat__btn" >
            LEAVE CHAT
          </button>
        </header> */}
        <div className='message_container'>
          {msgReceive.map((data, index) =>
            data.name === localStorage.getItem('name') ? (
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

export default App;
