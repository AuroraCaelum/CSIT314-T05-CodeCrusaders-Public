import UsedCar from '../entity/UsedCar';
import UserAccount from '../entity/UserAccount';

class UCACreateUsedCarController {

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
                return 1;
            }

            const usedCar = new UsedCar();
            await usedCar.createUsedCar(usedCarId, agent_username, seller_username, car_name, car_type, car_manufacturer, car_image, description, features, price, mileage, manufacture_year, engine_cap);
            console.log("Used car Creatd successfully");
            return 0;
        } catch (error) {
            console.error('Error creating used car:', error);
            return 2;
        }
    }
}

class UCAViewUsedCarController {

    // View a used car by its ID
    async viewUsedCar(usedCarId) {
        try {
            const usedCar = new UsedCar();
            const carData = await usedCar.viewUsedCar(usedCarId);

            console.log("Success viewing Used car: ", usedCarId);
            return carData;
        } catch (error) {
            console.error('Error viewing used car:', error);
            return null;
        }
    }
}

class UCAUpdateUsedCarController {

    // Update an existing used car entry
    async updateUsedCar(usedCarId, seller_username, car_name, car_type, car_manufacturer, car_image, description, features, price, mileage, manufacture_year, engine_cap) {
        try {
            // Validate if the seller exists
            const isValidSeller = await UserAccount.validateSeller(seller_username);
            if (!isValidSeller) {
                return 1;
            }

            const usedCar = new UsedCar();
            await usedCar.updateUsedCar(usedCarId, seller_username, car_name, car_type, car_manufacturer, car_image, description, features, price, mileage, manufacture_year, engine_cap);

            console.log("Used car updated successfully: ", usedCarId);
            return 0;

        } catch (error) {
            console.error('Error updating used car:', error);
            return 2;
        }
    }
}

class UCADeleteUsedCarController {

    // Suspend a used car entry
    async deleteUsedCar(usedCarId) {
        try {
            const usedCar = new UsedCar();
            const success = await usedCar.deleteUsedCar(usedCarId);
            return success;
        } catch (error) {
            console.error('Error suspending used car:', error);
            return false;
        }
    }
}

class UCASearchUsedCarController {

    // Search for a used car by multiple filters
    async searchUsedCar(carName, carType, priceRange, manufactureYear, agent_username) {
        try {
            // Pass each filter parameter directly to the entity's search method
            const usedCar = new UsedCar();
            const result = await usedCar.searchUsedCar(carName, carType, priceRange, manufactureYear, agent_username, null);

            // Return the result (success or failure with message)
            return result;
        } catch (error) {
            console.error('Error searching for used cars:', error);
            return { success: false, message: error.message };
        }
    }
}

class UCATrackViewCountController {
    async trackViewCount(usedCarId) {
        try {
            const viewCountHistory = await UsedCar.trackViewCount(usedCarId);
            return viewCountHistory; // Returns true if successful, false otherwise
        } catch (error) {
            console.error("Controller Error tracking view count:", error);
            return false; // Or handle as needed
        }
    }
}

class UCATrackShortlistCountController {
    async trackShortlistCount(usedCarId) {
        try {
            const shortlistCountHistory = await UsedCar.trackShortlistCount(usedCarId);
            return shortlistCountHistory; // Returns true if successful, false otherwise
        } catch (error) {
            console.error("Controller Error tracking shortlist count:", error);
            return false; // Or handle as needed
        }
    }
}

export { UCACreateUsedCarController, UCAViewUsedCarController, UCAUpdateUsedCarController, UCADeleteUsedCarController, UCASearchUsedCarController, UCATrackViewCountController, UCATrackShortlistCountController }