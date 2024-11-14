import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import "./UAUserProfileManagementUI.css";
import { Util } from "../Util";
import { UserLogoutController } from "../controller/UserAuthController";
import { UAViewUserProfileController, UACreateUserProfileController, UAUpdateUserProfileController, UASearchUserProfileController, UASuspendUserProfileController } from "../controller/UAUserProfileController";

import Swal from 'sweetalert2';

function UAUserProfileManagementUI() {
    const [username] = useState(Cookies.get("username"));
    const [searchProfileName, setSearchProfileName] = useState("");
    const [userProfiles, setUserProfiles] = useState([]);

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
                <div class="upm-wrapper">
                    <div class="item">
                        <label>Profile Name</label>
                        <input type="text" id="profileName" class="swal2-input" placeholder="Profile Name">
                    </div>
                    <div class="item">
                        <label>Description</label>
                        <input type="text" id="description" class="swal2-input" placeholder="Description">
                    </div>
                    <div class="item">
                        <label>Profile Type</label>
                        <select id="profileType" class="swal2-select">
                            <option value="">Select Profile Type</option>
                            <option value="UserAdmin">User Admin</option>
                            <option value="UsedCarAgent">Used Car Agent</option>
                            <option value="Buyer">Buyer</option>
                            <option value="Seller">Seller</option>
                        </select>
                    </div>
                </div>
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
                    Swal.showValidationMessage('Invalid input. Please try again.');
                    return false;
                }
                return { profileName, description, profileType };
            },
        }).then(async (result) => {
            if (result.isConfirmed) {
                const { profileName, description, profileType } = result.value;
                const uaCreateUserProfileController = new UACreateUserProfileController();
                const isSuccess = await uaCreateUserProfileController.createUserProfile(profileName, description, profileType);

                if (isSuccess) {
                    Swal.fire('Profile created!');
                    fetchUserProfiles();
                } else {
                    Swal.fire('Profile creation failed. Please try again.')
                }

                // Add logic here to handle account creation, like sending data to an API
            }
        });
    };

    const viewUserProfile = async (profileName) => {
        console.log('Fetching user account for:', profileName);
        const uaViewUserProfileController = new UAViewUserProfileController();
        const userProfile = await uaViewUserProfileController.viewUserProfile(profileName);
        console.log("User profile data received:", userProfile);

        if (userProfile) {
            Swal.fire({
                title: 'View User Profile',
                html: `
                    <div style="text-align: left; line-height: 1.5em;">
                        <strong>Profile Name:</strong> ${userProfile.profileName}<br>
                        <strong>Description:</strong> ${userProfile.description}<br>
                        <strong>Type:</strong> ${userProfile.profileType}<br>
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
                    updateUserProfile(userProfile);
                } else if (result.isDenied) {
                    suspendUserProfile(profileName);
                }
            });
            console.log(userProfile);
            console.log("display success in UI for: ", profileName);
        } else {
            console.error("Failed to load profile information:", profileName);
            Swal.fire({
                title: 'Error',
                text: 'Failed to load profile information.',
                icon: 'error',
                confirmButtonText: 'Close'
            });
        }
    };

    const updateUserProfile = (userProfile) => {
        Swal.fire({
            title: 'Update User Profile',
            html: `
                <div class="upm-wrapper">
                    <div class="item">
                        <label>Profile Name</label>
                        <input type="text" id="profileName" class="swal2-input" placeholder="Profile Name" value="${userProfile.profileName}" disabled>
                    </div>
                    <div class="item">
                        <label>Description</label>
                        <input type="text" id="description" class="swal2-input" placeholder="Description" value="${userProfile.description}">
                    </div>
                    <div class="item">
                        <label>Profile Type</label>
                        <select id="profileType" class="swal2-select">
                            <option value="">Select Profile Type</option>
                            <option value="Buyer" ${userProfile.profileType === "Buyer" ? "selected" : ""}>Buyer</option>
                            <option value="Seller" ${userProfile.profileType === "Seller" ? "selected" : ""}>Seller</option>
                            <option value="UsedCarAgent" ${userProfile.profileType === "UsedCarAgent" ? "selected" : ""}>Used Car Agent</option>
                            <option value="UserAdmin" ${userProfile.profileType === "UserAdmin" ? "selected" : ""}>User Admin</option>
                        </select>
                    </div>
                </div>
            `,
            confirmButtonText: 'Update',
            focusConfirm: false,
            preConfirm: () => {
                const description = document.getElementById('description').value;
                const profileName = document.getElementById('profileName').value;
                const profileType = document.getElementById('profileType').value;


                console.log("after input update value: ",profileName, description, profileType);
                if (!profileName || !description || !profileType) {
                    Swal.showValidationMessage('Input must be filled. Please try again.');
                    return false;
                }
                return { profileName, description, profileType };
            }
        }).then(async (updateResult) => {
            if (updateResult.isConfirmed) {
                const { profileName, description, profileType } = updateResult.value;
                const uaUpdateUserProfileController = new UAUpdateUserProfileController();
                const isSuccess = await uaUpdateUserProfileController.updateUserProfile(profileName, description, profileType);
                console.log('Updated Profile Details:', { profileName, description, profileType });

                if (isSuccess) {
                    Swal.fire('Updated!', 'Details updated!.', 'success');
                } else {
                    Swal.fire('Failed', 'Profile detail update failed. Please try again.', 'error');
                }
                fetchUserProfiles();
            }
        });
    };

    const suspendUserProfile = async (profileName) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You are about to suspend this user profile.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, suspend it!',
            cancelButtonText: 'No, cancel.'
        }).then(async (suspendResult) => {
            if (suspendResult.isConfirmed) {
                const uaSuspendUserProfileController = new UASuspendUserProfileController();
                const isSuspended = await uaSuspendUserProfileController.suspendUserProfile(profileName);
                console.log('User suspended:', profileName);

                if (isSuspended) {
                    Swal.fire('Suspended!', 'The user profile has been suspended.', 'success');
                } else {
                    Swal.fire('Failed!', 'Error occurred while suspending the user profile! Please try again.', 'error');
                }
            }
        });
    }

    const searchUserProfile = async () => {

        const profileNameInput = document.getElementById('searchProfileName');

        const filterCriteria = {
            profileName: profileNameInput ? profileNameInput.value : ''
        };

        const uaSearchUserProfileController = new UASearchUserProfileController();
        const searchResult = await uaSearchUserProfileController.searchUserProfile(filterCriteria.profileName);

        console.log(searchResult)


        if (searchResult === null) {
            console.log("Search results:", searchResult);
            Swal.fire({
                title: 'No Results',
                text: 'No user profile found matching the search criteria.',
                icon: 'info',
                confirmButtonText: 'OK'
            });
        } else {
            const profileData = searchResult.map(doc => ({
                profileName: doc.profileName,
                description: doc.description,
                profileType: doc.profileType
            }));
            setUserProfiles(profileData);
        }
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
                <span>
                        <input id="searchProfileName" className="upmSearch-input" placeholder="Search by profile name"/>
                        <button onClick={searchUserProfile} className="upmSearch-button">
                                Search
                        </button>
                    </span>
                    <span>
                        <button onClick={createUserProfile} className="upmCreate-button">
                            Create user profile
                        </button>
                    </span>
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
                        <button onClick={() => viewUserProfile(user.profileName)} className="upmInspect-button">Inspect</button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default UAUserProfileManagementUI;
