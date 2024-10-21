import UserProfile from '../entity/UserProfile';

class UserProfileController {

    // Create user profile, takes in profileName, description, profileType, returns bool
    async createUserProfile(req, res) {
        const { description, name, typeOfUser, profileId } = req.body;
        try {
            const profile = new UserProfile(description, name, typeOfUser);
            const success = await profile.saveProfile(profileId);
            if (success) {
                res.status(201).json({ message: 'UserProfile created successfully', success: true });
            } else {
                res.status(500).json({ message: 'Failed to create UserProfile', success: false });
            }
        } catch (error) {
            res.status(500).json({ error: error.message, success: false });
        }
    }

    // View current user's profile, takes in profileId, returns profile details
    async viewUserProfile(req, res) {
        const { profileId } = req.params;
        try {
            const profile = new UserProfile();
            const profileData = await profile.getProfile(profileId);
            res.status(200).json(profileData);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // Update user's profile, takes in fields of profileName, description, profileType, returns bool
    async updateUserProfile(req, res) {
        const { profileId } = req.params;
        const { description, name, typeOfUser } = req.body;
        const newProfileData = { description, name, typeOfUser };

        try {
            const profile = new UserProfile();
            const success = await profile.updateProfile(profileId, newProfileData);
            if (success) {
                res.status(200).json({ message: 'UserProfile updated successfully', success: true });
            } else {
                res.status(500).json({ message: 'Failed to update UserProfile', success: false });
            }
        } catch (error) {
            res.status(500).json({ error: error.message, success: false });
        }
    }

    // Suspend user's profile, takes in profileId
    async suspendUserProfile(req, res) {
        const { profileId } = req.params;
        try {
            const profile = new UserProfile();
            const success = await profile.suspendProfile(profileId);
            if (success) {
                res.status(200).json({ message: 'UserProfile suspended successfully', success: true });
            } else {
                res.status(500).json({ message: 'Failed to suspend UserProfile', success: false });
            }
        } catch (error) {
            res.status(500).json({ error: error.message, success: false });
        }
    }

    // Search for user's profile, takes in profileName, returns profile details
    async searchUserProfile(req, res) {
        const { profileName } = req.params;
        try {
            const profile = await UserProfile.searchProfileByName(profileName);
            res.status(200).json(profile);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

export default new UserProfileController();

