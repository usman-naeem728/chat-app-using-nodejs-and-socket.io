import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');

  const changeCase = (e) => {
    e.preventDefault();
    setUserName(e.target.value.toUpperCase());
  };
  const handleInput = (e) => {
    e.preventDefault();
    setUserName(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem('userName', userName);
    navigate('/');
    window.location.reload()
  };
  return (
    <form className="home__container" onSubmit={handleSubmit}>
      <h2 className="home__header">Sign in to Open Chat</h2>
      <label htmlFor="username">Username</label>
      <input
        type="text"
        minLength={5}
        name="username"
        id="username"
        className="username__input"
        value={userName}
        onChange={handleInput}
        onMouseLeave={changeCase}
        
      />
      <button className="home__cta" disabled={userName.length < 5 ? true : false}>SIGN IN</button>
    </form>
  );
};

export default Home;