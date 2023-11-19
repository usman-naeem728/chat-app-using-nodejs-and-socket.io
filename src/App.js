import './App.css';
import Home from './home';
import Chat from './chat';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"
import { useEffect, useState } from 'react';

function App() {
  const [name, setName] = useState(false)

  useEffect(() => {
    // finding userName
    let i;
    for (i = 0; i < localStorage.length; i++) {
      let findingName = localStorage.key(i);
      if (findingName === "userName") {
        setName(true)
      }
    }
  })
  return (
    <>
      <Router>
        <Routes>
          {!name ?
            <Route path='/' element={<Home />} />
            :
            <>
              <Route path='/' element={<Home />} />
              <Route path='/chat' element={<Chat />} />
            </>
          }
        </Routes>
      </Router>
    </>
  )
}

export default App;
