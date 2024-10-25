import UserProfile from '../entity/UserProfile';

class CreateUserProfileController {

    // Create user profile, takes in profileName, description, profileType
    async createUserProfile(profileName, description, profileType) {
        try {
            const profile = new UserProfile(description, profileName, profileType);
            const success = await profile.createUserProfile(); // Changed method call to reflect new implementation
            if (success) {
                return true;
            } else {
                return false;
            }
        } catch (error) {
            return false;
        }
    }
}
class ViewUserProfileController {

    static async getUserProfiles() {
        try {
            const userProfiles = await UserProfile.getUserProfiles();
            return userProfiles;
        } catch (error) {
            console.log("Error:", error);
            throw error;
        }
    }

    // View current user's profile
    async viewUserProfile(profileName) {
        try {
            const profile = new UserProfile(); // Assuming constructor is still needed
            const profileData = await profile.viewUserProfile(profileName); // Change to viewUserProfile
            return profileData;
        } catch (error) {
            console.log("Error:", error);
            throw error;
        }
    }
}

class UpdateUserProfileController {

    // Update user's profile
    async updateUserProfile(profileName, description, profileType) {
        try {
            const profile = new UserProfile(profileName, description, profileType); // Pass data to constructor
            const success = await profile.updateUserProfile(); // Adjusted to use type as ID
            if (success) {
                return true;
            } else {
                return false;
            }
        } catch (error) {
            return true;
        }
    }
}

class SuspendUserProfileController {

    // Suspend user's profile
    async suspendUserProfile(profileName) {

        try {
            const profile = new UserProfile(profileName, null, null); // Assuming constructor still needed
            const success = await profile.suspendUserProfile(profileName); // No need for profileId
            if (success) {
                return true;
            } else {
                return false;
            }
        } catch (error) {
            return false;
        }
    }
}

class SearchUserProfileController {

    // Search for user's profile
    async searchUserProfile(profileName) {
        try {
            const profile = await UserProfile.searchUserProfile(profileName); // Adjusted to correct method
            return profile;
        } catch (error) {
            throw error;
        }
    }
}

export { CreateUserProfileController, ViewUserProfileController, UpdateUserProfileController, SuspendUserProfileController, SearchUserProfileController };

