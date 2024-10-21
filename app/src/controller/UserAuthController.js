import User from '../entity/UserAccount';

class UserAuthController {
    

    // Login 
    async authenticateLogin(req, res) {
        const { username, password, userProfile } = req.body;
        try {
            const user = new User(null, null, null, password, null, userProfile, username);
            
            // Attempt to login with username and password
            const loginSuccess = await user.login(password);

            // Check if login was successful and userProfile (role) matches
            if (loginSuccess && user.userProfile === userProfile) {
                res.status(200).json({ message: 'Login successful', user });
            } else {
                res.status(401).json({ message: 'Invalid login credentials or role' });
            }
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // Logout
    async logout(req, res) {
        try {
            const user = new User(); 
            await user.logout();
            res.status(200).json({ message: 'Logout successful' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

}

export default new UserAuthController();
