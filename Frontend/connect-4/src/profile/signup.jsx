import React, { useState , useContext } from "react";
import { AuthContext } from "./AuthContext";
import axios from "axios";
import "./login.css";


function Signup() {
    const { setToken } = useContext(AuthContext);
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    const handleSubmit = (event) => {
        event.preventDefault();

        axios.post(`${import.meta.env.VITE_BACKEND_URL}/signup`, {
            mail: email,
            username: username,
            password: password
        }).then((response) => {
            console.log(response);
            if (response.data.message) {
                setMessage(response.data.message);
            }

            if (response.data.access_token) {
                const access_token = response.data.access_token;
                setToken(access_token);
                setMessage("Sign Up successful!");
                window.location.href = "/principal";
            }
        }).catch((error) => {
            console.log(error);
            setMessage(error.response.data.message);
        });
    }

    return (
        <div className="Login">
            <h1 className='title'>connect us</h1>
            <h2 className='subtitle'>Sign Up</h2>
            <form onSubmit={handleSubmit} className="email-form">
                <div id="container1">
                    <div id="atributes">
                        <label>Email:</label>
                        <label>Username:</label>
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
                                type="text"
                                name="username"
                                value={username}
                                onChange={e => setUsername(e.target.value)}
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
                <input type="submit" value="Comenzar" id="entrar"/>
            </form>
        </div>
    )
}

export default Signup;
