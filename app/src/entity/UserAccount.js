import FirebaseService from './FirebaseService';

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
    async createUserAccount(password) {
        try {
            const user = await this.firebaseService.registerUser(this.email, password);
            this.userId = user.uid;
            await this.saveToDB();
        } catch (error) {
            console.error("Error registering user:", error);
        }
    }

    async saveToDB() {
        try {
            const userData = {
                email: this.email,
                fName: this.fName,
                lName: this.lName,
                password : this.password,
                phoneNum: this.phoneNum,
                userProfile: this.userProfile,
                username: this.username
            };
            // Add user to the 'users' collection in Firestore
            await this.firebaseService.addDocument('UserAccount', this.userId, userData);
            console.log("User saved to Firestore");
        } catch (error) {
            console.error("Error saving user to Firestore:", error);
        }
    }

    async login(password) {
        try {
            // Fetch user by username
            const userData = await this.firebaseService.searchByField('UserAccount', {
                username: this.username,
                userProfile: this.userProfile
            });

            if (userData && userData.length > 0) {
                const user = userData[0]; // Get the first match
                // Compare passwords
                if (user.password === password) {
                    // Assign user data to the instance
                    this.assignUserData(user);
                    this.userId = user.userId;
                    return true; // Login successful
                } else {
                    return false; // Incorrect password
                }
            } else {
                return false; // Username or userProfile not found
            }
        } catch (error) {
            console.error("Error logging in:", error);
            return false;
        }
    }

    async logout() {
        try {
            await this.firebaseService.logoutUser();
            console.log("Logout successful");
            return true;
        } catch (error) {
            console.error("Error logging out:", error);
            return false
        }
    }

    // Fetch and return user data 
    async getUserData() {
        try {
            const userData = await this.firebaseService.getDocument('UserAccount', this.userId);
            if (userData) {
                // Assign fetched data to the class instance
                this.fName = userData.fName;
                this.lName = userData.lName;
                this.phoneNum = userData.phoneNum;
                this.password = userData.password;
                this.email = userData.email;
                this.userProfile = userData.userProfile;
                this.username = userData.username;
                return userData;
            } else {
                throw new Error("User data not found");
            }
        } catch (error) {
            console.error("Error fetching user data:", error);
            throw error;
        }
    }
    assignUserData(userData) {
        this.fName = userData.fName;
        this.lName = userData.lName;
        this.phoneNum = userData.phoneNum;
        this.password = userData.password;
        this.email = userData.email;
        this.userProfile = userData.userProfile;
        this.username = userData.username;
    }

    // View user account information by userId
    static async viewUserAccount(userId) {
        try {
            const userData = await FirebaseService.getDocument('UserAccount', userId);
            if (userData) {
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

export default User;
