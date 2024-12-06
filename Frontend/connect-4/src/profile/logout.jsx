import React, { useContext, useState } from "react";
import './login.css'
import { AuthContext } from "./AuthContext";

const LogoutButton = () => {
    const { logout } = useContext(AuthContext);
    const [message, setMessage] = useState("");

    const handleClick = () => {
        logout();
        setMessage("Cerraste Sesión");
        window.location.href = "/";
    }

    return (
        <>
            {message.length > 0 && <div className="successMsg"> {message} </div>}
            <button onClick={handleClick} id="logout" >Cerrar Sesión</button>
        </>
    )
}

export default LogoutButton;
