import UserAccount from '../entity/UserAccount';

class CreateUserAccountController {

    // Register a new user
    async createUserAccount(username, fName, lName, password, phoneNum, email, userProfile) {
        try {
            // call createUserAccount method via instance
            const userAccount = new UserAccount(username, fName, lName, password, phoneNum, email, userProfile);

            await userAccount.createUserAccount(username, fName, lName, password, phoneNum, email, userProfile);
            return true;
        } catch (error) {
            console.log("Error:", error);
            return false;
        }
    }
}

class ViewUserAccountController {

    async viewUserAccount(username) {
        // const { username } = req.params;
        try {
            // const user = new UserAccount(null, null, null, null, null, null, username); // Initialize User with username
            const userAccount = new UserAccount();
            const userData = await userAccount.viewUserAccount(username); // Fetch user data by username
            console.log("Fetched user account:", userData);
            return userData;
        } catch (error) {
            console.error("Error fetching user account:", error);
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
            const userAccount = new UserAccount(username, fName, lName, password, phoneNum, email, userProfile);

            await userAccount.updateUserAccount(username, fName, lName, password, phoneNum, email, userProfile);
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
            const userAccount = new UserAccount(username);

            await userAccount.suspendUserAccount(username); // Call the suspension method
            // res.status(200).json({ message: 'User account suspended successfully' });
            console.log("Success to Suspend User(Controller)");
            return true;
        } catch (error) {
            // res.status(500).json({ error: 'Failed to suspend user account: ' + error.message });
            console.log("failed to Suspend User(Controller)");
            return false;
        }
    }
}

class SearchUserAccountController {

    async searchUserAccount(username) {
        // const { username } = req.params;
        try {
            const userAccount = new UserAccount();
            const userAccountData = await userAccount.searchUserAccount(username); // Call the static method to search by username
            // res.status(200).json(userData);
            return userAccountData;
        } catch (error) {
            // res.status(500).json({ error: 'Failed to search user account: ' + error.message });
            return null;
        }
    }
}


export { CreateUserAccountController, ViewUserAccountController, UpdateUserAccountController, SuspendUserAccountController, SearchUserAccountController };
