import FirebaseService from './FirebaseService';

class UserProfile {
    constructor(description, name, type) {

        this.description = description;
        this.name = name;
        this.type = type;
        this.firebaseService = new FirebaseService();
    }

// Save profile to Firestore
async createUserProfile(profileId) {
    try {
        const profileData = {
            description: this.description,
            name: this.name,
            typeOfUser: this.typeOfUser
        };
        await this.firebaseService.addDocument('UserProfile', profileId, profileData);
        console.log("UserProfile saved successfully");
        return true;
    } catch (error) {
        console.error("Error saving user profile:", error);
        return false;
    }
}

// Fetch profile by profileId from Firestore
async viewUserProfile(profileId) {
    try {
        const profileData = await this.firebaseService.getDocument('UserProfile', profileId);
        if (profileData) {
            this.description = profileData.description;
            this.name = profileData.name;
            this.typeOfUser = profileData.typeOfUser;
            return profileData;
        } else {
            throw new Error("Profile not found");
        }
    } catch (error) {
        console.error("Error getting user profile:", error);
        throw error;
    }
}

// Update profile by profileId
async updateUserProfile(profileId, newProfileData) {
    try {
        await this.firebaseService.updateDocument('UserProfile', profileId, newProfileData);
        Object.assign(this, newProfileData);  // Update current instance with new data
        console.log("UserProfile updated successfully");
        return true;
    } catch (error) {
        console.error("Error updating user profile:", error);
        return false;
    }
}

// Suspend profile by setting 'suspended' to true
async suspendUserProfile(profileId) {
    try {
        await this.firebaseService.updateDocument('UserProfile', profileId, { suspended: true });
        console.log("UserProfile suspended successfully");
        return true;
    } catch (error) {
        console.error("Error suspending user profile:", error);
        return false;
    }
}

// Search profile by name
static async searchUserProfile(profileName) {
    try {
        const profiles = await FirebaseService.searchByFields('UserProfile', { name: profileName });
        if (profiles.length > 0) {
            return profiles[0];  // Return the first matching profile
        } else {
            throw new Error("Profile not found");
        }
    } catch (error) {
        console.error("Error searching for user profile:", error);
        throw error;
    }
}
}

export default UserProfile;