import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import "./UserProfileManagementUI.css";
import { UserLogoutController } from "../controller/UserAuthController";
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
        let profileNameInput, descriptionInput, typeInput;
        Swal.fire({
            title: 'Create Profile',
            html: `
                <input type="text" id="profileName" class="swal2-input" placeholder="profile name">
                <input type="text" id="description" class="swal2-input" placeholder="description">
                <input type="text" id="type" class="swal2-input" placeholder="type">
            `,
            confirmButtonText: 'Create Profile',
            focusConfirm: false,
            didOpen: () => {
                const popup = Swal.getPopup();
                profileNameInput = popup.querySelector('#profileName');
                descriptionInput = popup.querySelector('#description');
                typeInput = popup.querySelector('#type');

                const handleEnterKey = (event) => {
                    if (event.key === 'Enter') {
                        Swal.clickConfirm();
                    }
                };

                profileNameInput.onkeyup = handleEnterKey;
                descriptionInput.onkeyup = handleEnterKey;
                typeInput.onkeyup = handleEnterKey;

            },
            preConfirm: () => {
                const pName = profileNameInput.value;
                const description = descriptionInput.value;
                const type = typeInput.value;

                if (!pName || !description || !type) {
                    Swal.showValidationMessage(`Please fill in all the fields`);
                }
                else{
                    Swal.fire("Profile Created!");
                }

                return { pName, description, type };
            },

        }).then((result) => {
            if (result.isConfirmed) {
                const { pName, description, type } = result.value;
                console.log('New Account Details:', {
                    pName,
                    description,
                    type
                });
                // Add logic here to handle account creation, like sending data to an API
            }
        });
    };

    const handleInspectProfile = (user) => {
        Swal.fire({
            title: 'View User Profile',
            html: `
                <div style="text-align: left;">
                    <strong>Profile Name:</strong> ${user.pName}<br>
                    <strong>Description:</strong> ${user.description}<br>
                    <strong>Type:</strong> ${user.type}<br>
                </div>
            `,
            confirmButtonText: 'Close',
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

    const handleSearch = (e) => {
        e.preventDefault();
        console.log("Searched Username:", searchUsername);
    };

    const handleBack = () => {
        window.history.back();
    };

    return (
        <div className="upmContainer">
            <div className="upmHeader">
                <button onClick={handleBack} className="upmBack-button">
                    Back
                </button>
                <div className="upmProfile-picture">
                    <img
                        src={"https://placehold.co/40x40?text=" + Cookies.get("username")}
                        alt="Profile"
                    />
                </div>
                <span className="upmUsername">{username}</span>
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
                        <button onClick={() => handleInspectProfile(user)}className="upmInspect-button">Inspect</button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default UserProfileManagementUI;
