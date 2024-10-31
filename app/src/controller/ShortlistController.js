import ShortList from '../entity/Shortlist';
import UsedCar from '../entity/UsedCar';

class SaveShortlistController {

    // Method to save a car to the user's shortlist
    async saveToShortlist(username, usedCarID) {
        try {
            const result = await ShortList.saveToShortlist(username, usedCarID);
            return result;
        } catch (error) {
            console.error('Error saving car to shortlist:', error);
            return { success: false, message: error.message };
        }
    }
}

class SearchShortlistController {

    // Method to search for cars in the user's shortlist based on filters
    async searchShortlist(username, car_name, car_type, priceMin, priceMax, manufactureYear) {
        try {
            // First, retrieve the list of shortlisted car IDs that match the criteria
            const shortlistResult = await ShortList.searchShortlist(username, car_name, car_type, priceMin, priceMax, manufactureYear);
            if (!shortlistResult.success) {
                return { success: false, message: "No cars found in shortlist matching the criteria." };
            }

            // Extract the list of usedCarIDs from the shortlist result
            const usedCarIds = shortlistResult.data.map(car => car.usedCarID);

            // Fetch the details of each car by its ID
            const carListResult = await UsedCar.getUsedCarListById(usedCarIds);
            if (!carListResult.success) {
                return { success: false, message: "Error retrieving car details from the shortlist." };
            }

            return { success: true, data: carListResult.data };
        } catch (error) {
            console.error('Error searching in shortlist:', error);
            return { success: false, message: error.message };
        }
    }
}

export { SaveShortlistController, SearchShortlistController};
