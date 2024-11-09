import UserAccount from '../entity/UserAccount';
import Cookies from 'js-cookie';

class UserLoginController {
    constructor() {
        this.authenticateLogin = this.authenticateLogin.bind(this);
    }

    // Login 
    async authenticateLogin(username, password, userProfile) {
        // const { username, password, userProfile } = req.body;
        try {
            const user = new UserAccount(null, null, null, password, null, userProfile, username);

            // Attempt to login with username and password
            const loginSuccess = await user.authenticateLogin(username, password, userProfile);

            if (loginSuccess) {
                Cookies.set('username', username);
                Cookies.set('userProfile', userProfile);
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
}

class UserLogoutController {
    // Logout
    async logout() {
        try {
            Cookies.remove('username');
            Cookies.remove('userProfile');
            console.log("Logout successful");
            return true;
        } catch (error) {
            console.error("Error logging out:", error);
            return false;
        }
    }
}

export { UserLoginController, UserLogoutController };
