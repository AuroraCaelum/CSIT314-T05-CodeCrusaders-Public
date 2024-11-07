// File path: src/controller/UsedCarController.js
import UsedCar from '../entity/UsedCar';
import UserAccount from '../entity/UserAccount';

class CreateUsedCarController {

    // Create a new used car entry
    async createUsedCar(
        usedCarId, agent_username, seller_username, car_name, car_type,
        car_manufacturer, car_image, description,
        features, price, mileage,
        manufacture_year, engine_cap
    ) {
        try {
            // Validate if the seller exists
            const isValidSeller = await UserAccount.validateSeller(seller_username);
            if (!isValidSeller) {
                return { success: false, message: 'Seller is not authorized to create used car listings.' };
            }
            console.log("New Car Details(C):", usedCarId, agent_username, seller_username, car_name, car_type, car_manufacturer, car_image, description, features, price, mileage, manufacture_year, engine_cap)

            const usedCar = new UsedCar(usedCarId, agent_username, seller_username, car_name, car_type, car_manufacturer, car_image, description, features, price, mileage, manufacture_year, engine_cap);
            await usedCar.createUsedCar(usedCarId, agent_username, seller_username, car_name, car_type, car_manufacturer, car_image, description, features, price, mileage, manufacture_year, engine_cap);
            console.log("Used car Creatd successfully");
            console.log("New Car Details(C22):", usedCarId, agent_username, seller_username, car_name, car_type, car_manufacturer, car_image, description, features, price, mileage, manufacture_year, engine_cap)
            return true;
            
        } catch (error) {
            console.error('Error creating used car:', error);
            return { success: false, message: error.message };
        }
    }
}

class ViewUsedCarController {

    static async getUsedCarList() {
        try {
            const usedCarList = await UsedCar.getUsedCarList();
            return usedCarList;
        } catch (error) {
            console.log("Error:", error);
            throw error;
        }
    }

    // View a used car by its ID
    async viewUsedCar(usedCarId) {
        try {
            const usedCar = new UsedCar();
            const carData = await usedCar.viewUsedCar(usedCarId);
            console.log("Car Data(C):", carData);
            return carData ;
        } catch (error) {
            console.error('Error viewing used car:', error);
            return error;
        }
    }
}

class UpdateUsedCarController {

    // Update an existing used car entry
    async updateUsedCar(usedCarId, seller_username, car_name, car_type, car_manufacturer, car_image, description, features, price, mileage, manufacture_year, engine_cap) {
        try {
            // Validate if the seller exists
            const isValidSeller = await UserAccount.validateSeller(seller_username);
            if (!isValidSeller) {
                console.log("Invalid Seller username");
            }

            const usedCar = new UsedCar(usedCarId, seller_username, car_name, car_type, car_manufacturer, car_image, description, features, price, mileage, manufacture_year, engine_cap);
            await usedCar.updateUsedCar(usedCarId, seller_username, car_name, car_type, car_manufacturer, car_image, description, features, price, mileage, manufacture_year, engine_cap);
            
            console.log("Used car updated successfully");
            return true;

        } catch (error) {
            console.error('Error updating used car:', error);
            return false;
        }
    }
}

class DeleteUsedCarController {

    // Suspend a used car entry
    async deleteUsedCar(usedCarId) {
        try {
            const usedCar = new UsedCar();
            const success = await usedCar.deleteUsedCar(usedCarId);
            if (success) {
                console.log(usedCarId);
                return { success: true, message: 'Used car deleted successfully' };
            } else {
                return { success: false, message: 'Failed to delete used car' };
            }
        } catch (error) {
            console.error('Error suspending used car:', error);
            return { success: false, message: error.message };
        }
    }
}

class SearchUsedCarController {

    // Search for a used car by multiple filters
    async searchUsedCar(carName, cartype, priceRange, manufactureYear) {
        try {
            // Pass each filter parameter directly to the entity's search method
            const usedCar = new UsedCar();
            const result = await usedCar.searchUsedCar(carName, cartype, priceRange, manufactureYear);

            // Return the result (success or failure with message)
            return result;
        } catch (error) {
            console.error('Error searching for used cars:', error);
            return { success: false, message: error.message };
        }
    }
}


class GetUsedCarViewCountController {
    async getUsedCarViewCount(usedCarId) {

    }
}


class GetUsedCarShortlistCountController {
    async getUsedCarShortlistCount(usedCarId) {

    }
}

export { CreateUsedCarController, ViewUsedCarController, UpdateUsedCarController, DeleteUsedCarController, SearchUsedCarController, GetUsedCarViewCountController, GetUsedCarShortlistCountController };