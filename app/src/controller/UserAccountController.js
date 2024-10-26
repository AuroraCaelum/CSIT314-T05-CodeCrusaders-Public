import UserAccount from '../entity/UserAccount';

class CreateUserAccountController {

    // Register a new user
    async createUserAccount(fName, lName, username, password, phoneNum, email, userProfile) {
        try {
            // call createUserAccount method via instance
            const userAccount = new UserAccount(fName, lName, username, password, phoneNum, email, userProfile);

            await userAccount.createUserAccount(fName, lName, username, password, phoneNum, email, userProfile);
            return true;
        } catch (error) {
            console.log("Error:", error);
            return false;
        }
    }
}

class ViewUserAccountController {

    static async getUserAccountList() {
        try {
            const userList = await UserAccount.getUserAccountList();
            return userList;
        } catch (error) {
            console.log("Error:", error);
            throw error;
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
}

class UpdateUserAccountController {

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
}

class SuspendUserAccountController {

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
}

class SearchUserAccountController {

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
}


export { CreateUserAccountController, ViewUserAccountController, UpdateUserAccountController, SuspendUserAccountController, SearchUserAccountController };
