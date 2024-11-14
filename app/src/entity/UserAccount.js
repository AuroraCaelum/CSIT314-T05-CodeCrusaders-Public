import FirebaseService from '../FirebaseService';
import { db } from './../firebase';
import { doc, collection, where, query, getDocs } from 'firebase/firestore';

class UserAccount {
    constructor(username, fName, lName, password, phoneNum, email, userProfile) {
        this.username = username;
        this.fName = fName;
        this.lName = lName;
        this.password = password;
        this.phoneNum = phoneNum;
        this.email = email;
        this.userProfile = userProfile;
        this.firebaseService = new FirebaseService(); // Initialize FirebaseService
    }

    // Validate if the user is a 'Seller'
    static async validateSeller(username) {
        try {
            // Fetch the user data by username from Firestore
            const firebaseService = new FirebaseService();
            const userData = await firebaseService.getDocument('UserAccount', username);

            // Check if user exists and their userProfile is 'Seller'
            if (userData && userData.userProfile === 'Seller') {
                return true;
            } else {
                console.warn(`User '${username}' is not a Seller or does not exist.`);
                return false;
            }
        } catch (error) {
            console.error(`Error validating seller '${username}':`, error);
            return false;
        }
    }

    // Create a new user account and save
    async createUserAccount(username, fName, lName, password, phoneNum, email, userProfile) {
        try {
            const userData = {
                username: username,
                fName: fName,
                lName: lName,
                password: password,
                phoneNum: phoneNum,
                email: email,
                userProfile: userProfile
            };
            console.log("Adding document with data:", userData);
            await this.firebaseService.addDocument('UserAccount', username, userData);
            console.log("User account created and saved to Firestore");
        } catch (error) {
            console.error("Error creating user account:", error);
        }
    }

    // View user account information by userId
    async viewUserAccount(username) {
        try {
            // Fetch user data from Firestore using username
            const userData = await this.firebaseService.getDocument('UserAccount', username);

            if (userData) {
                console.log("User data:", userData);
                console.log("connected with data base at:", username)
                return userData;
            } else {
                console.log("User Data Load fail at: ", userData)
                console.log("did not connected with data base at:", username)
                return null;
            }
        } catch (error) {
            console.error("Error fetching user data:", error);
            return null;
        }
    }


    // Update user account with new data
    async updateUserAccount(username, fName, lName, password, phoneNum, email, userProfile) {
        try {
            const newData = {
                username: username,
                fName: fName,
                lName: lName,
                password: password,
                email: email,
                phoneNum: phoneNum,
                userProfile: userProfile
            };
            // await this.firebaseService.updateUserAccount('UserAccount', this.username, newData);
            // Object.assign(this, newData);
            await this.firebaseService.updateDocument('UserAccount', username, newData);
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
            return true;
        } catch (error) {
            console.error("Error suspending user account:", error);
            return false;
        }
    }

    // Search for a user by username
    async searchUserAccount(username) {
        try {
            let rawquery = collection(db, 'UserAccount');

            const conditions = [];
            if (username) {
                conditions.push(where("username", "==", username));
            }

            console.log(conditions)

            const finalQuery = query(rawquery, ...conditions);
            const snapshot = await getDocs(finalQuery);
            const userAccount = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

            console.log(userAccount)

            if(userAccount.length > 0) {
                return userAccount;
            } else {
                return null;
            }
        } catch (error) {
            console.error("Error searching for user:", error);
            throw error;
        }
    }

    async verifyUserAccount(username, password) {
        try {
            // Search for the user by username in Firestore
            const userData = await this.firebaseService.getDocument('UserAccount', username);
            console.log("User data:", userData);
            //console.log("User data:", userData.username);
            console.log("Params:", username, password);
            // const userProfile = userData.userProfile;

            if (userData && userData.username === username) {

                // Check if password matches
                if (userData.suspended === true) {
                    console.log("User account is suspended");
                    return null;
                } else {
                    if (userData.password === password) {
                        console.log("ID/PW Match", userData.userProfile);
                        return userData.userProfile;
                    } else {
                        console.log("Incorrect password");
                        return null;
                    }
                }
            } else {
                console.log("User not found");
                return null;
            }
        } catch (error) {
            console.error("Error logging in:", error);
            return null;
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
