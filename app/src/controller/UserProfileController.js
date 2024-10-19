import User from '../entity/UserAccount';

class UserProfileController {

    // Get current user's profile
    async getProfile(req, res) {
        const { userId } = req.params;  // Assuming userId is passed in the URL
        try {
            const user = new User(userId);
            const userData = await user.getUserData();  
            res.status(200).json(userData);
        } catch (error) {
            res.status(500).json({ error: 'Failed to retrieve user profile' });
        }
    }

    // Update user's profile
    async updateProfile(req, res) {
        const { userId } = req.params;
        const { name, email, role } = req.body; 
        try {
            const user = new User(userId);
            await user.updateUserData({ name, email, role });  
            res.status(200).json({ message: 'Profile updated successfully' });
        } catch (error) {
            res.status(500).json({ error: 'Failed to update profile' });
        }
    }

    // Delete user's account
    async deleteAccount(req, res) {
        const { userId } = req.params;
        try {
            const user = new User(userId);
            await user.deleteAccount(); 
            res.status(200).json({ message: 'User account deleted successfully' });
        } catch (error) {
            res.status(500).json({ error: 'Failed to delete account' });
        }
    }

    // Change user's password
    async changePassword(req, res) {
        const { userId } = req.params;
        const { newPassword } = req.body;  
        try {
            const user = new User(userId);
            await user.changePassword(newPassword);  
            res.status(200).json({ message: 'Password changed successfully' });
        } catch (error) {
            res.status(500).json({ error: 'Failed to change password' });
        }
    }
}

export default new UserProfileController();
