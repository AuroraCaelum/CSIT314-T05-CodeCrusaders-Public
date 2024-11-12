import UsedCar from '../entity/UsedCar';

class SellerViewUsedCarController {

    // View a used car by its ID
    async viewUsedCar(usedCarId) {
        try {
            const usedCar = new UsedCar();
            const carData = await usedCar.viewUsedCar(usedCarId);
            console.log("Car Data(C):", carData);
            return carData;
        } catch (error) {
            console.error('Error viewing used car:', error);
            return error;
        }
    }
}

class SellerSearchUsedCarController {

    // Search for a used car by multiple filters
    async searchUsedCar(carName, cartype, priceRange, manufactureYear, seller_username) {
        try {
            // Pass each filter parameter directly to the entity's search method
            const usedCar = new UsedCar();
            const result = await usedCar.searchUsedCar(carName, cartype, priceRange, manufactureYear, null, seller_username);

            // Return the result (success or failure with message)
            return result;
        } catch (error) {
            console.error('Error searching for used cars:', error);
            return { success: false, message: error.message };
        }
    }
}

class SellerTrackViewCountController {
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

class SellerTrackShortlistCountController {
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

export { SellerSearchUsedCarController, SellerTrackViewCountController, SellerViewUsedCarController, SellerTrackShortlistCountController }