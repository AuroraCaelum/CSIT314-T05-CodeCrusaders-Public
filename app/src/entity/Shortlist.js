class ShortList {
    static firebaseService = new FirebaseService(); // Singleton FirebaseService
    constructor(username, usedCarID) {
        this.username = username;
        this.usedCarID = usedCarID;
    }


    static async saveToShortlist(username, usedCarID) {
        try {
            const timestamp = Date.now();
            const documentID = `${timestamp}_${username}`; // Unique ID combining timestamp and BuyerID

            const shortlistData = {
                username: username,
                usedCarID: usedCarID,
                addedAt: new Date() // Timestamp for when the car was added to the shortlist
            };

            // Save to Firestore under the 'Shortlist' collection 
            await ShortList.firebaseService.addDocument(`Shortlist/Shortlist`, documentID, shortlistData);
            console.log("Used car added to shortlist successfully");
            return { success: true, message: "Used car added to shortlist successfully" };
        } catch (error) {
            console.error("Error saving used car to shortlist:", error);
            return { success: false, message: error.message };
        }
    }

    // Method to search for a used car within a user's shortlist by multiple filters
    static async searchShortlist(username, car_name, car_type, priceMin, priceMax, manufactureYear) {
        try {
            let query = ShortList.firebaseService.collection(`Shortlist`);

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
}

export default ShortList;