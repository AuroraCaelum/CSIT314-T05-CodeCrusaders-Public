import User from '../entity/UserAccount';

class UserAccountController {
    
    // Register a new user
    async createUserAccount(req, res) {
        const { email, fName, lName, password, phoneNum, userProfile, username } = req.body;
        try {
            const user = new User(email, fName, lName, password, phoneNum, userProfile, username);
            await user.createUserAccount(password);
            res.status(201).json({ message: 'User registered successfully', user });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async viewUserAccount(req, res) {
        const { username  } = req.params;
        try {
            const user = new User(null, null, null, null, null, null, username); // Initialize User with username
            const userData = await user.getUserData(); // Fetch user data by username
            res.status(200).json(userData);
        } catch (error) {
            res.status(500).json({ error: 'Failed to retrieve user account: ' + error.message });
        }
    }

    async updateUserAccount(req, res) {
        const { email, fName, lName, phoneNum, userProfile, username } = req.body;
        try {
            const user = new User(email, fName, lName, phoneNum, userProfile, username);
            const newData = { email, fName, lName, phoneNum, userProfile, username };
            await user.updateUserAccount(newData); 

            res.status(200).json({ message: 'User account updated successfully' });
        } catch (error) {
            res.status(500).json({ error: 'Failed to update user account' });
        }
    }
    
    async suspendUserAccount(req, res) {
        const { username  } = req.params;
        try {
            const user = new User(null, null, null, null, null, null, username); // Initialize User with username
            await user.suspendUserAccount(); // Call the suspension method
            res.status(200).json({ message: 'User account suspended successfully' });
        } catch (error) {
            res.status(500).json({ error: 'Failed to suspend user account: ' + error.message });
        }
    }

    async searchUserAccount(req, res) {
        const { username } = req.params;
        try {
            const userData = await User.searchUserAccount(username); // Call the static method to search by username
            res.status(200).json(userData);
        } catch (error) {
            res.status(500).json({ error: 'Failed to search user account: ' + error.message });
        }
    }
}

export default new UserAccountController();
