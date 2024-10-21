import React, { useState } from "react";
import "./UserAccountManagementUI.css";

function UserProfileManagementUI() {
    const [username] = useState("AdminUser");
    const [searchUsername, setSearchUsername] = useState("");
    const users = [
        { pName: "Used Car Agent", description: "User car agent who br...", type: "Used Car Agent" },
        { pName: "Seller", description: "Who wants to sell a used car", type: "Seller" },
        { pName: "Buyer", description: "Who wants to buy a used car", type: "Buyer" },
        { pName: "Admin", description: "Administrator who m...", type: "Admin" },
    ];

    const handleCreateProfile = () => {
        alert("Redirecting to Profile Creation Page...");
    };

    const handleLogout = () => {
        alert("Logging out...");
    };

    const handleSearch = (e) => {
        e.preventDefault();
        console.log("Searched Username:", searchUsername);
    };

    return (
        <div className="container">
            <div className="header">
                <img
                    className="profile-picture"
                    src="path_to_profile_picture"
                    alt="Profile"
                />
                <span className="username">{username}</span>
                <button onClick={handleLogout} className="logout-button">
                    Logout
                </button>
            </div>
            <div className="search-bar">
                <form onSubmit={handleSearch}>
                    <input
                        type="text"
                        placeholder="Search by username"
                        value={searchUsername}
                        onChange={(e) => setSearchUsername(e.target.value)}
                        className="search-input"
                    />
                    <button type="submit" className="search-button">
                        Search
                    </button>
                </form>
                <button onClick={handleCreateProfile} className="create-button">
                    Create user profile
                </button>
            </div>
            <div className="user-table">
                <div className="table-header">
                    <span>Profile Name:</span>
                    <span>Description:</span>
                    <span>Type:</span>
                    <span></span>
                </div>
                {users.map((user) => (
                    <div key={user.username} className="table-row">
                        <span>{user.pName}</span>
                        <span>{user.description}</span>
                        <span>{user.type}</span>
                        <button className="inspect-button">Inspect</button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default UserProfileManagementUI;
