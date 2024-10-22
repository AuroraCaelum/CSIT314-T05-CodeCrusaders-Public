import React, { useState } from "react";
import "./UserProfileManagementUI.css";

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
        <div className="upmContainer">
            <div className="upmHeader">
                <div className="upmProfile-picture">
                    <img
                        src="path_to_profile_picture"
                        alt="Profile"
                    />
                    <span className="upmUsername">{username}</span>
                </div>
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
                {users.map((user) => (
                    <div key={user.username} className="upmTable-row">
                        <span>{user.pName}</span>
                        <span>{user.description}</span>
                        <span>{user.type}</span>
                        <button className="upmInspect-button">Inspect</button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default UserProfileManagementUI;
