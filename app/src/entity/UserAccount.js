import FirebaseService from '../FirebaseService';

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
    // Validate if a seller exists by username
    static async validateSeller(username) {
        try {
            const userData = await FirebaseService.getDocument('UserAccount', username);
            return !!userData; // Returns true if userData exists, otherwise false
        } catch (error) {
            console.error(`Error validating seller '${username}':`, error);
            return false;
        }
    }
    // Create a new user account and save
    async createUserAccount(fName, lName, username, password, phoneNum, email, userProfile) {
        try {
            const userData = {
                email: email,
                fName: fName,
                lName: lName,
                password: password,
                phoneNum: phoneNum,
                userProfile: userProfile,
                username: username
            };
            await this.firebaseService.addDocument('UserAccount', username, userData);
            console.log("User account created and saved to Firestore");
        } catch (error) {
            console.error("Error creating user account:", error);
        }
    }

    async authenticateLogin(username, password, userProfile) {
        try {
            // Search for the user by username in Firestore
            const userData = await this.firebaseService.getDocument('UserAccount', username);
            console.log("User data:", userData);
            console.log("Params:", username, password, userProfile);

            if (userData && userData.username === username) {

                // Check if password matches
                if (userData.password === password) {
                    // Save username and userProfile in cookies for session management
                    // Cookies.set('username', user.username);
                    // Cookies.set('userProfile', user.userProfile);
                    if (userData.userProfile === userProfile) {
                        console.log("Login successful");
                        return true;
                    } else {
                        console.log("User profile does not match");
                        return false;
                    }
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
    static async updateUserAccount(username, fName, lName, password, phoneNum, email, userProfile) {
        try {
            const newData = {
                email: email,
                fName: fName,
                lName: lName,
                password: password,
                phoneNum: phoneNum,
                userProfile: userProfile,
                username: username
            };
            // await this.firebaseService.updateUserAccount('UserAccount', this.username, newData);
            // Object.assign(this, newData);
            await FirebaseService.updateDocument('UserAccount', username, newData);
            console.log("User account updated successfully");
            return true;
        } catch (error) {
            console.error("Error updating user data:", error);
            return false;
        }
    }

    // Suspend user account
    async suspendUserAccount(username) {
        try {
            await this.firebaseService.updateDocument('UserAccount', username, { suspended: true });
            console.log("User account suspended successfully");
        } catch (error) {
            console.error("Error suspending user account:", error);
        }
    }

    // Search for a user by username
    static async searchUserAccount(username) {
        try {
            // Search for a user in Firestore by the username field
            // const userData = await FirebaseService.searchByField('UserAccount', 'username', username);
            const userData = await FirebaseService.getDocument('UserAccount', username);
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

    static async getUserAccountList() {
        try {
            const firebaseService = new FirebaseService();
            const userData = await firebaseService.getDocuments('UserAccount');
            console.log(userData);
            return userData;
        } catch (error) {
            console.error("Error:", error);
            throw error;
        }
    }
}

export default UserAccount;
