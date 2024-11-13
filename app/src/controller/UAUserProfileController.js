import UserProfile from '../entity/UserProfile';

class UACreateUserProfileController {

    // Create user profile, takes in profileName, description, profileType
    async createUserProfile(profileName, description, profileType) {
        try {
            const profile = new UserProfile();
            const success = await profile.createUserProfile(profileName, description, profileType); // Changed method call to reflect new implementation
            if (success) {
                return true;
            } else {
                return false;
            }
        } catch (error) {
            console.log("Error:", error);
            return false;
        }
    }
}

class UAViewUserProfileController {
    
    // View current user's profile
    async viewUserProfile(profileName) {
        try {
            const userProfile = new UserProfile(); // Assuming constructor is still needed
            const profileData = await userProfile.viewUserProfile(profileName); // Change to viewUserProfile
            return profileData;
        } catch (error) {
            console.log("Error:", error);
            throw error;
        }
    }
}

class UAUpdateUserProfileController {

    // Update user's profile
    async updateUserProfile(profileName, description, profileType) {
        try {
            const userProfile = new UserProfile(profileName, description, profileType); // Pass data to constructor
            const success = await userProfile.updateUserProfile(profileName, description, profileType); // Adjusted to use type as ID
            if (success) {
                console.log("Success update user profile: ", profileName, description, profileType);
                return true;
            } else {
                console.log("Failed update user profile: ", profileName, description, profileType);
                return false;
            }
        } catch (error) {
            return error;
        }
    }
}

class UASuspendUserProfileController {

    // Suspend user's profile
    async suspendUserProfile(profileName) {

        try {
            const profile = new UserProfile(profileName, null, null); // Assuming constructor still needed
            const success = await profile.suspendUserProfile(profileName); // No need for profileId
            console.log("Success to Suspend User Profile(Controller)", profileName);
            return true;
        } catch (error) {
            return false;
        }
    }
}

class UASearchUserProfileController {

    // Search for user's profile
    async searchUserProfile(profileName) {
        try {
            const userProfile = new UserProfile();
            const profile = await userProfile.searchUserProfile(profileName); // Adjusted to correct method
            return profile;
        } catch (error) {
            throw error;
        }
    }
}

export { UACreateUserProfileController, UAViewUserProfileController, UAUpdateUserProfileController, UASuspendUserProfileController, UASearchUserProfileController };

