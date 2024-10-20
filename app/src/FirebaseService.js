import { auth, db } from './firebase';  // Importing initialized auth and db from firebase.js
import { 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signOut 
} from 'firebase/auth';
import { 
    collection, 
    doc, 
    setDoc, 
    getDoc, 
    updateDoc, 
    query, 
    where, 
    getDocs 
} from 'firebase/firestore';

class FirebaseService {
    
    // Create 
    async addDocument(collectionName, docId, data) {
        try {
            await setDoc(doc(db, collectionName, docId), data);
            console.log(`Document added to ${collectionName} with ID: ${docId}`);
        } catch (error) {
            console.error("Error adding document:", error);
            throw error;
        }
    }

    // Read 
    async getDocument(collectionName, docId) {
        try {
            const docSnap = await getDoc(doc(db, collectionName, docId));
            if (docSnap.exists()) {
                return docSnap.data();
            } else {
                console.log("No such document!");
                return null;
            }
        } catch (error) {
            console.error("Error getting document:", error);
            throw error;
        }
    }

    // Read 
    async searchByFields(collectionName, fields) {
        try {
            let q = collection(db, collectionName);
            
            // Add where clauses for each field dynamically
            for (const [field, value] of Object.entries(fields)) {
                q = query(q, where(field, '==', value));
            }

            const snapshot = await getDocs(q);
            const results = [];
            snapshot.forEach(doc => results.push({ ...doc.data(), userId: doc.id }));
            return results;
        } catch (error) {
            console.error("Error searching by fields:", error);
            throw error;
        }
    }

    // Update 
    async updateDocument(collectionName, docId, newData) {
        try {
            await updateDoc(doc(db, collectionName, docId), newData);
            console.log(`Document with ID: ${docId} updated successfully in ${collectionName}`);
        } catch (error) {
            console.error("Error updating document:", error);
            throw error;
        }
    }

    // Register a new user 
    async registerUser(email, password) {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            return userCredential.user;  // Returns the user object with UID
        } catch (error) {
            console.error("Error registering user:", error);
            throw error;
        }
    }

    // Log in a user
    async login(email, password) {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            return userCredential.user;  // Returns the user object with UID
        } catch (error) {
            console.error("Error logging in:", error);
            throw error;
        }
    }

    // Log out the current user
    async logoutUser() {
        try {
            await signOut(auth);
            console.log("Logout successful");
        } catch (error) {
            console.error("Error logging out:", error);
            throw error;
        }
    }
}

export default FirebaseService;
