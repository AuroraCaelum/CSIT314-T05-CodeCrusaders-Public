import React, { useState } from "react";
import Cookies from "js-cookie";
import './BuyerMainUI.css';
import { UserLogoutController } from "../controller/UserAuthController";

import Swal from 'sweetalert2';

function BuyerManagementUI() {
    const [username] = useState(Cookies.get("username"))

    if (Cookies.get("userProfile") !== "Buyer") {
        window.open("/CSIT314-T05-CodeCrusaders/", "_self")
    }

    const handleBuyerUsedCar = () => {
        console.log("Buyer Used Car");
        window.open("/CSIT314-T05-CodeCrusaders/buyerusedcar", "_self");
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
        <div className="bmContainer">
            <div className="bmHeader">
                <div className="bmUserInfo">
                    <img
                        src={"https://placehold.co/40x40?text=" + Cookies.get("username")}
                        alt="Profile"
                        className="bmProfilePicture"
                    />
                    <span className="bmUsername">{username}</span>
                </div>
                <button onClick={handleLogout} className="bmLogoutButton">
                    Logout
                </button>
            </div>
            <div className="bmButtonContainer">
                <button onClick={handleBuyerUsedCar} className="bmActionButton">
                    Used Car Management
                </button>
            </div>
        </div>
    );
};

export default BuyerManagementUI;