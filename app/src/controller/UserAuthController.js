import User from '../entity/UserAccount';
// import Cookies from 'js-cookie';

class UserAuthController {
    constructor() {
        this.authenticateLogin = this.authenticateLogin.bind(this);
        this.logout = this.logout.bind(this);
    }

    // Login 
    async authenticateLogin(username, password, userProfile) {
        // const { username, password, userProfile } = req.body;
        try {
            const user = new User(null, null, null, password, null, userProfile, username);

            // Attempt to login with username and password
            const loginSuccess = await user.authenticateLogin(username, password, userProfile);

            if (loginSuccess) {
                console.log("Login successful");
                return true;
            }
            console.log("Login failed");
            return false;
        } catch (error) {
            console.error("Error logging in:", error);
            return false;
        }
    }

    // Logout
    async logout() {
        try {
            // Cookies.remove('username');
            // Cookies.remove('userProfile');
            console.log("Logout successful");
            return true;
        } catch (error) {
            console.error("Error logging out:", error);
            return false;
        }
    }

}

export default UserAuthController;
