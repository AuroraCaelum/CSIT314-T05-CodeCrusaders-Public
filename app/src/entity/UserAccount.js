import FirebaseService from './FirebaseService';

class User {
    constructor(userId, name, email, role) {
        this.userId = userId;
        this.name = name;
        this.email = email;
        this.role = role;
        this.firebaseService = new FirebaseService();
    }

    async register(password) {
        try {
            const user = await this.firebaseService.registerUser(this.email, password);
            this.userId = user.uid;
            await this.saveToDB();
        } catch (error) {
            console.error("Error registering user:", error);
        }
    }

    async login(password) {
        try {
            const user = await this.firebaseService.loginUser(this.email, password);
            this.userId = user.uid;
        } catch (error) {
            console.error("Error logging in:", error);
        }
    }

    async logout() {
        try {
            await this.firebaseService.logoutUser();
        } catch (error) {
            console.error("Error logging out:", error);
        }
    }

    async saveToDB() {
        try {
            await this.firebaseService.addDocument('users', {
                userId: this.userId,
                name: this.name,
                email: this.email,
                role: this.role
            });
        } catch (error) {
            console.error("Error saving user to database:", error);
        }
    }

    async getUserData() {
        try {
            const userData = await this.firebaseService.getDocument('users', this.userId);
            this.name = userData.name;
            this.role = userData.role;
            return userData;
        } catch (error) {
            console.error("Error fetching user data:", error);
        }
    }

    async updateUserData(newData) {
        try {
            await this.firebaseService.updateDocument('users', this.userId, newData);
            Object.assign(this, newData);
        } catch (error) {
            console.error("Error updating user data:", error);
        }
    }
}

export default User;
