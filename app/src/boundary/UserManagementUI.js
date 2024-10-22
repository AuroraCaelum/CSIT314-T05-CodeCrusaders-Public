import React, { useState } from "react";
import './UserManagementUI.css'; 

function UserManagementUI() {
    const [username] = useState("AdminUser")

    const handleAccountManagement = () => {
        console.log("User Account Management");
        alert("Redirecting to User Account Management Page...");
    };

    const handleAccountProfile = () => {
        console.log("User Profile Management");
        alert("Redirecting to User Profile Management Page...");
    };

    const handleLogout = () => {
        console.log("Logging out");
        alert("Logging out...")
    }

    return (
        <div className="umContainer">
            <div className="umHeader">
            <div className="umUserInfo">
                    <img 
                        src="https://via.placeholder.com/40" 
                        alt="Profile" 
                        className="umProfilePicture" 
                    />
                    <span className="umUsername">{username}</span>
                </div>                
                <button onClick={handleLogout} className="umLogoutButton">
                    Logout
                </button>
            </div>
            <div className="umButtonContainer">
                <button onClick={handleAccountManagement} className="umActionButton">
                    User Account Management
                </button>

                <button onClick={handleAccountProfile} className="umActionButton">
                    User Profile Management
                </button>
            </div>
        </div>
    );
};

export default UserManagementUI;
