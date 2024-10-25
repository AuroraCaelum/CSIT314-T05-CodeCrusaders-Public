// File path: src/controller/UsedCarController.js
import UsedCar from '../entity/UsedCar';
import UserAccount from '../entity/UserAccount';
class UsedCarController {

    // Create a new used car entry
    async createUsedCar(
        usedCarId, seller_username, car_name, car_type, 
        car_manufacturer, car_image, description, 
        features, accessories, price, milage, 
        manufacture_year, engine_cap, curb_weight
    ) {
        try {
            // Validate if the seller exists
            const isValidSeller = await UserAccount.validateSeller(seller_username);
            if (!isValidSeller) {
                return { success: false, message: 'Invalid seller username' };
            }

            // Proceed to create the used car entry if seller is valid
            const car = new UsedCar(
                usedCarId, seller_username, car_name, car_type, 
                car_manufacturer, car_image, description, 
                features, accessories, price, milage, 
                manufacture_year, engine_cap, curb_weight
            );
            const success = await car.createUsedCar();
            if (success) {
                return { success: true, message: 'Used car created successfully' };
            } else {
                return { success: false, message: 'Failed to create used car' };
            }
        } catch (error) {
            console.error('Error creating used car:', error);
            return { success: false, message: error.message };
        }
    }


    // View a used car by its ID
    async viewUsedCar(usedCarId) {
        try {
            const carData = await UsedCar.viewUsedCar(usedCarId);
            if (carData) {
                return { success: true, data: carData };
            } else {
                return { success: false, message: 'Used car not found' };
            }
        } catch (error) {
            console.error('Error viewing used car:', error);
            return { success: false, message: error.message };
        }
    }

    // Update an existing used car entry
    async updateUsedCar(
        usedCarId, seller_username, newData
    ) {
        try {
            // Validate if the seller exists
            const isValidSeller = await UserAccount.validateSeller(seller_username);
            if (!isValidSeller) {
                return { success: false, message: 'Invalid seller username' };
            }

            const success = await UsedCar.updateUsedCar(usedCarId, newData);
            if (success) {
                return { success: true, message: 'Used car updated successfully' };
            } else {
                return { success: false, message: 'Failed to update used car' };
            }
        } catch (error) {
            console.error('Error updating used car:', error);
            return { success: false, message: error.message };
        }
    }
    // Suspend a used car entry
    async deleteUsedCar(usedCarId) {
        try {
            const car = new UsedCar(usedCarId);
            const success = await car.deleteUsedCar();
            if (success) {
                return { success: true, message: 'Used car deleted successfully' };
            } else {
                return { success: false, message: 'Failed to delete used car' };
            }
        } catch (error) {
            console.error('Error suspending used car:', error);
            return { success: false, message: error.message };
        }
    }

    // Search for a used car by name
    async searchUsedCar(usedCarId) {
        try {
            const carData = await UsedCar.searchUsedCar(usedCarId);
            if (carData) {
                return { success: true, data: carData };
            } else {
                return { success: false, message: 'Used car not found' };
            }
        } catch (error) {
            console.error('Error searching for used car:', error);
            return { success: false, message: error.message };
        }
    }

    // Retrieve all used car entries
    static async getUsedCarList() {
        try {
            const usedCars = await UsedCar.getUsedCarList();
            return { success: true, data: usedCars };
        } catch (error) {
            console.error('Error fetching used cars:', error);
            return { success: false, message: error.message };
        }
    }
}

export default UsedCarController;
