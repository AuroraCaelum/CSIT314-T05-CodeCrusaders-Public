import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import "./UserProfileManagementUI.css";
import { Util } from "../Util";
import { UserLogoutController } from "../controller/UserAuthController";
import { ViewUserProfileController, CreateUserProfileController, UpdateUserProfileController } from "../controller/UserProfileController";

import Swal from 'sweetalert2';

function UserProfileManagementUI() {
    const [username] = useState(Cookies.get("username"));
    const [searchUsername, setSearchUsername] = useState("");
    const [userProfiles, setUserProfiles] = useState([
        { profileName: "Loading...", description: "Loading...", profileType: "Loading..." }
    ]);

    const fetchUserProfiles = async () => {
        const snapshot = await Util.getUserProfiles();
        if (snapshot !== null) {
            const userData = snapshot.docs.map(doc => ({
                profileName: doc.data().profileName,
                description: (desc => desc.length >= 50 ? desc.substring(0, 50) + "..." : desc)(doc.data().description),
                profileType: doc.data().profileType
            }));
            setUserProfiles(userData);
        }
    };

    useEffect(() => {
        fetchUserProfiles();
    }, []);

    if (Cookies.get("userProfile") !== "UserAdmin") {
        window.open("/CSIT314-T05-CodeCrusaders/", "_self")
    }

    const createUserProfile = () => {
        let profileNameInput, descriptionInput, profileTypeInput;
        Swal.fire({
            title: 'Create Profile',
            html: `
                <input type="text" id="profileName" class="swal2-input" placeholder="profile name">
                <input type="text" id="description" class="swal2-input" placeholder="description">
                <input type="text" id="profileType" class="swal2-input" placeholder="Profile Type">
            `,
            confirmButtonText: 'Create Profile',
            focusConfirm: false,
            didOpen: () => {
                const popup = Swal.getPopup();
                profileNameInput = popup.querySelector('#profileName');
                descriptionInput = popup.querySelector('#description');
                profileTypeInput = popup.querySelector('#profileType');

                const handleEnterKey = (event) => {
                    if (event.key === 'Enter') {
                        Swal.clickConfirm();
                    }
                };

                profileNameInput.onkeyup = handleEnterKey;
                descriptionInput.onkeyup = handleEnterKey;
                profileTypeInput.onkeyup = handleEnterKey;

            },
            preConfirm: () => {

                const profileName = profileNameInput.value;
                const description = descriptionInput.value;
                const profileType = profileTypeInput.value;

                if (!profileName || !description || !profileType) {
                    Swal.showValidationMessage(`Please fill in all the fields`);
                }
                else {
                    Swal.fire("Profile Created!");
                }

                return { profileName, description, profileType };
            },

        }).then(async (result) => {
            if (result.isConfirmed) {
                const { profileName, description, profileType } = result.value;
                const createUserProfileController = new CreateUserProfileController();
                const isSuccess = await createUserProfileController.createUserProfile(profileName, description, profileType);

                if (isSuccess){
                    console.log('New Account Details:', profileName, description, profileType );
                    fetchUserProfiles();
                } else {
                    console.log("no", profileName, description, profileType );
                }
                
                // Add logic here to handle account creation, like sending data to an API
            }
        });
    };

    const viewUserProfile = (user) => {
        Swal.fire({
            title: 'View User Profile',
            html: `
                <div style="text-align: left;">
                    <strong>Profile Name:</strong> ${user.profileName}<br>
                    <strong>Description:</strong> ${user.description}<br>
                    <strong>Type:</strong> ${user.profileType}<br>
                </div>
            `,
            showCancelButton: true,
            cancelButtonText: 'close',
            confirmButtonText: 'Update Details',
            showDenyButton: true,
            denyButtonText: 'Suspend',
            focusConfirm: false
        }).then((result) => {
            if (result.isConfirmed) {
                updateUserProfile(user);
            } else if (result.isDenied) {
                Swal.fire({
                    title: 'Are you sure?',
                    text: "You are about to suspend this user.",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonText: 'Yes, suspend it!',
                    cancelButtonText: 'No, cancel'
                }).then((suspendResult) => {
                    if (suspendResult.isConfirmed) {
                        console.log('User suspended:', user.profileName);
                        Swal.fire('Suspended!', 'The user has been suspended.', 'success');
                    }
                });
            }
        });
    };

    const updateUserProfile = (userProfile) => {
        Swal.fire({
            title: 'Update User Profile',
            html: `
                <input type="text" id="profileName" class="swal2-input" placeholder="Profile Name" value="${userProfile.profileName}">
                <input type="text" id="description" class="swal2-input" placeholder="Description" value="${userProfile.description}">
                <input type="text" id="profileType" class="swal2-input" placeholder="Profile Type" value="${userProfile.profileType}">
            `,
            confirmButtonText: 'Update',
            focusConfirm: false,
            preConfirm: () => {
                const description = document.getElementById('description').value;
                const profileName = document.getElementById('profileName').value;
                const profileType = document.getElementById('profileType').value;


                if (!profileName || !description || !profileType) {
                    Swal.showValidationMessage(`Please fill in all fields`);
                    return false;
                }
                return { profileName, description, profileType };
            }
        }).then(async (updateResult) => {
            if (updateResult.isConfirmed) {
                const { profileName, description, profileType } = updateResult.value;
                const updateUserProfileController = new UpdateUserProfileController();
                await updateUserProfileController.updateUserProfile(profileName, description, profileType);
                console.log('Updated Profile Details:', {profileName, description, profileType});
                Swal.fire('Updated!', 'The user details have been updated.', 'success');
                fetchUserProfiles();
            }
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
    };

    const searchUserProfile = (e) => {
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
                <form onSubmit={searchUserProfile}>
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
                <button onClick={createUserProfile} className="upmCreate-button">
                    Create user profile
                </button>
            </div>
            <div className="upmUser-table">
                <div className="upmTable-header">
                    <span>Profile Name</span>
                    <span>Description</span>
                    <span>Type</span>
                    <span></span>
                </div>
                {userProfiles.map((user) => (
                    <div key={user.username} className="upmTable-row">
                        <span>{user.profileName}</span>
                        <span>{user.description}</span>
                        <span>{user.profileType}</span>
                        <button onClick={() => viewUserProfile(user)} className="upmInspect-button">Inspect</button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default UserProfileManagementUI;
