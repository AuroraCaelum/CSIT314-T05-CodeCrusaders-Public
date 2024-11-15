import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import "./UAUserAccountManagementUI.css";
import { Util } from "../Util";
import { UserLogoutController } from "../controller/UserAuthController";
import { UACreateUserAccountController, UAViewUserAccountController, UAUpdateUserAccountController, UASuspendUserAccountController, UASearchUserAccountController } from "../controller/UAUserAccountController";

import Swal from 'sweetalert2';

function UAUserAccountManagementUI() {
    const [username] = useState(Cookies.get("username"));
    const [searchUsername, setSearchUsername] = useState("");
    const [users, setUsers] = useState([]);
    const [profiles, setUserProfiles] = useState([]);


    const fetchUsers = async () => {
        const snapshot = await Util.getUserAccountList();
        if (snapshot !== null) {
            const userData = snapshot.docs.map(doc => ({
                fName: doc.data().fName,
                lName: doc.data().lName,
                username: doc.data().username,
                password: doc.data().password,
                phone: doc.data().phoneNum,
                email: doc.data().email,
                profile: doc.data().userProfile
            }));
            setUsers(userData);
        }
    };

    const fetchUserProfiles = async () => {
        const snapshot = await Util.getUserProfiles();
        if (snapshot !== null) {
            const profileData = snapshot.docs
                .filter(doc => !doc.data().suspended)
                .map(doc => ({
                    profileName: doc.data().profileName,
                    profileType: doc.data().profileType
                }));
            setUserProfiles(profileData);
        }
    };

    useEffect(() => {
        fetchUsers();
        fetchUserProfiles();
    }, []);

    if (Cookies.get("userProfile") !== "UserAdmin") {
        window.open("/CSIT314-T05-CodeCrusaders/", "_self")
    }

    const createUserAccount = () => {
        let usernameInput, fNameInput, lNameInput, passwordInput, phoneNumInput, emailInput, userProfileInput;
        // console.log(profiles);
        Swal.fire({
            title: 'Create Account',
            width: 800,
            html: `
                <div class="uam-wrapper" style="grid-template-columns: 1fr 1fr;">
                    <div class="item">
                        <label>First Name</label>
                        <input type="text" id="fName" class="swal2-input" placeholder="First Name">
                    </div>
                    <div class="item">
                        <label>Lase Name</label>
                        <input type="text" id="lName" class="swal2-input" placeholder="Last Name">
                    </div>
                    <div class="item">
                        <label>Username</label>
                        <input type="text" id="username" class="swal2-input" placeholder="Username">
                    </div>
                    <div class="item">
                        <label>Password</label>
                        <input type="password" id="password" class="swal2-input" placeholder="Password">
                    </div>
                    <div class="item">
                        <label>Phone Number</label>
                        <input type="text" id="phoneNum" class="swal2-input" placeholder="Phone Number">
                    </div>
                    <div class="item">
                        <label>Email</label>
                        <input type="email" id="email" class="swal2-input" placeholder="Email">
                    </div>
                    <div class="item" style="grid-column: span 2">
                        <label>User Profile</label>
                        <select id="userProfile" class="swal2-input">
                           <option value="">Select User Profile</option>
                        </select>
                    </div>
                </div>
            `,
            confirmButtonText: 'Create Account',
            focusConfirm: false,
            didOpen: () => {
                var select = document.getElementById('userProfile');

                for (var i = 0; i < profiles.length; i++) {
                    var opt = document.createElement('option');
                    opt.value = profiles[i].profileName;
                    opt.innerHTML = profiles[i].profileName;
                    select.appendChild(opt);
                }

                const popup = Swal.getPopup();
                fNameInput = popup.querySelector('#fName');
                lNameInput = popup.querySelector('#lName');
                usernameInput = popup.querySelector('#username');
                passwordInput = popup.querySelector('#password');
                phoneNumInput = popup.querySelector('#phoneNum');
                emailInput = popup.querySelector('#email');
                userProfileInput = popup.querySelector('#userProfile');

                const handleEnterKey = (event) => {
                    if (event.key === 'Enter') {
                        Swal.clickConfirm();
                    }
                };

                fNameInput.onkeyup = handleEnterKey;
                lNameInput.onkeyup = handleEnterKey;
                usernameInput.onkeyup = handleEnterKey;
                passwordInput.onkeyup = handleEnterKey;
                phoneNumInput.onkeyup = handleEnterKey;
                emailInput.onkeyup = handleEnterKey;
                userProfileInput.onkeyup = handleEnterKey;
            },
            preConfirm: () => {
                const fName = fNameInput.value;
                const lName = lNameInput.value;
                const username = usernameInput.value;
                const password = passwordInput.value;
                const phoneNum = phoneNumInput.value;
                const email = emailInput.value;
                const userProfile = userProfileInput.value;

                if (!username || !fName || !lName || !password || !phoneNum || !email || !userProfile) {
                    Swal.showValidationMessage('Invalid input. Please try again.');
                    return false;
                }
                return { username, fName, lName, password, phoneNum, email, userProfile };
            },
        }).then(async (result) => {
            if (result.isConfirmed) {
                const { username, fName, lName, password, phoneNum, email, userProfile } = result.value;
                console.log('New Account Details:', { fName, lName, username, password, phoneNum, email, userProfile });
                // logic for handle account creation (call Controller)
                const uaCreateUserAccountController = new UACreateUserAccountController();
                const isSuccess = await uaCreateUserAccountController.createUserAccount(username, fName, lName, password, phoneNum, email, userProfile);

                if (isSuccess) {
                    Swal.fire("Account created!")
                } else {
                    Swal.fire("Account creation failed. Please try again.");
                }
            }
        });
    };

    const viewUserAccount = async (username) => {
        console.log('Fetching user account for:', username);
        const uaViewUserAccountController = new UAViewUserAccountController();
        const userAccount = await uaViewUserAccountController.viewUserAccount(username);
        console.log("User account data received:", userAccount);

        if (userAccount) {
            Swal.fire({
                title: 'View User Account',
                html: `
                    <div style="text-align: left; line-height: 1.5em;">
                        <strong>First Name:</strong> ${userAccount.fName}<br>
                        <strong>Last Name:</strong> ${userAccount.lName}<br>
                        <strong>Username:</strong> ${userAccount.username}<br>
                        <strong>Phone:</strong> ${userAccount.phoneNum || 'N/A'}<br>
                        <strong>Email:</strong> ${userAccount.email || 'N/A'}<br>
                        <strong>User Profile:</strong> ${userAccount.userProfile}<br>
                    </div>
                `,
                showCancelButton: true,
                cancelButtonText: 'Close',
                confirmButtonText: 'Update Details',
                showDenyButton: true,
                denyButtonText: 'Suspend',
                focusConfirm: false
            }).then((result) => {
                if (result.isConfirmed) {
                    updateUserAccount(userAccount);
                } else if (result.isDenied) {
                    suspendUserAccount(username);
                }
            });
            console.log(userAccount);
            console.log("display success in UI for: ", username);
        } else {
            console.error("Failed to load user information:", username);
            Swal.fire({
                title: 'Error',
                text: 'Failed to load user information.',
                icon: 'error',
                confirmButtonText: 'Close'
            });
        }
    };

    const updateUserAccount = (userAccount) => {

        Swal.fire({
            title: 'Update User Account',
            width: 800,
            html: `
                <div class="uam-wrapper" style="grid-template-columns: 1fr 1fr;">
                    <div class="item">
                        <label>First Name</label>
                        <input type="text" id="fName" class="swal2-input" placeholder="First Name" value="${userAccount.fName}">
                    </div>
                    <div class="item">
                        <label>Lase Name</label>
                        <input type="text" id="lName" class="swal2-input" placeholder="Last Name" value="${userAccount.lName}">
                    </div>
                    <div class="item">
                        <label>Username</label>
                        <input type="text" id="username" class="swal2-input" placeholder="Username" value="${userAccount.username}" disabled>
                    </div>
                    <div class="item">
                        <label>Password</label>
                        <input type="password" id="password" class="swal2-input" placeholder="Password" value="${userAccount.password}">
                    </div>
                    <div class="item">
                        <label>Phone Number</label>
                        <input type="text" id="phoneNum" class="swal2-input" placeholder="Phone Number" value="${userAccount.phoneNum || ''}">
                    </div>
                    <div class="item">
                        <label>Email</label>
                        <input type="email" id="email" class="swal2-input" placeholder="Email" value="${userAccount.email || ''}">
                    </div>
                    <div class="item" style="grid-column: span 2">
                        <label>User Profile</label>
                        <select id="userProfile" class="swal2-input">
                           <option value="">Select User Profile</option>
                        </select>
                    </div>
                </div>
            `,
            confirmButtonText: 'Update',
            focusConfirm: false,
            didOpen: () => {
                var select = document.getElementById('userProfile');

                for (var i = 0; i < profiles.length; i++) {
                    var opt = document.createElement('option');
                    var profileName = profiles[i].profileName;
                    opt.value = profileName;
                    console.log(userAccount.userProfile, profileName)
                    if (userAccount.userProfile === profileName) {
                        opt.selected = true;
                    }
                    opt.innerHTML = profileName;
                    select.appendChild(opt);
                }
            },
            preConfirm: () => {
                const fName = document.getElementById('fName').value;
                const lName = document.getElementById('lName').value;
                const username = document.getElementById('username').value;
                const password = document.getElementById('password').value;
                const phoneNum = document.getElementById('phoneNum').value;
                const email = document.getElementById('email').value;
                const userProfile = document.getElementById('userProfile').value;

                if (!username || !fName || !lName || !phoneNum || !email || !userProfile) {
                    Swal.showValidationMessage('Input must be filled. Please try again.');
                    return false;
                }
                return { username, fName, lName, password, phoneNum, email, userProfile };
            }
        }).then(async (updateResult) => {
            if (updateResult.isConfirmed) {
                const { username, fName, lName, password, phoneNum, email, userProfile } = updateResult.value;
                const uaUpdateUserAccountController = new UAUpdateUserAccountController();
                const isSuccess = await uaUpdateUserAccountController.updateUserAccount(username, fName, lName, password, phoneNum, email, userProfile);

                if (isSuccess) {
                    Swal.fire('Updated!', 'Account details updated!.', 'success');
                } else {
                    Swal.fire('Error!', 'Account detail update failed. Please try again.', 'error');
                }
            }
        });
    };

    const suspendUserAccount = async (username) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You are about to suspend this user account.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, suspend it!',
            cancelButtonText: 'No, cancel.'
        }).then(async (suspendResult) => {
            if (suspendResult.isConfirmed) {
                const uaSuspendUserAccountController = new UASuspendUserAccountController();
                const isSuspended = await uaSuspendUserAccountController.suspendUserAccount(username);

                if (isSuspended) {
                    Swal.fire('Suspended!', 'The user account has been suspended.', 'success');
                } else {
                    Swal.fire('Failed!', 'Error occurred while suspending the user account! Please try again.', 'error');
                }
            }
        });
    }

    const searchUserAccount = async () => {
        const usernameInput = document.getElementById('searchUsername');

        const filterCriteria = {
            username: usernameInput ? usernameInput.value : ''
        };

        const uaSearchUserAccountController = new UASearchUserAccountController();
        const searchResult = await uaSearchUserAccountController.searchUserAccount(filterCriteria.username);

        console.log(searchResult)


        if (searchResult === null) {
            console.log("Search results:", searchResult);
            Swal.fire({
                title: 'No Results',
                text: 'No user account found matching the search criteria.',
                icon: 'info',
                confirmButtonText: 'OK'
            });
            return;
        } else {
            const accountData = searchResult.map(doc => ({
                fName: doc.fName,
                lName: doc.lName,
                username: doc.username,
                password: doc.password,
                phone: doc.phoneNum,
                email: doc.email,
                profile: doc.userProfile
            }));
            setUsers(accountData);
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
        <div className="uamContainer">
            <div className="uamHeader">
                <button onClick={handleBack} className="uamBack-button">
                    Back
                </button>
                <div className="uamProfile-picture">
                    <img
                        src={"https://placehold.co/40x40?text=" + Cookies.get("username")}
                        alt="Profile"
                    />
                </div>
                <span className="uamUsername">{username}</span>
                <button onClick={handleLogout} className="uamLogout-button">
                    Logout
                </button>
            </div>

            <div className="uamSearch-bar">
                <span>
                    <input id="searchUsername" className="uamSearch-input" placeholder="Search by username" />
                    <button onClick={searchUserAccount} className="uamSearch-button">
                        Search
                    </button>
                </span>

                <span>
                    <button onClick={createUserAccount} className="uamCreate-button">
                        Create user account
                    </button>
                </span>
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
                        <span>{`${user.fName} ${user.lName}`}</span>
                        <span>{user.username}</span>
                        <span>{user.profile}</span>
                        <button onClick={() => viewUserAccount(user.username)} className="uamInspect-button">
                            Inspect
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default UAUserAccountManagementUI;
