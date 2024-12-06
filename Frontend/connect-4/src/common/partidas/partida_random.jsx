import './partida_random.css';
import axios from 'axios';
import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from "./../../profile/AuthContext";
import LogoutButton from './../../profile/logout';

export default function PartidaRandom() {
  const { token } = useContext(AuthContext);
  const [game, setGame] = useState(null);

  const config = {
    'method': 'post',
    'url': `${import.meta.env.VITE_BACKEND_URL}/players`,
    'headers': {
      'Authorization': `Bearer ${token}`
    }
  };

  const partida = {
    'method': 'get',
    'url': `${import.meta.env.VITE_BACKEND_URL}/games/${game}`,
    'headers': {
      'Authorization': `Bearer ${token}`
    }
  };

  const borrar = {
    'method': 'delete',
    'url': `${import.meta.env.VITE_BACKEND_URL}/games/${game}`,
    'headers': {
      'Authorization': `Bearer ${token}`
    }
  };

  const handleClick = (event) => {
    event.preventDefault();

    axios(borrar).catch((err) => {
      console.error(err);
    });
    window.location.href = `/principal`;
  }

  useEffect(() => {
    axios(config)
      .then((response) => {
        setGame(response.data.game.id);
        console.log(response.data);
        
        localStorage.setItem("GameId", response.data.game.id);
        localStorage.setItem("Player", response.data.player.number);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []); // Empty dependency array
  

  useEffect(() => {
    const interval = setInterval(() => {
      if (game !== null) {
        axios(partida)
          .then((response) => {
            if (response.data.friend === 2) {
              window.location.href = `/board`;
            }
          })
          .catch((err) => {
            console.error(err);
          });
      }
    }, 5000); // 5000 milliseconds = 5 seconds
  
    return () => {
      clearInterval(interval); // Clean up the interval on component unmount
    };
  }, [game]);

  return (
    <>
      <div className="Logout-container">
        <LogoutButton />
      </div>
      <div className='unirme-partida'>
        <h2>esperando contrincante...</h2>
        <button onClick={handleClick}>atras</button>
      </div>
    </>
    
  );
} 