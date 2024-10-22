import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import "./UserAccountManagementUI.css";
import UserAuthController from "../controller/UserAuthController";
import UserAccountController from "../controller/UserAccountController";

import Swal from 'sweetalert2';

function UserAccountManagementUI() {
    const [username] = useState(Cookies.get("username"));
    const [searchUsername, setSearchUsername] = useState("");
    const [users, setUsers] = useState([
        { name: "Loading...", username: "Loading...", profile: "Loading..." }
    ]);

    useEffect(() => {
        const fetchUsers = async () => {
            const snapshot = await UserAccountController.getUserAccountList();
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

    if (Cookies.get("userProfile") !== "UserAdmin") {
        window.open("/", "_self")
    }

    const handleCreateAccount = () => {
        let firstNameInput, lastNameInput, usernameInput, passwordInput, phoneInput, emailInput, userProfileInput;

        Swal.fire({
            title: 'Create Account',
            html: `
                <input type="text" id="firstName" class="swal2-input" placeholder="First Name">
                <input type="text" id="lastName" class="swal2-input" placeholder="Last Name">
                <input type="text" id="username" class="swal2-input" placeholder="Username">
                <input type="password" id="password" class="swal2-input" placeholder="Password">
                <input type="text" id="phone" class="swal2-input" placeholder="Phone Number">
                <input type="email" id="email" class="swal2-input" placeholder="Email">
                <select id="userProfile" class="swal2-input">
                    <option value="">Select User Profile</option>
                    <option value="Buyer">Buyer</option>
                    <option value="Seller">Seller</option>
                    <option value="UsedCarAgent">Used Car Agent</option>
                    <option value="UserAdmin">User Admin</option>
                </select>
            `,
            confirmButtonText: 'Create Account',
            focusConfirm: false,
            didOpen: () => {
                const popup = Swal.getPopup();
                firstNameInput = popup.querySelector('#firstName');
                lastNameInput = popup.querySelector('#lastName');
                usernameInput = popup.querySelector('#username');
                passwordInput = popup.querySelector('#password');
                phoneInput = popup.querySelector('#phone');
                emailInput = popup.querySelector('#email');
                userProfileInput = popup.querySelector('#userProfile');

                const handleEnterKey = (event) => {
                    if (event.key === 'Enter') {
                        Swal.clickConfirm();
                    }
                };

                firstNameInput.onkeyup = handleEnterKey;
                lastNameInput.onkeyup = handleEnterKey;
                usernameInput.onkeyup = handleEnterKey;
                passwordInput.onkeyup = handleEnterKey;
                phoneInput.onkeyup = handleEnterKey;
                emailInput.onkeyup = handleEnterKey;
                userProfileInput.onkeyup = handleEnterKey;
            },
            preConfirm: () => {
                const firstName = firstNameInput.value;
                const lastName = lastNameInput.value;
                const username = usernameInput.value;
                const password = passwordInput.value;
                const phone = phoneInput.value;
                const email = emailInput.value;
                const userProfile = userProfileInput.value;

                if (!firstName || !lastName || !username || !password || !phone || !email || !userProfile) {
                    Swal.showValidationMessage(`Please fill in all the fields`);
                }

                return { firstName, lastName, username, password, phone, email, userProfile };
            },
        }).then((result) => {
            if (result.isConfirmed) {
                const { firstName, lastName, username, password, phone, email, userProfile } = result.value;
                console.log('New Account Details:', {
                    firstName,
                    lastName,
                    username,
                    password,
                    phone,
                    email,
                    userProfile
                });
                // Add logic here to handle account creation, like sending data to an API
            }
        });
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
    };

    const handleSearch = (e) => {
        e.preventDefault();
        console.log("Searched Username:", searchUsername);
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
                <form onSubmit={handleSearch}>
                    <input
                        type="text"
                        placeholder="Search by username"
                        value={searchUsername}
                        onChange={(e) => setSearchUsername(e.target.value)}
                        //className="search-input"
                    />
                    <button type="submit" className="uamSearch-button">
                        Search
                    </button>
                </form>
                <button onClick={handleCreateAccount} className="uamCreate-button">
                    Create user account
                </button>
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
                        <span>{user.name}</span>
                        <span>{user.username}</span>
                        <span>{user.profile}</span>
                        <button className="uamInspect-button">Inspect</button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default UserAccountManagementUI;
