import React, { useState } from "react";

function UserManagementUI() {
    const [username] = useState("AdminUser")

    const handleAccountManagement = () => {
        console.log("User Account Management");
        alert("Redirecting to User Account Management Page...");
    };

    const handleAccountProfile = () => {
        console.log("User Profile Management");
        alert("Redirecting to User Profile Management Page...");
    };

    const handleLogout = () => {
        console.log("Logging out");
        alert("Logging out...")
    }

    return (
        <div style={styles.container}>
            <div style={styles.header}>
            <div style={styles.userInfo}>
                    <img 
                        src="https://via.placeholder.com/40" 
                        alt="Profile" 
                        style={styles.profilePicture} 
                    />
                    <span style={styles.username}>{username}</span>
                </div>                
                <button onClick={handleLogout} style={styles.logoutButton}>
                    Logout
                </button>
            </div>
            <div style={styles.buttonContainer}>
                <button onClick={handleAccountManagement} style={styles.actionButton}>
                    User Account Management
                </button>

                <button onClick={handleAccountProfile} style={styles.actionButton}>
                    User Profile Management
                </button>
            </div>
        </div>
    );
}

const styles = {
    container: {
        fontFamily: "Arial, sans-serif",
        height: "150px",
        width: "600px",
        margin: "50px auto",
        padding: "30px",
        border: "1px solid #ccc",
        borderRadius: "10px",
        backgroundColor: "#f9f9f9",
        textAlign: "center",
    },
    header: {
        display: "flex",
        justifyContent: "flex-end",
        alignItems: "center",
        marginBottom: "20px",
    },
    userInfo: {
        display: "flex",
        alignItems: "center",
        marginRight: "20px",
    },
    profilePicture: {
        width: "40px",
        height: "40px",
        borderRadius: "50%",
        marginRight: "10px",
    },
    username: {
        fontSize: "16px",
        fontweight: "bold",
    },
    logoutButton: {
        padding: "8px 16px",
        borderRadius: "5px",
        backgroundColor: "#FFFFFF",
        color: "fff",
        cursor: "pointer",
    },
    buttonContainer: {
        display: "flex",
        justifyContent: "space-between",
        marginTop: "60px",
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
