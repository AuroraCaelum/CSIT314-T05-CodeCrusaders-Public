import { db, storage } from './firebase';  // Only import db for Firestore operations
import {
    collection,
    doc,
    setDoc,
    getDoc,
    updateDoc,
    deleteDoc,
    query,
    where,
    getDocs
} from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';

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

    // Get a whole documents in Firestore
    async getDocuments(collectionName) {
        try {
            const docSnap = await getDocs(collection(db, collectionName));
            if (docSnap) {
                return docSnap;
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
            snapshot.forEach(doc => results.push({ ...doc.data(), documentId: doc.id }));
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

    async deleteDocument(collectionName, docId) {
        try {
            const docRef = doc(db, collectionName, docId);
            await deleteDoc(docRef);
            console.log(`Document with ID ${docId} has been deleted successfully.`);
            return true;
        } catch (error) {
            console.error("Error deleting document:", error);
            return false;
        }
    }

    // Upload a file to Firebase Storage
    async uploadFile(file, folder) {
        try {
            console.log("File object: ", file);
            const storageRef = ref(storage, `${folder}/${file.name}`);
            const snapshot = await uploadBytesResumable(storageRef, file);
            const url = getDownloadURL(snapshot.ref);
            // Await completion of upload and retrieve download URL
            console.log("File uploaded successfully. URL: ", url);
            return url;
        } catch (error) {
            console.error("Error uploading file:", error);
            throw error;
        }
    }

    // Get a download URL for a file in Firebase Storage
    async getDownloadURL(folder, fileName) {
        try {
            const storageRef = ref(storage, `${folder}/${fileName}`);
            const url = await getDownloadURL(storageRef);
            return url;
        } catch (error) {
            console.error("Error getting download URL:", error);
            throw error;
        }
    }
}

export default FirebaseService;
