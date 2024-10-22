import React, { useState } from "react";
import Cookies from "js-cookie";
import './UserManagementUI.css';
import UserAuthController from "../controller/UserAuthController";

import Swal from 'sweetalert2';

function UserManagementUI() {
    const [username] = useState(Cookies.get("username"))

    if (Cookies.get("userProfile") !== "UserAdmin") {
        window.open("/", "_self")
    }

    const handleAccountManagement = () => {
        console.log("User Account Management");
        window.open("/useraccountmanagement", "_self");
    };

    const handleAccountProfile = () => {
        console.log("User Profile Management");
        window.open("/userprofilemanagement", "_self");
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
    }

    return (
        <div className="umContainer">
            <div className="umHeader">
            <div className="umUserInfo">
                    <img 
                        src={"https://placehold.co/40x40?text=" + Cookies.get("username")}
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
