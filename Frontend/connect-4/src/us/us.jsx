import Member from "./member";
import rojo from "./../assets/imgs/rojo.jpeg";
import verde from "./../assets/imgs/batman.png";
import LogoutButton from './../profile/logout';
import './member.css'

export default function Us() {
    const names = ["manuel jouanne", "vicente delpiano"];
    const description = ["cofundador del candy crash, me di vuelta el mario kart, amante de las manillas de puertas",
        "campeón mundial de cachipún bajo el agua, coleccionista de cordones de zapatillas"];
    return (
        <>
            <div className="Logout-container">
                <LogoutButton />
            </div>
            <h1>nosotros</h1>
            <h3>¡¡hola!!</h3>
            <div className="row">
                <Member name={names[0]} description={description[0]} image={rojo} />
                <Member name={names[1]} description={description[1]} image={verde} />
            </div>
            <div class="menu-container">
                <a class = 'button' href="/principal">volver</a>
            </div>
        </>
    );
}