import FirebaseService from './FirebaseService';
import Cookies from 'js-cookie';
class UserAccount {
    constructor(email, fName, lName, password, phoneNum, userProfile, username) {

        this.email = email;
        this.fName = fName;
        this.lName = lName;
        this.password = password;
        this.phoneNum = phoneNum;
        this.userProfile = userProfile;
        this.username = username;
        this.firebaseService = new FirebaseService();
    }
    // Create a new user account and save
    async createUserAccount() {
        try {
            const userData = {
                email: this.email,
                fName: this.fName,
                lName: this.lName,
                password: this.password,  // Store password in Firestore
                phoneNum: this.phoneNum,
                userProfile: this.userProfile,
                username: this.username
            };
            await this.firebaseService.addDocument('UserAccount', this.username, userData);
            console.log("User account created and saved to Firestore");
        } catch (error) {
            console.error("Error creating user account:", error);
        }
    }

    async login() {
        try {
            // Search for the user by username in Firestore
            const userData = await this.firebaseService.searchByFields('UserAccount', { username: this.username });

            if (userData && userData.length > 0) {
                const user = userData[0];

                // Check if password matches
                if (user.password === this.password) {
                    // Save username and userProfile in cookies for session management
                    Cookies.set('username', user.username);
                    Cookies.set('userProfile', user.userProfile);
                    console.log("Login successful");
                    return true;
                } else {
                    console.log("Incorrect password");
                    return false;
                }
            } else {
                console.log("User not found");
                return false;
            }
        } catch (error) {
            console.error("Error logging in:", error);
            return false;
        }
    }

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

    // View user account information by userId
    static async viewUserAccount(username) {
        try {
            // Fetch user data from Firestore using username
            const userData = await FirebaseService.getDocument('UserAccount', username);

            if (userData) {
                console.log("User data:", userData);
                return userData;
            } else {
                throw new Error("User not found");
            }
        } catch (error) {
            console.error("Error fetching user data:", error);
            throw error;
        }
    }


    // Update user account with new data
    async updateUserAccount(newData) {
        try {
            await this.firebaseService.updateUserAccount('UserAccount', this.userId, newData);
            Object.assign(this, newData);
            console.log("User account updated successfully");
        } catch (error) {
            console.error("Error updating user data:", error);
        }
    }

    // Suspend user account
    async suspendUserAccount() {
        try {
            await this.firebaseService.updateDocument('UserAccount', this.userId, { suspended: true });
            console.log("User account suspended successfully");
        } catch (error) {
            console.error("Error suspending user account:", error);
        }
    }

    // Search for a user by username
    static async searchUserAccount(username) {
        try {
            // Search for a user in Firestore by the username field
            const userData = await FirebaseService.searchByField('UserAccount', 'username', username);
            if (userData && userData.length > 0) {
                return userData[0]; // Assuming usernames are unique
            } else {
                throw new Error("User not found");
            }
        } catch (error) {
            console.error("Error searching for user:", error);
            throw error;
        }
    }
}

export default UserAccount;
