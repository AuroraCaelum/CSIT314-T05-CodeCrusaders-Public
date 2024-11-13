// File path: src/entity/RateReview.js
import FirebaseService from '../FirebaseService';
import { db } from './../firebase';  // Only import db for Firestore operations
import { doc, updateDoc, increment, collection, query, where, getDocs } from 'firebase/firestore';

class Shortlist {
    static firebaseService = new FirebaseService(); // Singleton FirebaseService
    constructor(username, usedCarId) {
        this.username = username;
        this.usedCarId = usedCarId;
        this.firebaseService = new FirebaseService();
    }


    static async saveToShortlist(username, car) {
        try {
            const timestamp = Date.now(); // Unique ID combining timestamp and BuyerID
            const documentId = `${timestamp}_${username}`;

            const shortlistData = {
                username: username,
                usedCarId: car.usedCarId,
                car_name: car.car_name,
                car_type: car.car_type,
                car_image: car.car_image,
                manufacture_year: car.manufacture_year,
                mileage: car.mileage,
                price: car.price,
                description: car.description
            };
            console.log("Check save Shortlist at Entity", username, car.car_name);


            // Save to Firestore under the 'Shortlist' collection 
            await Shortlist.firebaseService.addDocument(`Shortlist`, documentId, shortlistData);
            console.log("Used car added to shortlist successfully");
            return true;
            //return { success: true, message: "Used car added to shortlist successfully" };
        } catch (error) {
            console.error("Error saving used car to shortlist:", error);
            return { success: false, message: error.message };
        }
    }

    // Method to search for a used car within a user's shortlist by multiple filters
    static async searchShortlist(username, carName, carType, priceRange, manufactureYear) {
        try {
            let carQuery = collection(db, 'Shortlist');
            let priceMin = priceRange[0];
            let priceMax = priceRange[1];

            console.log(priceMin);
            console.log(priceMax);
            console.log(username);
            console.log(carName);
            console.log(carType);
            console.log(manufactureYear);

            const conditions = [];

            conditions.push(where("username", "==", username));

            // Apply `carName` (car_name) filter if provided
            if (carName) {
                conditions.push(where("car_name", "==", carName));
            }

            // Apply `cartype` (car_type) filter if provided
            if (carType) {
                conditions.push(where("car_type", "==", carType));
            }

            // Apply `price` range filter if provided
            if (priceMin !== undefined && priceMax !== undefined) {
                conditions.push(where("price", ">=", Number(priceMin)));
                conditions.push(where("price", "<=", Number(priceMax)));
            }

            // Apply `manufactureYear` filter if provided
            if (manufactureYear) {
                conditions.push(where("manufacture_year", "==", Number(manufactureYear)));
            }

            const finalQuery = query(carQuery, ...conditions);

            console.log(finalQuery)

            // Execute the query and retrieve matching documents
            const snapshot = await getDocs(finalQuery)
            const cars = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

            if (cars.length > 0) {
                return cars;
            } else {
                return null;
            }
        } catch (error) {
            console.error("Error searching in shortlist:", error);
            return { success: false, message: error.message };
        }
    }

    async deleteShortlist(shortlistId) {
        try {
            const firebaseService = new FirebaseService();
            await firebaseService.deleteDocument('Shortlist', shortlistId);
            console.log("Shortlist entry deleted successfully");
            return true;
            //return { success: true, message: "Used car entry deleted successfully" };
        } catch (error) {
            console.error("Error delete shortlist entry:", error);
            return { success: false, message: error.message };
        }
    }

    static async getShortlistList(username) {
        try {
            const firebaseService = new FirebaseService();
            const shortlist = await firebaseService.searchByFields('Shortlist', { username: username });
            console.log("Fetched shortlist:", shortlist);
            return shortlist;
        } catch (error) {
            console.error("Error:", error);
            throw error;
        }
    }
}

export default Shortlist;