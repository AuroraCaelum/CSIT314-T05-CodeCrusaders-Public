import React, { useState } from "react";

function UserManagementUI() {
    const [searchUsername, setSearchUsername] = useState("");

    const handleSearch = (e) => {
        e.preventDefault();
        // Add logic to handle searching the username
        console.log("Searched Username:", searchUsername);
    };

    const handleCreateAccount = () => {
        // Add logic to handle account creation
        console.log("Create User Account");
        alert("Redirecting to Account Creation Page...");
    };

    const handleCreateProfile = () => {
        // Add logic to handle profile creation
        console.log("Create User Profile");
        alert("Redirecting to Profile Creation Page...");
    };

    return (
        <div style={styles.container}>
            <h2 style={styles.title}>User Management Page</h2>

            {/* Username Search Bar */}
            <div style={styles.searchContainer}>
                <input
                    type="text"
                    placeholder="Search by username"
                    value={searchUsername}
                    onChange={(e) => setSearchUsername(e.target.value)}
                    style={styles.searchBar}
                />
                <button onClick={handleSearch} style={styles.searchButton}>
                    Search
                </button>
            </div>

            {/* Create User Account and Profile Buttons */}
            <div style={styles.buttonContainer}>
                <button onClick={handleCreateAccount} style={styles.actionButton}>
                    Create User Account
                </button>
                <button onClick={handleCreateProfile} style={styles.actionButton}>
                    Create User Profile
                </button>
            </div>
        </div>
    );
}

const styles = {
    container: {
        fontFamily: "Arial, sans-serif",
        width: "600px",
        margin: "50px auto",
        padding: "30px",
        border: "1px solid #ccc",
        borderRadius: "10px",
        backgroundColor: "#f9f9f9",
        textAlign: "center",
    },
    title: {
        fontSize: "28px",
        fontWeight: "bold",
        marginBottom: "20px",
    },
    searchContainer: {
        display: "flex",
        justifyContent: "center",
        marginBottom: "20px",
    },
    searchBar: {
        width: "70%",
        padding: "10px",
        marginRight: "10px",
        borderRadius: "5px",
        border: "1px solid #ccc",
    },
    searchButton: {
        padding: "10px 20px",
        borderRadius: "5px",
        border: "none",
        backgroundColor: "#333",
        color: "#fff",
        cursor: "pointer",
    },
    buttonContainer: {
        display: "flex",
        justifyContent: "space-between",
        marginTop: "20px",
    },
    actionButton: {
        width: "45%",
        padding: "15px",
        borderRadius: "5px",
        border: "none",
        backgroundColor: "#4CAF50",
        color: "#fff",
        cursor: "pointer",
        fontSize: "16px",
    },
};

export default UserManagementUI;
