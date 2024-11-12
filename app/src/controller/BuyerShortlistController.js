import Shortlist from '../entity/Shortlist';
import UsedCar from '../entity/UsedCar';

class BuyerViewShortlistController {

    // View a used car by its ID
    async viewUsedCarFromShortlist(usedCarId) {
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

class BuyerSaveShortlistController {

    // Method to save a car to the user's shortlist
    async saveToShortlist(username, car) {
        try {

            console.log("Check save Shortlist at Controller: ", username, car.car_name);
            const result = await Shortlist.saveToShortlist(username, car);
            return result;
        } catch (error) {
            console.error('Error saving car to shortlist:', error);
            return { success: false, message: error.message };
        }
    }
}

class BuyerSearchShortlistController {

    // Method to search for cars in the user's shortlist based on filters
    async searchShortlist(username, car_name, car_type, priceRange, manufactureYear) {
        try {
            // First, retrieve the list of shortlisted car IDs that match the criteria
            const shortlistResult = await Shortlist.searchShortlist(username, car_name, car_type, priceRange, manufactureYear);
            if (!shortlistResult.success) {
                return { success: false, message: "No cars found in shortlist matching the criteria." };
            }

            return shortlistResult;
        } catch (error) {
            console.error('Error searching in shortlist:', error);
            return { success: false, message: error.message };
        }
    }
}

class BuyerDeleteShortlistController {
    // Suspend a used car entry
    async deleteShortlist(shortlistId) {
        try {
            const shortlist = new Shortlist();
            const success = await shortlist.deleteShortlist(shortlistId);
            if (success) {
                console.log(shortlistId);
                return { success: true, message: 'Shortlist entry deleted successfully' };
            } else {
                return { success: false, message: 'Failed to delete shortlist' };
            }
        } catch (error) {
            console.error('Error suspending used car:', error);
            return { success: false, message: error.message };
        }
    }
}

export { BuyerSaveShortlistController, BuyerSearchShortlistController, BuyerViewShortlistController, BuyerDeleteShortlistController };
