import './partida_amigo.css';
import axios from "axios";
import { Link } from 'react-router-dom';
import React, { useEffect, useContext, useState } from 'react';
import { AuthContext } from './../../profile/AuthContext';
import LogoutButton from './../../profile/logout';

export default function PartidaAmigo() {
  const { token, getUser } = useContext(AuthContext);
  const [gameAux, setGameAux] = useState(null);
  const [game, setGame] = useState(null);
  const [message, setMessage] = useState("");
  const [ready, setRedy] = useState(false);
  const [user, setUser] = useState("");

  useEffect(() => {
    getUser()
        .then((response) => {
            setUser(response.data)
            console.log("Session:", response.data)
        })
        .catch((err) => console.error(err))
  }, [])
  

  const nueva_partida = {
    'method': 'post',
    'url': `${import.meta.env.VITE_BACKEND_URL}/games`,
    'headers': {
      'Authorization': `Bearer ${token}`
    }
  };

  const unirme_partida = {
    'method': 'post',
    'url': `${import.meta.env.VITE_BACKEND_URL}/players/${gameAux}`,
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

  // Crear partida
  const handleClick = (event) => {
    event.preventDefault();

    axios(nueva_partida).then((response) => {
      setGame(response.data.game.id);
      console.log(response.data);
      
      localStorage.setItem("GameId", response.data.game.id);
      localStorage.setItem("Player", response.data.player.number);
    })
    .catch(err => {
      console.error(err);
      setMessage("Ocurrió un error, intente de nuevo.");
    });
    console.log('hola');
  };

  // Unirse a partida
  const handleSubmit = (event) => {
    event.preventDefault();

    axios(unirme_partida).then((response) => {
      setGame(response.data.game.id);
      console.log(response.data);
      
      localStorage.setItem("GameId", response.data.game.id);
      localStorage.setItem("Player", response.data.player.number);
    })
    .catch(error => {
      console.error(error);

      if (error.response && error.response.data && error.response.data.message) {
        setMessage(error.response.data.message);
      } else {
        setMessage("Ocurrió un error, intente de nuevo.");
      }
    });
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (game !== null) {
        axios(partida)
          .then((response) => {
            console.log(response.data);
            if (response.data.friend === 2) {
              window.location.href = `/board`;
              setRedy(true);
            }
          })
          .catch((err) => {
            console.error(err);
            setMessage(err.response.data.message);
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
      <div id="menu-container">
        {game === null ? (
          <div className="row">
            <div id="np">
              <button onClick={handleClick}>nueva partida</button>
            </div>
            <div id="form">
              <form onSubmit={handleSubmit} className="game">
                <input
                  type="id"
                  name="id"
                  className='input1'
                  value={gameAux}
                  onChange={e => setGameAux(e.target.value)}
                  placeholder="ingrese id"
                />
                <input type="submit" className='input1' value="buscar partida" />
              </form>
            </div>
            <p id="error">{message}</p>
          </div>
        ) : ready === false ? (
          <>
            <h2>el código de tu juego es: {game}</h2>
            <h3>esperando contrincante...</h3>
          </>
        ) : (
          <h2>esperando contrincante...</h2>
        )}
        <a href="/principal">atras</a>
      </div>
    </>
  );
  
  
        
}  
