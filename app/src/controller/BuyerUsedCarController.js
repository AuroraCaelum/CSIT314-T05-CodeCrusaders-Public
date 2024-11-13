import UsedCar from '../entity/UsedCar';

class BuyerSearchUsedCarController {

    // Search for a used car by multiple filters
    async searchUsedCar(carName, carType, priceRange, manufactureYear) {
        try {
            // Pass each filter parameter directly to the entity's search method
            const usedCar = new UsedCar();
            const result = await usedCar.searchUsedCar(carName, carType, priceRange, manufactureYear, null, null);

            // Return the result (success or failure with message)
            return result;
        } catch (error) {
            console.error('Error searching for used cars:', error);
            return null;
        }
    }
}

class BuyerViewUsedCarController {

    // View a used car by its ID
    async viewUsedCar(usedCarId) {
        try {
            const usedCar = new UsedCar();
            const carData = await usedCar.viewUsedCar(usedCarId);
            console.log("Car Data(C):", carData);
            return carData;
        } catch (error) {
            console.error('Error viewing used car:', error);
            return null;
        }
    }
}

class BuyerTrackViewCountController {
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

class BuyerTrackShortlistCountController {
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

export { BuyerSearchUsedCarController, BuyerViewUsedCarController, BuyerTrackViewCountController, BuyerTrackShortlistCountController }