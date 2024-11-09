import React, { useEffect, useState } from "react";
import Cookies from 'js-cookie';
import './LoginUI.css';
import { Util } from "../Util";
import { UserLoginController } from "../controller/UserAuthController";

import Swal from 'sweetalert2';

function LoginUI() {
    const [userProfile, setUserProfile] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [userProfiles, setUserProfiles] = useState([]);

    useEffect(() => {
        const fetchUserProfiles = async () => {
            const snapshot = await Util.getUserProfiles();
            if (snapshot !== null) {
                const userData = snapshot.docs
                    .filter(doc => !doc.data().suspended)
                    .map(doc => ({
                        profileName: doc.data().profileName,
                        profileType: doc.data().profileType
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
            const userLoginController = new UserLoginController();
            const loginSuccess = await userLoginController.authenticateLogin(username, password, userProfile);
            if (loginSuccess) {
                Swal.fire({
                    position: "center",
                    title: 'Login Successful',
                    icon: 'success',
                    confirmButtonText: 'OK',
                    timer: 1500
                }).then(() => {
                    const selectedProfile = userProfiles.find(profile => profile.profileName === userProfile);
                    console.log(selectedProfile.profileType);
                    const userProfileType = selectedProfile.profileType;
                    Cookies.set('username', username);
                    Cookies.set('userProfile', userProfileType);
                    if (userProfileType === "UserAdmin") window.open('/CSIT314-T05-CodeCrusaders/usermanagement', "_self")
                    else if (userProfileType === "UsedCarAgent") window.open('/CSIT314-T05-CodeCrusaders/usedcarmanagement', "_self")
                    else if (userProfileType === "Buyer") window.open('/CSIT314-T05-CodeCrusaders/buyerusedcar', "_self")
                    else if (userProfileType === "Seller") window.open('/CSIT314-T05-CodeCrusaders/sellerusedcar', "_self")
                });
            } else {
                Swal.fire({
                    position: "center",
                    title: 'Login Failed',
                    icon: 'error',
                    html: 'Invalid username/password. Please try again.<br><br><small>If you entered the correct username and password, your account may have been suspended. Please contact the administrator.</small>',
                    confirmButtonText: 'OK',
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
                        <option value={profile.profileName}>{profile.profileName}</option>
                    ))}
                </select>
                <label htmlFor="userId">Username:</label>
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

