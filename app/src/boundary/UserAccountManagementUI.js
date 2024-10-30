import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import "./UserAccountManagementUI.css";
import { UserLogoutController } from "../controller/UserAuthController";
import { UpdateUserAccountController, ViewUserAccountController } from "../controller/UserAccountController";
import { CreateUserAccountController, SearchUserAccountController, SuspendUserAccountController } from "../controller/UserAccountController";

import Swal from 'sweetalert2';

function UserAccountManagementUI() {
    const [username] = useState(Cookies.get("username"));
    const [searchUsername, setSearchUsername] = useState("");
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
                    password: doc.data().password,
                    phone: doc.data().phoneNum,
                    email: doc.data().email,
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
                else{
                    Swal.fire("Account Created!");
                }

                return { firstName, lastName, username, password, phone, email, userProfile };
            },
        }).then(async (result) => {
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
                // logic for handle account creation (call Controller)
                const createUserAccountController = new CreateUserAccountController();
                const isSuccess = await createUserAccountController.createUserAccount(
                    firstName, 
                    lastName, 
                    username, 
                    password, 
                    phone, 
                    email, 
                    userProfile
                );
                
                if (isSuccess) {
                    console.log("User account successfully created.");
                } else {
                    console.error("Failed to create user account.");
                }
            }
        });
    };

    const handleViewUserAccount = async (username) => {
        console.log('Fetching user account for:', username);
        const viewUserAccountController = new ViewUserAccountController();
        const userAccount = await viewUserAccountController.viewUserAccount(username);
        console.log("User account data received:", userAccount);

        if (userAccount) {
            Swal.fire({
                title: 'View User Account',
                html: `
                    <div style="text-align: left;">
                        <strong>First Name:</strong> ${userAccount.fName}<br>
                        <strong>Last Name:</strong> ${userAccount.lName}<br>
                        <strong>Username:</strong> ${userAccount.username}<br>
                        <strong>Phone:</strong> ${userAccount.phoneNum || 'N/A'}<br>
                        <strong>Email:</strong> ${userAccount.email || 'N/A'}<br>
                        <strong>User Profile:</strong> ${userAccount.userProfile}<br>
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
                    handleUpdateAccount(userAccount);
                } else if (result.isDenied) {
                    Swal.fire({
                        title: 'Are you sure?',
                        text: "You are about to suspend this user.",
                        icon: 'warning',
                        showCancelButton: true,
                        confirmButtonText: 'Yes, suspend it!',
                        cancelButtonText: 'No, cancel'
                    }).then(async (suspendResult) => {
                        if (suspendResult.isConfirmed) {
                            const suspendUserAccountController = new SuspendUserAccountController();
                            const isSuspended = await suspendUserAccountController.suspendUserAccount(username);
                            
                            if (isSuspended) {
                                Swal.fire('Suspended!', 'The user has been suspended.', 'success');
                            } else {
                                Swal.fire('Failed!', 'Failed to suspend the user.', 'error');
                            }
                        }
                    });
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

    // const handleInspectAccount = (user) => {
    //     Swal.fire({
    //         title: 'View User Account',
    //         html: `
    //             <div style="text-align: left;">
    //                 <strong>First Name:</strong> ${user.name.split(' ')[0]}<br>
    //                 <strong>Last Name:</strong> ${user.name.split(' ')[1]}<br>
    //                 <strong>Username:</strong> ${user.username}<br>
    //                 <strong>Phone:</strong> ${user.phone || 'N/A'}<br>
    //                 <strong>Email:</strong> ${user.email || 'N/A'}<br>
    //                 <strong>User Profile:</strong> ${user.profile}<br>
    //             </div>
    //         `,
    //         showCancelButton: true,
    //         cancelButtonText: 'close',
    //         confirmButtonText: 'Update Details',
    //         showDenyButton: true,
    //         denyButtonText: 'Suspend',
    //         focusConfirm: false
    //     }).then((result) => {
    //         if (result.isConfirmed) {
    //             handleUpdateAccount(user);
    //         } else if (result.isDenied) {
    //             Swal.fire({
    //                 title: 'Are you sure?',
    //                 text: "You are about to suspend this user.",
    //                 icon: 'warning',
    //                 showCancelButton: true,
    //                 confirmButtonText: 'Yes, suspend it!',
    //                 cancelButtonText: 'No, cancel'
    //             }).then(async (suspendResult) => {
    //                 if (suspendResult.isConfirmed) {
    //                     const suspendUserAccountController = new SuspendUserAccountController();
    //                     const isSuspended = await suspendUserAccountController.suspendUserAccount(user.username);
                        
    //                     if (isSuspended) {
    //                         Swal.fire('Suspended!', 'The user has been suspended.', 'success');
    //                     } else {
    //                         Swal.fire('Failed!', 'Failed to suspend the user.', 'error');
    //                     }
    //                 }
    //             });
    //         }
    //     });
    // };

    const handleUpdateAccount = (userAccount) => {
        Swal.fire({
            title: 'Update User Account',
            html: `
                <input type="text" id="firstName" class="swal2-input" placeholder="First Name" value="${userAccount.fName}">
                <input type="text" id="lastName" class="swal2-input" placeholder="Last Name" value="${userAccount.lName}">
                <input type="text" id="username" class="swal2-input" placeholder="Username" value="${userAccount.username}" disabled>
                <input type="password" id="password" class="swal2-input" placeholder="Password" value="${userAccount.password}">
                <input type="text" id="phone" class="swal2-input" placeholder="Phone Number" value="${userAccount.phoneNum || ''}">
                <input type="email" id="email" class="swal2-input" placeholder="Email" value="${userAccount.email || ''}">
                <select id="userProfile" class="swal2-input">
                    <option value="">Select User Profile</option>
                    <option value="Buyer" ${userAccount.profile === "Buyer" ? "selected" : ""}>Buyer</option>
                    <option value="Seller" ${userAccount.profile === "Seller" ? "selected" : ""}>Seller</option>
                    <option value="UsedCarAgent" ${userAccount.profile === "UsedCarAgent" ? "selected" : ""}>Used Car Agent</option>
                    <option value="UserAdmin" ${userAccount.profile === "UserAdmin" ? "selected" : ""}>User Admin</option>
                </select>
            `,
            confirmButtonText: 'Update',
            focusConfirm: false,
            preConfirm: () => {
                const firstName = document.getElementById('firstName').value;
                const lastName = document.getElementById('lastName').value;
                const username = document.getElementById('username').value;
                const password = document.getElementById('password').value;
                const phone = document.getElementById('phone').value;
                const email = document.getElementById('email').value;
                const userProfile = document.getElementById('userProfile').value;
    
                if (!firstName || !lastName || !username || !phone || !email || !userProfile) {
                    Swal.showValidationMessage(`Please fill in all fields`);
                    return false;
                }
                return { firstName, lastName, username, password, phone, email, userProfile };
            }
        }).then(async (updateResult) => {
            if (updateResult.isConfirmed) {
                const { fName, lName, username, password, phoneNum, email, userProfile } = updateResult.value;
                const controller = new UpdateUserAccountController();
                const isSuccess = await controller.updateUserAccount(username, fName, lName, password, phoneNum, email, userProfile);

                if (isSuccess) {
                    Swal.fire('Updated!', 'The user details have been updated.', 'success');
                } else {
                    Swal.fire('Error!', 'Failed to update user details.', 'error');
                }
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

    const handleSearch = async (e) => {
        e.preventDefault();
        console.log("Searched Username:", searchUsername);

        const searchUserController = new SearchUserAccountController();
        const user = await searchUserController.searchUserAccount(searchUsername);

        if (user) {
            Swal.fire({
                title: 'User Found',
                text: `Username: ${user.username}, Name: ${user.name}, Profile: ${user.profile}`,
                icon: 'success',
            });
        } else {
            Swal.fire({
                title: 'User Not Found',
                text: `No user found with the username: ${searchUsername}`,
                icon: 'error',
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
                        <button onClick={() => handleViewUserAccount(user.username)} className="uamInspect-button">
                            Inspect
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default UserAccountManagementUI;
