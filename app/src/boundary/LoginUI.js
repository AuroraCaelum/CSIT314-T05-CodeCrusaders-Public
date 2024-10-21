import React, { useState } from "react";
import './LoginUI.css'; 

function LoginUI() {
    const [loginAs, setLoginAs] = useState("");
    const [userId, setUserId] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = (e) => {
        e.preventDefault();
        // Handle login logic
        console.log(
            "Login as:",
            loginAs,
            "User ID:",
            userId,
            "Password:",
            password
        );
    };

    return (
        <div className="loginContainer">
            <h2 className="title">CODE CRUSADERS</h2>
            <h3 className="subtitle">USED CAR SELLING SERVICE</h3>

            <form className="form" onSubmit={handleLogin}>
                <label htmlFor="loginAs">Login As</label>
                <select
                    id="loginAs"
                    value={loginAs}
                    onChange={(e) => setLoginAs(e.target.value)}
                    className="input"
                >
                    <option value="">Select</option>
                    <option value="Admin">Admin</option>
                    <option value="Buyer">Buyer</option>
                    <option value="Seller">Seller</option>
                    <option value="Agent">Agent</option>
                </select>
                <label htmlFor="userId">User ID:</label>
                <input
                    type="text"
                    id="userId"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                    className="input"
                    placeholder="Enter your user ID"
                />
                <label htmlFor="password">Password:</label>
                <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input"
                    placeholder="Enter your password"
                />
                <button type="submit" className="button">
                    Login
                </button>
            </form>
        </div>
    );
};

export default LoginUI;

