import React, { useState } from "react";

function LoginUI() {
    const [loginAs, setLoginAs] = useState("");
    const [userId, setUserId] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = (e) => {
        e.preventDefault();
        // Handle login logic
        console.log(
            "Login as:",
            loginAs,
            "User ID:",
            userId,
            "Password:",
            password
        );
    };

    return (
        <div style={styles.container}>
            <h2 style={styles.title}>CODE CRUSADERS</h2>
            <h3 style={styles.subtitle}>USED CAR SELLING SERVICE</h3>

            <form style={styles.form} onSubmit={handleLogin}>
                <label htmlFor="loginAs">Login As</label>
                <select
                    id="loginAs"
                    value={loginAs}
                    onChange={(e) => setLoginAs(e.target.value)}
                    style={styles.input}
                >
                    <option value="">Select</option>
                    <option value="Admin">Admin</option>
                    <option value="Buyer">Buyer</option>
                    <option value="Seller">Seller</option>
                    <option value="Agent">Agent</option>
                </select>
                <label htmlFor="userId">User ID:</label>
                <input
                    type="text"
                    id="userId"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                    style={styles.input}
                    placeholder="Enter your user ID"
                />
                <label htmlFor="password">Password:</label>
                <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={styles.input}
                    placeholder="Enter your password"
                />
                <button type="submit" style={styles.button}>
                    Login
                </button>
            </form>
        </div>
    );
}

const styles = {
    container: {
        fontFamily: "Arial, sans-serif",
        width: "400px",
        margin: "100px auto",
        padding: "20px",
        border: "1px solid #ccc",
        borderRadius: "10px",
        backgroundColor: "#f9f9f9",
        textAlign: "center",
    },
    title: {
        fontSize: "24px",
        fontWeight: "bold",
        marginBottom: "10px",
    },
    subtitle: {
        fontSize: "18px",
        fontWeight: "normal",
        marginBottom: "20px",
    },
    form: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
    },
    input: {
        width: "80%",
        padding: "10px",
        margin: "10px 0",
        borderRadius: "5px",
        border: "1px solid #ccc",
    },
    button: {
        width: "80%",
        padding: "10px",
        borderRadius: "5px",
        border: "none",
        backgroundColor: "#333",
        color: "#fff",
        cursor: "pointer",
    },
};

export default LoginUI;

