import React, {useState} from 'react';
import './instructions.css';
import LogoutButton from './../profile/logout';

export default function Instructions() {
    const [id, setId] = useState(1);

    const next = () => {
        setId(id + 1);
    }
    const previous = () => {
        setId(id - 1);
    }

    const instructions = [
        "dos jugadores se turnarán para ir poniendo fichas en el tablero",
        "las fichas caerán hacia abajo, por lo que se selecciona una columna, y la ficha cae en el espacio correspondiente",
        "en cada turno, el jugador podrá colocar una ficha",
        "el jugador que consiga colocar 4 fichas en línea (horizontal, vertical o diagonal) ¡¡gana!!",
    ];
    
    return (
        <>
        <div className="Logout-container">
            <LogoutButton />
        </div>
        <h1>instrucciones</h1>
        <div className='rule'>
            <div className='rule-content'>
                <h2 className='n-rule'>{id}</h2>
                <p>{instructions[id - 1]}</p>
            </div>
            <div className='button-container'>
                {id!=1 && <button onClick={previous} className="next-button">&lt;&lt;</button>}
                {id!=4 && <button onClick={next} className="next-button">&gt;&gt;</button>}
            </div>
        </div>
        <div className="menu-container">
            <a class = 'button' href="/principal">volver</a>
        </div>
        </>
    )
}