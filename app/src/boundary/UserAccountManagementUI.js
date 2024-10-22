import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import "./UserAccountManagementUI.css";
import UserAuthController from "../controller/UserAuthController";
import UserAccountController from "../controller/UserAccountController";

import Swal from 'sweetalert2';

function UserAccountManagementUI() {
    const [username] = useState(Cookies.get("username"));
    const [searchUsername, setSearchUsername] = useState("");
    const [users, setUsers] = useState([
        { name: "Loading...", username: "Loading...", profile: "Loading..." }
    ]);

    useEffect(() => {
        const fetchUsers = async () => {
            const snapshot = await UserAccountController.getUserAccountList();
            if (snapshot !== null) {
                const userData = snapshot.docs.map(doc => ({
                    name: doc.data().fName + " " + doc.data().lName,
                    username: doc.data().username,
                    profile: doc.data().userProfile
                }));
                setUsers(userData);
            }
        };

        fetchUsers();
    }, []);

    if (Cookies.get("userProfile") !== "UserAdmin") {
        window.open("/", "_self")
    }

    const handleCreateAccount = () => {
        alert("Redirecting to Account Creation Page...");
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
        <div className="uamContainer">
            <div className="uamHeader">
                <div className="uamProfile-picture">
                    <img
                        src={"https://placehold.co/40x40?text=" + Cookies.get("username")}
                        alt="Profile"
                    />
                    <span className="uamUsername">{username}</span>
                </div>
                <button onClick={handleLogout} className="uamLogout-button">
                    Logout
                </button>
            </div>
            
            <div className="uamSearch-bar">
                <form onSubmit={handleSearch}>
                    <input
                        type="text"
                        placeholder="Search by username"
                        value={searchUsername}
                        onChange={(e) => setSearchUsername(e.target.value)}
                        //className="search-input"
                    />
                    <button type="submit" className="uamSearch-button">
                        Search
                    </button>
                </form>
                <button onClick={handleCreateAccount} className="uamCreate-button">
                    Create user account
                </button>
            </div>
            <div className="uamUser-table">
                <div className="uamTable-header">
                    <span>Name:</span>
                    <span>Username:</span>
                    <span>Profile:</span>
                    <span></span>
                </div>
                {users.map((user) => (
                    <div key={user.username} className="uamTable-row">
                        <span>{user.name}</span>
                        <span>{user.username}</span>
                        <span>{user.profile}</span>
                        <button className="uamInspect-button">Inspect</button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default UserAccountManagementUI;
