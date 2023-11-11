import './App.css';
import io from 'socket.io-client';
import { useState } from 'react';

const socket = io('http://localhost:4000');
const name = prompt("your name")
socket.emit('new-user-joined', name)

function App() {
  const [userJoined, setUserjoined] = useState([])
  const [msgInput, setMsginput] = useState("")
  const [msgReceive, setMsgreceive] = useState([])

  const submitForm = (e) => {
    e.preventDefault()
    if (msgInput === "") return;
    socket.emit('send', msgInput);
    setMsginput(" ");
  }

  socket.on('user-joined', name => {
    setUserjoined([...userJoined, name])
  })

  socket.on('recieve', data => {
    setMsgreceive([...msgReceive, data])
  })
  return (
    <>
      <div className='main'>

        <div className="container send">
          <p>{msgInput}</p>
          <span className="time-right">11:00</span>
        </div>

        {userJoined.map((user, index) => (
          <div className="container send" key={index} >
            <p>{user} joind the chat</p>
          </div>
        ))

        }
        {
          msgReceive.map((data, index) => (
            <div className='container receive' key={index}>
              <p>{data.name}:{data.message}</p>
            </div>
          ))
        }
      </div >
      <div className='msginput'>
        <form onSubmit={submitForm} >
          <input onChange={(e) =>
            setMsginput(e.target.value)} />
          <button>send</button>
        </form>
      </div>
    </>
  );
}

export default App;
