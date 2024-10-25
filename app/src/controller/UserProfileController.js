import UserProfile from '../entity/UserProfile';

class CreateUserProfileController {

    // Create user profile, takes in profileName, description, profileType
    async createUserProfile(req, res) {
        const { description, name, typeOfUser } = req.body;
        try {
            const profile = new UserProfile(description, name, typeOfUser);
            const success = await profile.createUserProfile(); // Changed method call to reflect new implementation
            if (success) {
                res.status(201).json({ message: 'UserProfile created successfully', success: true });
            } else {
                res.status(500).json({ message: 'Failed to create UserProfile', success: false });
            }
        } catch (error) {
            res.status(500).json({ error: error.message, success: false });
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
    async viewUserProfile(req, res) {
        const { profileName } = req.params; // This should correspond to typeOfUser now
        try {
            const profile = new UserProfile(); // Assuming constructor is still needed
            const profileData = await profile.viewUserProfile(profileName); // Change to viewUserProfile
            res.status(200).json(profileData);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

class UpdateUserProfileController {

    // Update user's profile
    async updateUserProfile(req, res) {
        const { description, name, typeOfUser } = req.body;
        try {
            const profile = new UserProfile(description, name, typeOfUser); // Pass data to constructor
            const success = await profile.updateUserProfile(); // Adjusted to use type as ID
            if (success) {
                res.status(200).json({ message: 'UserProfile updated successfully', success: true });
            } else {
                res.status(500).json({ message: 'Failed to update UserProfile', success: false });
            }
        } catch (error) {
            res.status(500).json({ error: error.message, success: false });
        }
    }
}

class SuspendUserProfileController {

    // Suspend user's profile
    async suspendUserProfile(req, res) {

        try {
            const profile = new UserProfile(); // Assuming constructor still needed
            const success = await profile.suspendUserProfile(); // No need for profileId
            if (success) {
                res.status(200).json({ message: 'UserProfile suspended successfully', success: true });
            } else {
                res.status(500).json({ message: 'Failed to suspend UserProfile', success: false });
            }
        } catch (error) {
            res.status(500).json({ error: error.message, success: false });
        }
    }
}

class SearchUserProfileController {

    // Search for user's profile
    async searchUserProfile(req, res) {
        const { profileName } = req.params;
        try {
            const profile = await UserProfile.searchUserProfile(profileName); // Adjusted to correct method
            res.status(200).json(profile);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

export {CreateUserProfileController, ViewUserProfileController, UpdateUserProfileController, SuspendUserProfileController, SearchUserProfileController};

