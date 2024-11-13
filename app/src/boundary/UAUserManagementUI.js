import React, { useState } from "react";
import Cookies from "js-cookie";
import './UAUserManagementUI.css';
import { UserLogoutController } from "../controller/UserAuthController";

import Swal from 'sweetalert2';

function UAUserManagementUI() {
    const [username] = useState(Cookies.get("username"))

    if (Cookies.get("userProfile") !== "UserAdmin") {
        window.open("/CSIT314-T05-CodeCrusaders/", "_self")
    }

    const handleAccountManagement = () => {
        console.log("User Account Management");
        window.open("/CSIT314-T05-CodeCrusaders/useraccountmanagement", "_self");
    };

    const handleAccountProfile = () => {
        console.log("User Profile Management");
        window.open("/CSIT314-T05-CodeCrusaders/userprofilemanagement", "_self");
    };

    const handleLogout = async () => {
        const userAuthController = new UserLogoutController();
        const logout = await userAuthController.logout();
        if (logout) {
            Swal.fire({
                position: "center",
                title: 'Logout Successful',
                icon: 'success',
                confirmButtonText: 'Back to login',
                timer: 1500
            }).then(() => {
                window.open("/CSIT314-T05-CodeCrusaders/", "_self")
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

export default UAUserManagementUI;
