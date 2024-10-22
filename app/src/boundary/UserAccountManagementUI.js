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
        <div className="uamContainer">
            <div className="uamHeader">
                <div className="uamProfile-picture">
                    <img
                        src="path_to_profile_picture"
                        alt="Profile"
                    />
                    <span className="uamUsername">{username}</span>
                </div>
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
