import React, { useState } from "react";
import "./UserAccountManagementUI.css";

function UserAccountManagementUI() {
    const [username] = useState("AdminUser");
    const [searchUsername, setSearchUsername] = useState("");
    const users = [
        { name: "Alice", username: "alice001", profile: "Used Car Agent" },
        { name: "Bob", username: "bob.the.builder", profile: "Seller" },
        { name: "Jeremy", username: "jeremy001", profile: "Buyer" },
        { name: "Lily", username: "lilywhite", profile: "Admin" },
    ];

    const handleCreateAccount = () => {
        alert("Redirecting to Account Creation Page...");
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
                <button onClick={handleCreateAccount} className="create-button">
                    Create user account
                </button>
            </div>
            <div className="user-table">
                <div className="table-header">
                    <span>Name:</span>
                    <span>Username:</span>
                    <span>Profile:</span>
                    <span></span>
                </div>
                {users.map((user) => (
                    <div key={user.username} className="table-row">
                        <span>{user.name}</span>
                        <span>{user.username}</span>
                        <span>{user.profile}</span>
                        <button className="inspect-button">Inspect</button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default UserAccountManagementUI;
