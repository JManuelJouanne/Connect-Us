import './principal.css'
import axios from 'axios';
import React, { useState, useContext, useEffect } from 'react';
import {BrowserRouter, Routes, Route, Link, Navigate} from 'react-router-dom';
import LogoutButton from './../profile/logout';
import { AuthContext } from './../profile/AuthContext';

export default function Principal() {
  const { getUser } = useContext(AuthContext);
  const [user, setUser] = useState("");
  
  useEffect(() => {
    getUser()
        .then((response) => {
            setUser(response.data)
            console.log("Session:", response.data)
        })
        .catch((err) => console.error(err))
  }, [])
  
  return (
    <div>
      <div className="Logout-container">
        <LogoutButton />
      </div>
      <h1>connect us</h1>
      <h2>¡¡Bienvenid@ {user.username}!!</h2>
      <h3>el primero en formar una linea con 4 de sus fichas ¡¡gana!!</h3>
      <div className="menu-container">
        <div className="button-container">
          <a className="button" href='/partida_amigo'> partida con amigo </a>
          <a className="button" href="/partida_random"> partida random </a>
        </div>
        <div className="button-container">
          <a className="button" href="/instructions"> ¿cómo jugar? </a>
          <a className="button" href="/us"> sobre nosotros </a>
        </div>
      </div>
    </div>
  );
}
