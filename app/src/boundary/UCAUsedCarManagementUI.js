import React, { useState } from "react";
import Cookies from "js-cookie";
import './UCAUsedCarManagementUI.css';
import { UserLogoutController } from "../controller/UserAuthController";

import Swal from 'sweetalert2';

function UCAUsedCarManagementUI() {
    const [username] = useState(Cookies.get("username"))

    if (Cookies.get("userProfile") !== "UsedCarAgent") {
        window.open("/CSIT314-T05-CodeCrusaders/", "_self")
    }

    const handleUsedCarListing = () => {
        console.log("Used Car Management");
        window.open("/CSIT314-T05-CodeCrusaders/ucausedcarlisting", "_self");
    };

    const handleFeedback = () => {
        console.log("Feedback");
        window.open("/CSIT314-T05-CodeCrusaders/ucarateandreview", "_self");
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
        <div className="ucamContainer">
            <div className="ucamHeader">
                <div className="ucamUserInfo">
                    <img
                        src={"https://placehold.co/40x40?text=" + Cookies.get("username")}
                        alt="Profile"
                        className="ucamProfilePicture"
                    />
                    <span className="ucamUsername">{username}</span>
                </div>
                <button onClick={handleLogout} className="ucamLogoutButton">
                    Logout
                </button>
            </div>
            <div className="ucamButtonContainer">
                <button onClick={handleUsedCarListing} className="ucamActionButton">
                    Used Car Listing
                </button>

                <button onClick={handleFeedback} className="ucamActionButton">
                    View my Rate and Review
                </button>
            </div>
        </div>
    );
};

export default UCAUsedCarManagementUI;
