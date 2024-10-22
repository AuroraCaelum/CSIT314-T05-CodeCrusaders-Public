import React, { useEffect, useState } from "react";
import './LoginUI.css';
import UserAuthController from "../controller/UserAuthController";
import UserProfileController from "../controller/UserProfileController";

import Swal from 'sweetalert2';

function LoginUI() {
    const [userProfile, setUserProfile] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [userProfiles, setUserProfiles] = useState([]);

    useEffect(() => {
        const fetchUserProfiles = async () => {
            const snapshot = await UserProfileController.getUserProfiles();
            if (snapshot !== null) {
                const userData = snapshot.docs.map(doc => ({
                    pName: doc.data().name,
                    type: doc.data().typeOfUser
                }));
                setUserProfiles(userData);
            }
        };

        fetchUserProfiles();
    }, []);

    const handleLogin = async (e) => {
        e.preventDefault();
        if (userProfile === "") {
            Swal.fire({
                position: "center",
                title: 'Invalid Input',
                icon: 'error',
                text: 'Please select user profile.',
                confirmButtonText: 'OK',
                timer: 1500
            });
        } else if (username === "" || password === "") {
            Swal.fire({
                position: "center",
                title: 'Invalid Input',
                icon: 'error',
                text: 'Please fill up username/password.',
                confirmButtonText: 'OK',
                timer: 1500
            });
        } else {
            const userAuthController = new UserAuthController();
            const loginSuccess = await userAuthController.authenticateLogin(username, password, userProfile);
            if (loginSuccess) {
                Swal.fire({
                    position: "center",
                    title: 'Login Successful',
                    icon: 'success',
                    confirmButtonText: 'OK',
                    timer: 1500
                }).then(() => {
                    window.open('/usermanagement', "_self")
                });
            } else {
                Swal.fire({
                    position: "center",
                    title: 'Login Failed',
                    icon: 'error',
                    text: 'Invalid username/password. Please try again.',
                    confirmButtonText: 'OK',
                    timer: 1500
                });
            }
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
                    {userProfiles.map((profile) => (
                        <option value={profile.type}>{profile.pName}</option>
                    ))}
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

