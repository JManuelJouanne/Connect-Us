import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import Instructions from '../instructions/instructions';
import Us from '../us/us';
import Principal from './principal';
import Board from '../game/board'
import Login from './../profile/login';
import Signup from './../profile/signup';
import PartidaAmigo from './partidas/partida_amigo';
import PartidaRandom from './partidas/partida_random';


export default function Routing() {
    return (
        <>
        <BrowserRouter>
            <Routes>
                <Route path={"/"} element={<App/>}/>
                <Route path={"/principal"} element={<Principal/>}/>
                <Route path={"/instructions"} element={<Instructions/>}/>
                <Route path={"/us"} element={<Us/>}/>
                <Route path={"/board"} element={<Board/>}/>
                <Route path={"/login"} element={<Login/>}/>
                <Route path={"/signup"} element={<Signup/>}/>
                <Route path={"/partida_random"} element={<PartidaRandom/>}/>
                <Route path={"/partida_amigo"} element={<PartidaAmigo/>}/>
            </Routes>
        </BrowserRouter>
        </>
    )
}