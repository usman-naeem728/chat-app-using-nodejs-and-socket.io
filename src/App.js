import './App.css';
import io from 'socket.io-client';
import { createElement } from 'react';

const socket = io('http://localhost:4000');
const name = prompt("ypur name")
socket.emit('new-user-joined', name)

function App() {
  // const [userJoined, setUserjoined] = useState("")

  
  socket.on('user-joined', name => {
    // greetingName(name)
  })
  return (
    <>
      <div className='main'>

        <div className="container receive">
          <p>Hello. How are you today?</p>
          <span className="time-right">11:00</span>
        </div>

        <div className="container send">
          <p>Hey! I'm fine. Thanks for asking!</p>
          <span className="time-left">11:01</span>
        </div>

        <div className="container receive" >
          <p>Sweet! So, what do you wanna do today?</p>
          <span className="time-right">11:02</span>
        </div>

        <button>create div</button>
      </div>
      <div className='msginput'>
        <form >
          <input />
          <button>send</button>
        </form>
      </div>
    </>
  );
}

export default App;
