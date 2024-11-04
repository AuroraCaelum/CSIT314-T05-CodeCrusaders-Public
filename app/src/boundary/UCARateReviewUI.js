import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import "./UCARateReviewUI.css";
import { UserLogoutController } from "../controller/UserAuthController";
import { ViewUserAccountController } from "../controller/UserAccountController";

import Swal from 'sweetalert2';

function UCARateReviewUI() {
    const [username] = useState(Cookies.get("username"));
    // const [searchUsername, setSearchUsername] = useState("");
    const [users, setUsers] = useState([
        { name: "Loading...", username: "Loading...", profile: "Loading..." }
    ]);

    useEffect(() => {
        const fetchUsers = async () => {
            const snapshot = await ViewUserAccountController.getUserAccountList();
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

    // if (Cookies.get("userProfile") !== "UsedCarAgent") {
    //     window.open("/", "_self")
    // }

    const viewRateReview = (user) => { //not done
        Swal.fire({
            title: 'View Used Car',
            html: `
                <div style="text-align: left;">
                    <strong>Product Name:</strong> ${user.pName}<br>
                    <strong>review:</strong> ${user.review}<br>
                    <strong>Type:</strong> ${user.type}<br>
                </div>
            `,
            showCancelButton: true,
            cancelButtonText: 'close',
            confirmButtonText: 'Update Details',
            showDenyButton: true,
            denyButtonText: 'Delete',
            focusConfirm: false
        });
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

    const handleBack = () => {
        window.history.back();
    };

    return (
        <div className="rarContainer">
            <div className="rarHeader">
                <button onClick={handleBack} className="rarBack-button">
                    Back
                </button>
                <div className="rarProfile-picture">
                    <img
                        src={"https://placehold.co/40x40?text=" + Cookies.get("username")}
                        alt="Profile"
                    />
                </div>
                <span className="rarUsername">{username}</span>
                <button onClick={handleLogout} className="rarLogout-button">
                    Logout
                </button>
            </div>

            <div className="rarUser-table">
                <div className="rarTable-header">
                    <span>Ratings:</span>
                    <span>Reviews:</span>
                    <span>Type:</span>
                    <span></span>
                </div>
                {users.map((user) => (
                    <div key={user.username} className="rarTable-row">
                        <span>{user.rating}</span>
                        <span>{user.review}</span>
                        <span>{user.type}</span>
                        <button onClick={() => viewRateReview(user)} className="rarInspect-button">
                            View
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default UCARateReviewUI;
