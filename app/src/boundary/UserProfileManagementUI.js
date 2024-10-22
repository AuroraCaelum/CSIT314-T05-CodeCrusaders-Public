import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import "./UserProfileManagementUI.css";
import UserAuthController from "../controller/UserAuthController";
import UserProfileController from "../controller/UserProfileController";

import Swal from 'sweetalert2';

function UserProfileManagementUI() {
    const [username] = useState(Cookies.get("username"));
    const [searchUsername, setSearchUsername] = useState("");
    const [userProfiles, setUserProfiles] = useState([
        { pName: "Loading...", description: "Loading...", type: "Loading..." }
    ]);

    useEffect(() => {
        const fetchUserProfiles = async () => {
            const snapshot = await UserProfileController.getUserProfiles();
            if (snapshot !== null) {
                const userData = snapshot.docs.map(doc => ({
                    pName: doc.data().name,
                    description: (doc.data().description).substring(0, 25) + "...",
                    type: doc.data().typeOfUser
                }));
                setUserProfiles(userData);
            }
        };

        fetchUserProfiles();
    }, []);

    if (Cookies.get("userProfile") !== "UserAdmin") {
        window.open("/", "_self")
    }

    const handleCreateProfile = () => {
        alert("Redirecting to Profile Creation Page...");
    };

    const handleLogout = async () => {
        const userAuthController = new UserAuthController();
        const logout = await userAuthController.logout();
        if (logout) {
            Swal.fire({
                position: "center",
                title: 'Logout Successful',
                icon: 'success',
                confirmButtonText: 'Back to login',
                timer: 1500
            }).then(() => {
                window.open("/", "_self")
            });
        } else {
            Swal.fire({
                position: "center",
                title: 'Logout Failed',
                icon: 'error',
                confirmButtonText: 'OK',
                timer: 1500
            });
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        console.log("Searched Username:", searchUsername);
    };

    return (
        <div className="upmContainer">
            <div className="upmHeader">
                <div className="upmProfile-picture">
                    <img
                        src={"https://placehold.co/40x40?text=" + Cookies.get("username")}
                        alt="Profile"
                    />
                    <span className="upmUsername">{username}</span>
                </div>
                <button onClick={handleLogout} className="upmLogout-button">
                    Logout
                </button>
            </div>

            <div className="upmSearch-bar">
                <form onSubmit={handleSearch}>
                    <input
                        type="text"
                        placeholder="Search by username"
                        value={searchUsername}
                        onChange={(e) => setSearchUsername(e.target.value)}
                        //className="search-input"
                    />
                    <button type="submit" className="upmSearch-button">
                        Search
                    </button>
                </form>
                <button onClick={handleCreateProfile} className="upmCreate-button">
                    Create user profile
                </button>
            </div>
            <div className="upmUser-table">
                <div className="upmTable-header">
                    <span>Profile Name:</span>
                    <span>Description:</span>
                    <span>Type:</span>
                    <span></span>
                </div>
                {userProfiles.map((user) => (
                    <div key={user.username} className="upmTable-row">
                        <span>{user.pName}</span>
                        <span>{user.description}</span>
                        <span>{user.type}</span>
                        <button className="upmInspect-button">Inspect</button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default UserProfileManagementUI;
