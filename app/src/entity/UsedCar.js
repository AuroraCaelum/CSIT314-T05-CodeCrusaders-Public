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
        price,
        mileage,
        manufacture_year,
        engine_cap,
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
        this.price = price;
        this.milage = mileage;
        this.manufacture_year = manufacture_year;
        this.engine_cap = engine_cap;
        this.firebaseService = new FirebaseService();
    }

    // Create a new used car entry
    async createUsedCar(agent_username, seller_username, car_name, car_type, car_manufacturer, car_image, description, features, price, mileage, manufacture_year, engine_cap) {
        try {
            //const imageUrl = await this.firebaseService.uploadFile(this.car_image, 'car_images');
            const firebaseService = new FirebaseService();
            const imageUrl = await firebaseService.uploadFile(car_image, 'car_images');
            if (!imageUrl) console.log("Error uploading image");

            const carData = {
                agent_username: agent_username,
                seller_username: seller_username,
                car_name: car_name,
                car_type: car_type,
                car_manufacturer: car_manufacturer,
                car_image: imageUrl,
                description: description,
                features: features,
                price: price,
                mileage: mileage,
                manufacture_year: manufacture_year,
                engine_cap: engine_cap,
            };

            console.log("New Car Details(E):", agent_username, seller_username, car_name, car_type, car_manufacturer, car_image, description, features, price, mileage, manufacture_year, engine_cap)
            await this.firebaseService.addDocument('UsedCar', this.usedCarId, carData);
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
            return { "usedCarId" : usedCarId, "body" : carData };
        } catch (error) {
            console.error("Error fetching car data:", error);
            throw error;
        }
    }

    // Update an existing used car entry by usedCarId
    async updateUsedCar(usedCarId, seller_username, car_name, car_type, car_manufacturer, car_image, description, features, price, mileage, manufacture_year, engine_cap) {
        try {
            //  Check if a new image file is provided and upload if necessary
            let imageUrl = null;
            if (usedCarId.car_image) {
                imageUrl = await this.firebaseService.uploadFile(usedCarId.car_image, 'car_image');
            }

            //  Prepare car data with the new or existing image URL
            const carData = {
                seller_username: seller_username,
                car_name: car_name,
                car_type: car_type,
                car_manufacturer: car_manufacturer,
                car_image: imageUrl,
                description: description,
                features: features,
                price: price,
                mileage: mileage,
                manufacture_year: manufacture_year,
                engine_cap: engine_cap
            };

            console.log(usedCarId);
            console.log(carData);

            // Update the car document in Firestore
            await this.firebaseService.updateDocument('UsedCar', usedCarId, carData);
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
