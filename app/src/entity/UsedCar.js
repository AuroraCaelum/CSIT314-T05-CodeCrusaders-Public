// File path: src/entity/UsedCar.js
import FirebaseService from '../FirebaseService';
import { db } from './../firebase';  // Only import db for Firestore operations
import { doc, updateDoc, increment, collection, query, where, getDocs } from 'firebase/firestore';

class UsedCar {
    constructor(usedCarId, agent_username, seller_username, car_name, car_type, car_manufacturer, car_image, description, features, price, mileage, manufacture_year, engine_cap) {
        this.agent_username = agent_username;
        this.usedCarId = usedCarId;
        this.seller_username = seller_username;
        this.car_name = car_name;
        this.car_type = car_type;
        this.car_manufacturer = car_manufacturer;
        this.car_image = car_image;
        this.description = description;
        this.features = features;
        this.price = price;
        this.milage = mileage;
        this.manufacture_year = manufacture_year;
        this.engine_cap = engine_cap;
        this.firebaseService = new FirebaseService();
    }

    // Create a new used car entry
    async createUsedCar(usedCarId, agent_username, seller_username, car_name, car_type, car_manufacturer, car_image, description, features, price, mileage, manufacture_year, engine_cap) {
        try {
            //const imageUrl = await this.firebaseService.uploadFile(this.car_image, 'car_images');
            const firebaseService = new FirebaseService();
            const imageUrl = await firebaseService.uploadFile(car_image, 'car_images');
            if (!imageUrl) console.log("Error uploading image");


            const carData = {
                // usedCarId: usedCarId,
                agent_username: agent_username,
                seller_username: seller_username,
                car_name: car_name,
                car_type: car_type,
                car_manufacturer: car_manufacturer,
                car_image: imageUrl,
                description: description,
                features: features,
                price: Number(price),
                mileage: Number(mileage),
                manufacture_year: Number(manufacture_year),
                engine_cap: Number(engine_cap),
            };

            console.log("New Car Details(E):", usedCarId, agent_username, seller_username, car_name, car_type, car_manufacturer, car_image, description, features, price, mileage, manufacture_year, engine_cap)
            await this.firebaseService.addDocument('UsedCar', usedCarId, carData);
            console.log("Used car entry created successfully with ID:", usedCarId);
            console.log("Used car entry created successfully", carData);
            return { success: true, message: "Used car entry created successfully" };
        } catch (error) {
            console.error("Error creating used car entry:", error);
            return { success: false, message: error.message };
        }
    }

    // View a used car entry by usedCarId
    async viewUsedCar(usedCarId) {
        try {
            const firebaseService = new FirebaseService();
            const carData = await firebaseService.getDocument('UsedCar', usedCarId);
            console.log("Car data:", carData);
            return { "usedCarId": usedCarId, "body": carData };
        } catch (error) {
            console.error("Error fetching car data:", error);
            return null;
        }
    }

    // Update an existing used car entry by usedCarId
    async updateUsedCar(usedCarId, seller_username, car_name, car_type, car_manufacturer, car_image, description, features, price, mileage, manufacture_year, engine_cap) {
        try {
            //  Check if a new image file is provided and upload if necessary
            // let imageUrl = null;
            // if (usedCarId.car_image) {
            //     imageUrl = await this.firebaseService.uploadFile(usedCarId.car_image, 'car_image');
            //}
            const firebaseService = new FirebaseService();

            var carData = {
                seller_username: seller_username,
                car_name: car_name,
                car_type: car_type,
                car_manufacturer: car_manufacturer,
                description: description,
                features: features,
                price: price,
                mileage: mileage,
                manufacture_year: manufacture_year,
                engine_cap: engine_cap
            };

            if (car_image != null) {
                const imageUrl = await firebaseService.uploadFile(car_image, 'car_images');
                if (!imageUrl) {
                    console.log("Error uploading image");
                } else {
                    carData["car_image"] = imageUrl;
                }
            }

            console.log(usedCarId);
            console.log(carData);
            console.log(car_image);
            if (car_image != null) {
                console.log(car_image.name);
                console.log(car_image.type);
            } else {
                console.log("Car image is not updated.");
            }

            // Update the car document in Firestore
            await this.firebaseService.updateDocument('UsedCar', this.usedCarId, carData);
            console.log("Used car entry updated successfully");
            return true;
        } catch (error) {
            console.error("Error updating car entry:", error);
            return { success: false, message: error.message };
        }
    }

    // Delete a used car entry 
    async deleteUsedCar(usedCarId) {
        try {
            await this.firebaseService.deleteDocument('UsedCar', usedCarId);
            console.log("Used car entry deleted successfully");
            return true;
        } catch (error) {
            console.error("Error suspending car entry:", error);
            return { success: false, message: error.message };
        }
    }

    // Search for used cars by car name
    async searchUsedCar(carName, carType, priceRange, manufactureYear, agent_username, seller_username) {
        try {
            // const firebaseService = new FirebaseService();
            let carQuery = collection(db, 'UsedCar');
            let priceMin = priceRange[0];
            let priceMax = priceRange[1];

            console.log(priceMin);
            console.log(priceMax);

            const conditions = [];

            if (agent_username) {
                conditions.push(where("agent_username", "==", agent_username));
            }

            if (seller_username) {
                conditions.push(where("seller_username", "==", seller_username));
            }

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

            // Execute the query and retrieve matching documents
            const snapshot = await getDocs(finalQuery)
            const cars = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

            if (cars.length > 0) {
                return cars;
            } else {
                return null;
            }
        } catch (error) {
            console.error("Error searching for cars:", error);
            return { success: false, message: error.message };
        }
    }

    // increase counter for view_count or shortlist_count when clicked
    static async increaseCount(usedCarId, countType) {
        try {
            // Check if countType is valid
            if (countType !== "view" && countType !== "shortlist") {
                throw new Error("Invalid count type. Use 'view' or 'shortlist'");
            }

            // Get the current month in YYYY-MM format
            const current_month = new Date().toISOString().slice(0, 7);

            // Reference to the specific used car document in Firestore
            const carRef = doc(db, 'UsedCar', usedCarId);

            // Update Firestore document with incremented value
            await updateDoc(carRef, {
                [countType + "_count"]: increment(1),
                [`${countType}_history.${current_month}`]: increment(1)
            });

            console.log(`Successfully incremented ${countType} for car ID: ${usedCarId}`);
            return { success: true, message: `${countType} incremented successfully` };
        } catch (error) {
            console.error(`Error incrementing ${countType} for used car entry:`, error);
            return { success: false, message: error.message };
        }
    }

    static async decreaseCount(usedCarId, countType) {
        try {
            // Check if countType is valid
            if (countType !== "view" && countType !== "shortlist") {
                throw new Error("Invalid count type. Use 'view' or 'shortlist'");
            }

            // Get the current month in YYYY-MM format
            const current_month = new Date().toISOString().slice(0, 7);

            // Reference to the specific used car document in Firestore
            const carRef = doc(db, 'UsedCar', usedCarId);

            // Update Firestore document with decremented value
            await updateDoc(carRef, {
                [countType + "_count"]: increment(-1),
                [`${countType}_history.${current_month}`]: increment(-1)
            });

            console.log(`Successfully decremented ${countType} for car ID: ${usedCarId}`);
            return { success: true, message: `${countType} decremented successfully` };
        } catch (error) {
            console.error(`Error decrementing ${countType} for used car entry:`, error);
            return { success: false, message: error.message };
        }
    }

    static async trackViewCount(usedCarId) {
        try {
            const firebaseService = new FirebaseService();
            const carData = await firebaseService.getDocument('UsedCar', usedCarId);

            if (carData && carData.view_history !== undefined) {
                return carData.view_history; // Return only the count as an integer
            } else {
                throw new Error("View count not found for the provided used car ID");
            }
        } catch (error) {
            console.error("Error tracking view count:", error);
            return null; // Or handle as needed, e.g., return -1 to indicate error
        }
    }

    static async trackShortlistCount(usedCarId) {
        try {
            const firebaseService = new FirebaseService();
            const carData = await firebaseService.getDocument('UsedCar', usedCarId);

            if (carData && carData.shortlist_history !== undefined) {
                return carData.shortlist_history; // Return only the count as an integer
            } else {
                throw new Error("View count not found for the provided used car ID");
            }
        } catch (error) {
            console.error("Error tracking view count:", error);
            return null; // Or handle as needed, e.g., return -1 to indicate error
        }
    }

    // Retrieve a list of used cars by their IDs
    static async getUsedCarListById(usedCarIds) {
        try {
            const usedCars = [];

            // Loop through each ID and retrieve the document from Firestore
            for (const usedCarId of usedCarIds) {
                const carData = await UsedCar.firebaseService.getDocument('UsedCar', usedCarId);
                if (carData) {
                    usedCars.push({ id: usedCarId, ...carData });
                }
            }

            if (usedCars.length > 0) {
                return { success: true, data: usedCars };
            } else {
                return { success: false, message: "No used cars found for the provided IDs" };
            }
        } catch (error) {
            console.error("Error retrieving used cars by ID list:", error);
            return { success: false, message: error.message };
        }
    }

    static async getUsedCarList() {
        try {
            const firebaseService = new FirebaseService();
            const usedCar = await firebaseService.getDocuments('UsedCar');
            console.log(usedCar);
            return usedCar;
        } catch (error) {
            console.error("Error:", error);
            throw error;
        }
    }

    static async getUsedCarListByUsername(usertype, username) {
        try {
            const firebaseService = new FirebaseService();
            // const searchQuery = {
            //     usertype: username
            // }
            if (usertype === 'seller') {
                const usedCar = await firebaseService.searchByFields('UsedCar', { seller_username: username });
                console.log(usedCar);
                return usedCar;
            } else {
                const usedCar = await firebaseService.searchByFields('UsedCar', { agent_username: username });
                console.log(usedCar);
                return usedCar;
            }
        } catch (error) {
            console.error("Error:", error);
            throw error;
        }
    }
}
export default UsedCar;
