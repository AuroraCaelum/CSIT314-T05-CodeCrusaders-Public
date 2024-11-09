// File path: src/entity/RateReview.js
import FirebaseService from '../FirebaseService';

class Shortlist {
    static firebaseService = new FirebaseService(); // Singleton FirebaseService
    constructor(username, usedCarId) {
        this.username = username;
        this.usedCarId = usedCarId;
    }


    static async saveToShortlist(username, car) {
        try {
            const timestamp = Date.now(); // Unique ID combining timestamp and BuyerID
            const documentId = `${timestamp}_${username}`;

            const shortlistData = {
                username: username,
                usedCarId: car.usedCarId,
                car_name: car.car_name,
                // car_type: car.car_type,
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
    static async searchShortlist(username, car_name, car_type, priceMin, priceMax, manufactureYear) {
        try {
            let query = Shortlist.firebaseService.collection(`Shortlist`);

            // Apply filters as necessary for each field
            if (car_name) {
                query = query.where("car_name", "==", car_name);
            }
            if (car_type) {
                query = query.where("car_type", "==", car_type);
            }
            if (priceMin !== undefined && priceMax !== undefined) {
                query = query.where("price", ">=", priceMin).where("price", "<=", priceMax);
            } else if (priceMin !== undefined) {
                query = query.where("price", ">=", priceMin);
            } else if (priceMax !== undefined) {
                query = query.where("price", "<=", priceMax);
            }
            if (manufactureYear) {
                query = query.where("manufacture_year", "==", manufactureYear);
            }

            // Execute the query and get matching documents
            const snapshot = await query.get();
            const cars = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

            if (cars.length > 0) {
                return { success: true, data: cars };
            } else {
                return { success: false, message: "No cars found in shortlist matching the criteria" };
            }
        } catch (error) {
            console.error("Error searching in shortlist:", error);
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
}

export default Shortlist;