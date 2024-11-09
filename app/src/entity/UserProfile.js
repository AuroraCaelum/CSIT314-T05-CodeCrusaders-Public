import FirebaseService from "../FirebaseService";

class UserProfile {
    constructor(profileName, description, profileType) {
        this.profileName = profileName;
        this.description = description;
        this.profileType = profileType;
        this.firebaseService = new FirebaseService();
    }

    // Save profile to Firestore
    async createUserProfile(profileName, description, profileType) {
        try {
            const profileData = {
                profileName: profileName,
                description: description,
                profileType: profileType
            };
            const firebaseService = new FirebaseService();
            await firebaseService.addDocument("UserProfile", profileName, profileData);

            console.log("UserProfile saved successfully", profileName, profileData);
            return true;
        } catch (error) {
            console.log("success to create Profile(E): ", profileName, description, profileType );

            console.error("Error saving user profile:", error);
            return false;
        }
    }

    // Fetch profile by profileId from Firestore
    async viewUserProfile() {
        try {
            // Use this.type as the document ID
            const profileData = await this.firebaseService.getDocument(
                "UserProfile",
                this.type
            );
            if (profileData) {
                this.description = profileData.description;
                this.profileName = profileData.profileName;
                this.profileType = profileData.profileType;
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
    async updateUserProfile(profileName, description, profileType) {
        try {

            var newProfileData = {
                profileName,
                description,
                profileType
            };
            // Use this.type as the document ID
            const firebaseService = new FirebaseService();
            await firebaseService.updateDocument("UserProfile", profileName, newProfileData);
            //Object.assign(this, newProfileData); // Update current instance with new data
            console.log("UserProfile updated successfully");
            console.log("Success update user profile(E): ", profileName, description, profileType);

            return true;
        } catch (error) {
            console.log("Failed update user profile(E): ", profileName, description, profileType);
            console.error("Error updating user profile:", error);
            return false;
        }
    }

    // Suspend profile by setting 'suspended' to true
    async suspendUserProfile(profileName) {
        try {
            await this.firebaseService.updateDocument('UserProfile', profileName, { suspended: true });
            console.log("UserProfile suspended successfully", profileName);
            return true;
        } catch (error) {
            console.error("Error suspending user profile:", error);
            return false;
        }
    }


    // Search profile by name
    static async searchUserProfile(profileName) {
        try {
            const firebaseService = new FirebaseService();
            const profiles = await firebaseService.searchByFields('UserProfile', { profileName });
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

    static async getUserProfiles() {
        try {
            const firebaseService = new FirebaseService();
            const userData = await firebaseService.getDocuments('UserProfile');
            console.log(userData);
            return userData;
        } catch (error) {
            console.error("Error:", error);
            throw error;
        }
    }
}

export default UserProfile;
