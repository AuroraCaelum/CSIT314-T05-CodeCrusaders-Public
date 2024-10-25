import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import "./UCAUsedCarListing.css";
import { UserLogoutController } from "../controller/UserAuthController";
import { ViewUserAccountController } from "../controller/UserAccountController";

import Swal from 'sweetalert2';

function UCAUsedCarListing() {
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

    const handleCreateUsedCar = () => {
        let prodNameInput, descriptionInput, typeInput, priceInput;

        Swal.fire({
            title: 'Create Used Car',
            html: `
                <input type="text" id="prodName" class="swal2-input" placeholder="Product Name">
                <input type="text" id="description" class="swal2-input" placeholder="Description">
                <input type="text" id="type" class="swal2-input" placeholder="type">
                <input type="price" id="price" class="swal2-input" placeholder="price">
            `,
            confirmButtonText: 'Create Account',
            focusConfirm: false,
            didOpen: () => {
                const popup = Swal.getPopup();
                prodNameInput = popup.querySelector('#prodName');
                descriptionInput = popup.querySelector('#description');
                typeInput = popup.querySelector('#type');
                priceInput = popup.querySelector('#price');

                const handleEnterKey = (event) => {
                    if (event.key === 'Enter') {
                        Swal.clickConfirm();
                    }
                };

                prodNameInput.onkeyup = handleEnterKey;
                descriptionInput.onkeyup = handleEnterKey;
                typeInput.onkeyup = handleEnterKey;
                priceInput.onkeyup = handleEnterKey;
            },
            preConfirm: () => {
                const prodName = prodNameInput.value;
                const description = descriptionInput.value;
                const type = typeInput.value;
                const price = priceInput.value;

                if (!prodName || !description || !type || !price ) {
                    Swal.showValidationMessage(`Please fill in all the fields`);
                }
                else{
                    Swal.fire("Product Listed!"); //is it ok if we change it to this instead of "Product Created!" ?
                }

                return { prodName, description, type, price };
            },
        }).then((result) => {
            if (result.isConfirmed) {
                const { prodName, description, type, price } = result.value;
                console.log('New Account Details:', {
                    prodName,
                    description,
                    type,
                    price
                });
                // Add logic here to handle account creation, like sending data to an API
            }
        });
    };

    const handleInspectAccount = (user) => { //not done
        Swal.fire({
            title: 'View Used Car',
            html: `
                <div style="text-align: left;">
                    <strong>Product Name:</strong> ${user.pName}<br>
                    <strong>Description:</strong> ${user.description}<br>
                    <strong>Type:</strong> ${user.type}<br>
                    <strong>Price:</strong> ${user.price}<br>
                </div>
            `,
            showCancelButton: true,
            cancelButtonText: 'close',
            confirmButtonText: 'Update Details',
            showDenyButton: true,
            denyButtonText: 'Delete',
            focusConfirm: false
        }).then((result) => {
            if (result.isConfirmed) {
                handleUpdateUsedCar(user);
            } else if (result.isDenied) {
                Swal.fire({
                    title: 'Are you sure?',
                    text: "You are about to Delete this product.",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonText: 'Yes, Delete it!',
                    cancelButtonText: 'No, cancel'
                }).then((DeleteResult) => {
                    if (DeleteResult.isConfirmed) {
                        console.log('User Deleted:', user.pName);
                        Swal.fire('Deleteed!', 'The product has been Deleted.', 'success');
                    }
                });
            }
        });
    };

    const handleUpdateUsedCar = (user) => {
        Swal.fire({
            title: 'Update Used Car Detail',
            html: `
                <input type="text" id="prodName" class="swal2-input" placeholder="Product Name" value="${user.prodName}">
                <input type="text" id="description" class="swal2-input" placeholder="Description" value="${user.description}">
                <input type="text" id="type" class="swal2-input" placeholder="Type" value="${user.type}">
                <input type="price" id="price" class="swal2-input" placeholder="Price">
            `,
            confirmButtonText: 'Update',
            focusConfirm: false,
            preConfirm: () => {
                const prodName = document.getElementById('prodName').value;
                const description = document.getElementById('description').value;
                const type = document.getElementById('type').value;
                const price = document.getElementById('price').value;
    
                if (!prodName || !description || !type || !price ) {
                    Swal.showValidationMessage(`Please fill in all fields`);
                    return false;
                }
                return { prodName, description, type, price };
            }
        }).then((updateResult) => {
            if (updateResult.isConfirmed) {
                const { prodName, description, type, price } = updateResult.value;
                console.log('Updated Used Car Details:', {
                    prodName,
                    description,
                    type,
                    price
                });
                Swal.fire('Updated!', 'The used car details have been updated.', 'success');
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

    const handleSearch = (e) => {
        e.preventDefault();
        console.log("Searched Username:", searchUsername);
    };

    const handleBack = () => {
        window.history.back();
    };

    return (
        <div className="uclContainer">
            <div className="uclHeader">
                <button onClick={handleBack} className="uclBack-button">
                    Back
                </button>
                <div className="uclProfile-picture">
                    <img
                        src={"https://placehold.co/40x40?text=" + Cookies.get("username")}
                        alt="Profile"
                    />
                </div>
                <span className="uclUsername">{username}</span>
                <button onClick={handleLogout} className="uclLogout-button">
                    Logout
                </button>
            </div>

            <div className="uclSearch-bar">
                <form onSubmit={handleSearch}>
                    <input
                        type="text"
                        placeholder="Used Car Name"
                        value={searchUsername}
                        onChange={(e) => setSearchUsername(e.target.value)}
                    //className="search-input"
                    />
                    <button type="submit" className="uclSearch-button">
                        Search
                    </button>
                </form>
                <button onClick={handleCreateUsedCar} className="uclCreate-button">
                    Create used Car
                </button>
            </div>
            <div className="uclUser-table">
                <div className="uclTable-header">
                    <span>Product Name:</span>
                    <span>Description:</span>
                    <span>Type:</span>
                    <span>Price:</span>
                    <span></span>
                </div>
                {users.map((user) => (
                    <div key={user.username} className="uclTable-row">
                        <span>{user.prodName}</span>
                        <span>{user.description}</span>
                        <span>{user.type}</span>
                        <span>{user.price}</span>
                        <button onClick={() => handleInspectAccount(user)} className="uclInspect-button">
                            Inspect
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default UCAUsedCarListing;
