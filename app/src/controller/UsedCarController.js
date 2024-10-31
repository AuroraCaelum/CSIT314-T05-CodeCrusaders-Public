// File path: src/controller/UsedCarController.js
import UsedCar from '../entity/UsedCar';
import UserAccount from '../entity/UserAccount';

class CreateUsedCarController {

    // Create a new used car entry
    async createUsedCar(
        agent_username, seller_username, car_name, car_type, 
        car_manufacturer, car_image, description, 
        features, accessories, price, milage, 
        manufacture_year, engine_cap, curb_weight
    ) {
        try {
            // Validate if the seller exists
            const isValidSeller = await UserAccount.validateSeller(seller_username);
            if (!isValidSeller) {
                return { success: false, message: 'Seller is not authorized to create used car listings.' };
            }

            // Proceed to create the used car entry if seller is valid
            const car = new UsedCar(
                agent_username, seller_username, car_name, car_type, 
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
}

class ViewUsedCarController {

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
}

class UpdateUsedCarController {

    // Update an existing used car entry
    async updateUsedCar(
        usedCarID, seller_username, car_name, car_type, 
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
            const newData = {
                usedCarID,
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
            };
            
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
}

class DeleteUsedCarController {

    // Suspend a used car entry
    async deleteUsedCar(usedCarId) {
        try {
            const success = await car.deleteUsedCar(usedCarId);
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
}

class SearchUsedCarController {

    // Search for a used car by multiple filters
    async searchUsedCar(carmodel, cartype, priceMin, priceMax, manufactureYear) {
        try {
            // Pass each filter parameter directly to the entity's search method
            const result = await UsedCar.searchUsedCar(carmodel, cartype, priceMin, priceMax, manufactureYear);

            // Return the result (success or failure with message)
            return result;
        } catch (error) {
            console.error('Error searching for used cars:', error);
            return { success: false, message: error.message };
        }
    }
}

export { CreateUsedCarController, ViewUsedCarController, UpdateUsedCarController, DeleteUsedCarController, SearchUsedCarController };
