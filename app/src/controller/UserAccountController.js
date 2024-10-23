import UserAccount from '../entity/UserAccount';

class UserAccountController {

    // Register a new user
    async createUserAccount(fName, lName, username, password, phoneNum, email, userProfile) {
        try {
            // const user = new UserAccount(email, fName, lName, password, phoneNum, userProfile, username);
            await UserAccount.createUserAccount(email, fName, lName, password, phoneNum, userProfile, username);
            return true;
        } catch (error) {
            return false;
        }
    }

    async viewUserAccount(username) {
        // const { username } = req.params;
        try {
            // const user = new UserAccount(null, null, null, null, null, null, username); // Initialize User with username
            const userAccount = await UserAccount.viewUserAccount(username); // Fetch user data by username
            return userAccount;
        } catch (error) {
            return null;
        }
    }

    async updateUserAccount(username, fName, lName, password, phoneNum, email, userProfile) {
        // const { email, fName, lName, phoneNum, userProfile, username } = req.body;
        try {
            // const user = new UserAccount(email, fName, lName, phoneNum, userProfile, username);
            // const newData = { email, fName, lName, phoneNum, userProfile, username };
            await UserAccount.updateUserAccount(username, fName, lName, password, phoneNum, email, userProfile);
            return true;
        } catch (error) {
            return false;
        }
    }

    async suspendUserAccount(username) {
        // const { username } = req.params;
        try {
            // const user = new UserAccount(null, null, null, null, null, null, username); // Initialize User with username
            await UserAccount.suspendUserAccount(username); // Call the suspension method
            // res.status(200).json({ message: 'User account suspended successfully' });
            return true;
        } catch (error) {
            // res.status(500).json({ error: 'Failed to suspend user account: ' + error.message });
            return false;
        }
    }

    async searchUserAccount(username) {
        // const { username } = req.params;
        try {
            const userAccount = await UserAccount.searchUserAccount(username); // Call the static method to search by username
            // res.status(200).json(userData);
            return userAccount;
        } catch (error) {
            // res.status(500).json({ error: 'Failed to search user account: ' + error.message });
            return null;
        }
    }

    static async getUserAccountList() {
        try {
            const userList = await UserAccount.getUserAccountList();
            return userList;
        } catch (error) {
            console.log("Error:", error);
            throw error;
        }
    }
}

export default UserAccountController;
