import React, { useState , useContext, useEffect } from "react";
import { AuthContext } from "./AuthContext";
import axios from "axios";
import "./login.css";


function Login() {
    const { setToken } = useContext(AuthContext);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    const handleSubmit = (event) => {
        event.preventDefault();
        
        axios.post(`${import.meta.env.VITE_BACKEND_URL}/login`, { mail: email, password: password })
            .then((response) => {
                console.log(response);
                if (response.data.message) {
                    setMessage(response.data.message);
                }

                if (response.data.access_token) {
                    const access_token = response.data.access_token;
                    setToken(access_token);
                    window.location.href = "/principal";
                }
            }).catch((error) => {
                console.log(error);
                if (error.response && error.response.data && error.response.data.message) {
                    setMessage(error.response.data.message);
                } else {
                    setMessage("Ocurrió un error, intente de nuevo.");
                }
                setMessage(error.response.data.message);
            });
    }

    return (
        <div className="Login">
            <h1 className='title'>connect us</h1>
            <h2 className='subtitle'>Log in</h2>
            <form onSubmit={handleSubmit} className="email-form">
                <div id="container1">
                    <div id="atributes">
                        <label>Email:</label>
                        <label>Password:</label>
                    </div>
                    <div id="response">
                        <label>
                            <input
                                type="text"
                                name="email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                required
                            />
                        </label>
                        <label>
                            <input
                                type="password"
                                name="password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                required
                            />
                        </label>
                    </div>
                </div>
                <p id="error">{message}</p>
                <a href="/">volver</a>
                <input type="submit" value="Entrar" id="entrar"/>
            </form>
        </div>
    )
}

export default Login;
