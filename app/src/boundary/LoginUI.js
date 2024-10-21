import React, { useState } from "react";
import './LoginUI.css';
import './../controller/UserAuthController';
import UserAuthController from "./../controller/UserAuthController";

function LoginUI() {
    const [userProfile, setUserProfile] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();
        console.log(
            "Username:",
            username,
            "Password:",
            password,
            "UserProfile:",
            userProfile,
        );
        const userAuthController = new UserAuthController();
        const loginSuccess = await userAuthController.authenticateLogin(username, password, userProfile);
        if (loginSuccess) {
            alert("Login successful");
        } else {
            alert("Login failed");
        }
    };

    return (
        <div className="loginContainer">
            <h2 className="title">CODE CRUSADERS</h2>
            <h3 className="subtitle">USED CAR SELLING SERVICE</h3>

            <form className="form" onSubmit={handleLogin}>
                <label htmlFor="loginAs">Login As</label>
                <select
                    id="loginAs"
                    value={userProfile}
                    onChange={(e) => setUserProfile(e.target.value)}
                    className="input"
                >
                    <option value="">Select</option>
                    <option value="UserAdmin">UserAdmin</option>
                    <option value="Buyer">Buyer</option>
                    <option value="Seller">Seller</option>
                    <option value="Agent">Agent</option>
                </select>
                <label htmlFor="userId">User ID:</label>
                <input
                    type="text"
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
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

