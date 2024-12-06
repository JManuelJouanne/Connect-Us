import './board.css';
import Cell from './cell';
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import rojo from './../assets/imgs/rojo.jpeg';
import amarillo from './../assets/imgs/yellow.png';
import LogoutButton from '../profile/logout';
import { AuthContext } from './../profile/AuthContext';

const socket = io(`${import.meta.env.VITE_BACKEND_URL}`);

export default function Board() {
  const { token } = useContext(AuthContext);  
  const [cells, setCells] = useState([]);
  const [turn, setTurn] = useState(0);
  const game = parseInt(localStorage.getItem("GameId"));
  const player = parseInt(localStorage.getItem("Player"));
  const [message, setMessage] = useState("Cargando tablero...");
  const [winner, setWinner] = useState(0);

  // requests
  const buscar_cells = {
    'method': 'get',
    'url': `${import.meta.env.VITE_BACKEND_URL}/cells/${game}`,
    'headers': {'Authorization': `Bearer ${token}`}
  };

  const start = {
    'method': 'get',
    'url': `${import.meta.env.VITE_BACKEND_URL}/players/start/${game}`,
    'headers': {'Authorization': `Bearer ${token}`}
  };

  // Socket
  useEffect(() => {
    socket.on('connect', () => {
      console.log('Conexión establecida con el servidor WebSocket');
    });

    socket.on('response', (response) => {
      const data = response.response
      // console.log('Celda:', data.cell)
      
      // console.log(data.cell.gameId, '=', game)
      if (data.game === game) {
        setMessage(data.message)
        if (data.board) {
          setCells(data.board);
          if (data.message.includes("Ganó")) {
            setTurn(0)
            setWinner(parseInt(data.cell.status))
          } else {
            setTurn((data.cell.status % 2) + 1);
          }
        }
      } else {
        // console.log('No se encontró la celda') /
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [token]);

  // Seteo inicial
  useEffect(() => {
    axios(buscar_cells).then(response => {
      setCells(response.data);
    }).catch(err => {
      console.error(err);
    });

    axios(start).then(response => {
    setMessage(response.data.message);
    setTurn(response.data.turn);
    setWinner(parseInt(response.data.winner));
    }).catch(err => {
      console.error(err);
    });
  }, []);

  // hacemos el handleClick
  const handleCellClick = id => {
    const clickedCell = cells.find(cell => cell.id === id);
    const clickedColumn = clickedCell.column;
    try {
      const data = {
        gameId: game,
        column: clickedColumn,
        player: player
      };
      socket.emit('message', data);
      console.log('Mensaje enviado:', data);
    } catch (err) {
      console.error(err);
      setMessage('Ocurrió un error')
    }
  };

  // Seteo de imagen
  useEffect(() => {
    if (winner !== 0) {
      getImageSource();
    }
    if (turn !== 0) {
      getImageSource();
    }
  }, [winner, turn]);

  const getImageSource = () => {
    if (turn === 1) {
      return rojo;
    } else if (turn === 2) {
      return amarillo;
    } else {
      if (winner === 1) {
        return rojo;
      } else if (winner === 2) {
        return amarillo;
      } else {
        console.log('No hay ganador');
      }
    }
  };

  return (
    <div>
      <div className="Logout-container">
        <LogoutButton />
      </div>
      <div className="turnos">
        {message}
        <img id="imagen" src={getImageSource()} alt="" />
      </div>
      <div id="board">
        {turn === player ? (
          <>
            {cells.map(cell => (
              <Cell key={cell.id} id={cell.id} status={cell.status} onClick={() => handleCellClick(cell.id)} />
            ))}
          </>
        ) : (
          <>
            {cells.map(cell => (
              <Cell key={cell.id} id={cell.id} status={cell.status} />
            ))}
          </>
        )}
      </div>
      <div className="menu-container">
        <a className="button" id="tablero" href="/principal">
          Salir
        </a>
      </div>
    </div>
  );
};

