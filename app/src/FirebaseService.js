import { db } from './firebase';  // Only import db for Firestore operations
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
    
    // Create a new document in Firestore
    async addDocument(collectionName, docId, data) {
        try {
            await setDoc(doc(db, collectionName, docId), data);
            console.log(`Document added to ${collectionName} with ID: ${docId}`);
        } catch (error) {
            console.error("Error adding document:", error);
            throw error;
        }
    }

    // Read a document from Firestore
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

    // Search documents in Firestore by specific fields
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

    // Update a document in Firestore
    async updateDocument(collectionName, docId, newData) {
        try {
            await updateDoc(doc(db, collectionName, docId), newData);
            console.log(`Document with ID: ${docId} updated successfully in ${collectionName}`);
        } catch (error) {
            console.error("Error updating document:", error);
            throw error;
        }
    }
}

export default FirebaseService;
