// File path: src/entity/UsedCar.js
import FirebaseService from '../FirebaseService';

class UsedCar {
    constructor(
        agent_username,
        usedCarId,
        seller_username,
        car_name,
        car_type,
        car_manufacturer,
        car_image,
        description,
        features,
        accessories,
        price,
        milage,
        manufacture_year,
        engine_cap,
        curb_weight
    ) {
        this.agent_username = agent_username;
        this.usedCarId = usedCarId;
        this.seller_username = seller_username;
        this.car_name = car_name;
        this.car_type = car_type;
        this.car_manufacturer = car_manufacturer;
        this.car_image = car_image;
        this.description = description;
        this.features = features;
        this.accessories = accessories;
        this.price = price;
        this.milage = milage;
        this.manufacture_year = manufacture_year;
        this.engine_cap = engine_cap;
        this.curb_weight = curb_weight;
        this.firebaseService = new FirebaseService();
    }

    // Create a new used car entry
    async createUsedCar() {
        try {
            const imageUrl = await this.firebaseService.uploadFile(this.car_image, 'car_images');

            const carData = {
                agent_username: this.agent_username,
                seller_username: this.seller_username,
                car_name: this.car_name,
                car_type: this.car_type,
                car_manufacturer: this.car_manufacturer,
                car_image: imageUrl,
                description: this.description,
                features: this.features,
                // accessories: this.accessories,
                price: this.price,
                milage: this.milage,
                manufacture_year: this.manufacture_year,
                engine_cap: this.engine_cap,
                // curb_weight: this.curb_weight,
            };
            await this.firebaseService.addDocument('UsedCar', this.usedCarId, carData);
            console.log("Used car entry created successfully");
            return { success: true, message: "Used car entry created successfully" };
        } catch (error) {
            console.error("Error creating used car entry:", error);
            return { success: false, message: error.message };
        }
    }

    // View a used car entry by usedCarId
    static async viewUsedCar(usedCarId) {
        try {
            const carData = await this.firebaseService.getDocument('UsedCar', usedCarId);
            if (carData) {
                console.log("Car data:", carData);
                return { success: true, data: carData };
            } else {
                return { success: false, message: "Car not found" };
            }
        } catch (error) {
            console.error("Error fetching car data:", error);
            return { success: false, message: error.message };
        }
    }

    // Update an existing used car entry by usedCarId
    static async updateUsedCar(usedCarId, newData) {
        try {
            //  Check if a new image file is provided and upload if necessary
            let imageUrl = null;
            if (newData.car_image) {
                imageUrl = await this.firebaseService.uploadFile(newData.car_image, 'car_images');
            }

            //  Prepare car data with the new or existing image URL
            const carData = {
                seller_username: newData.seller_username,
                car_name: newData.car_name,
                car_type: newData.car_type,
                car_manufacturer: newData.car_manufacturer,
                car_image: imageUrl || null, // Use the new URL if provided, or retain existing if null
                description: newData.description,
                features: newData.features,
                accessories: newData.accessories,
                price: newData.price,
                milage: newData.milage,
                manufacture_year: newData.manufacture_year,
                engine_cap: newData.engine_cap,
                curb_weight: newData.curb_weight
            };

            // Update the car document in Firestore
            await this.firebaseService.updateDocument('UsedCar', usedCarId, carData);
            console.log("Used car entry updated successfully");
            return { success: true, message: "Used car entry updated successfully" };
        } catch (error) {
            console.error("Error updating car entry:", error);
            return { success: false, message: error.message };
        }
    }

    // Delete a used car entry 
    async deleteUsedCar(usedCarId) {
        try {
            await this.firebaseService.updateDocument('UsedCar', usedCarId, { suspended: true });
            console.log("Used car entry deleted successfully");
            return { success: true, message: "Used car entry deleted successfully" };
        } catch (error) {
            console.error("Error suspending car entry:", error);
            return { success: false, message: error.message };
        }
    }

    // Search for used cars by car name
    static async searchUsedCar(carmodel, cartype, priceMin, priceMax, manufactureYear) {
        try {
            let query = this.firebaseService.collection('UsedCar');

            // Apply `carmodel` (car_name) filter if provided
            if (carmodel) {
                query = query.where("car_name", "==", carmodel);
            }

            // Apply `cartype` (car_type) filter if provided
            if (cartype) {
                query = query.where("car_type", "==", cartype);
            }

            // Apply `price` range filter if provided
            if (priceMin !== undefined && priceMax !== undefined) {
                query = query.where("price", ">=", priceMin)
                    .where("price", "<=", priceMax);
            } else if (priceMin !== undefined) {
                query = query.where("price", ">=", priceMin);
            } else if (priceMax !== undefined) {
                query = query.where("price", "<=", priceMax);
            }

            // Apply `manufactureYear` filter if provided
            if (manufactureYear) {
                query = query.where("manufacture_year", "==", manufactureYear);
            }

            // Execute the query and retrieve matching documents
            const snapshot = await query.get();
            const cars = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

            if (cars.length > 0) {
                return { success: true, data: cars };
            } else {
                return { success: false, message: "No cars found matching the criteria" };
            }
        } catch (error) {
            console.error("Error searching for cars:", error);
            return { success: false, message: error.message };
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
}

export default UsedCar;
