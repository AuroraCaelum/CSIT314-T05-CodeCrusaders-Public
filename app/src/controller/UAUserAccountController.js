import UserAccount from '../entity/UserAccount';

class UACreateUserAccountController {

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

class UAViewUserAccountController {

    async viewUserAccount(username) {
        try {
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

class UAUpdateUserAccountController {

    async updateUserAccount(username, fName, lName, password, phoneNum, email, userProfile) {
        try {
            const userAccount = new UserAccount(username, fName, lName, password, phoneNum, email, userProfile);
            await userAccount.updateUserAccount(username, fName, lName, password, phoneNum, email, userProfile);
            return true;
        } catch (error) {
            return false;
        }
    }
}

class UASuspendUserAccountController {

    async suspendUserAccount(username) {
        try {
            const userAccount = new UserAccount(username);

            await userAccount.suspendUserAccount(username); // Call the suspension method
            return true;
        } catch (error) {
            return false;
        }
    }
}

class UASearchUserAccountController {

    async searchUserAccount(username) {
        try {
            const userAccount = new UserAccount();
            const userAccountData = await userAccount.searchUserAccount(username); // Call the static method to search by username
            return userAccountData;
        } catch (error) {
            return null;
        }
    }
}


export { UACreateUserAccountController, UAViewUserAccountController, UAUpdateUserAccountController, UASuspendUserAccountController, UASearchUserAccountController };
