import User from '../entity/UserAccount';

class UserAuthController {
    
    // Register a new user
    async register(req, res) {
        const { name, email, password, role } = req.body;
        try {
            const user = new User(null, name, email, role);
            await user.register(password);
            res.status(201).json({ message: 'User registered successfully', user });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // Login 
    async login(req, res) {
        const { email, password } = req.body;
        try {
            const user = new User(null, null, email);
            await user.login(password);
            res.status(200).json({ message: 'Login successful', user });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // Logout
    async logout(req, res) {
        try {
            const user = new User(); 
            await user.logout();
            res.status(200).json({ message: 'Logout successful' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

}

export default new UserAuthController();
