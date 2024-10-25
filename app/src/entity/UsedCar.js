// File path: src/entity/UsedCar.js
import FirebaseService from '../FirebaseService';

class UsedCar {
    constructor(
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
            const carData = {
                seller_username: this.seller_username,
                car_name: this.car_name,
                car_type: this.car_type,
                car_manufacturer: this.car_manufacturer,
                car_image: this.car_image,
                description: this.description,
                features: this.features,
                accessories: this.accessories,
                price: this.price,
                milage: this.milage,
                manufacture_year: this.manufacture_year,
                engine_cap: this.engine_cap,
                curb_weight: this.curb_weight,
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
            await this.firebaseService.updateDocument('UsedCar', usedCarId, newData);
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
    static async searchUsedCar(usedCarId) {
        try {
            const cars = await this.firebaseService.searchByFields('UsedCar', { usedCarId });
            if (cars.length > 0) {
                return { success: true, data: cars };
            } else {
                return { success: false, message: "No cars found" };
            }
        } catch (error) {
            console.error("Error searching for cars:", error);
            return { success: false, message: error.message };
        }
    }

    // Get a list of all used cars
    static async getUsedCarList() {
        try {
            const carList = await this.firebaseService.getDocuments('UsedCar');
            console.log(carList);
            return { success: true, data: carList };
        } catch (error) {
            console.error("Error fetching used car list:", error);
            return { success: false, message: error.message };
        }
    }
}

export default UsedCar;
