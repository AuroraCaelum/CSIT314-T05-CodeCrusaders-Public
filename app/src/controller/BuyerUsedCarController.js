import UsedCar from '../entity/UsedCar';

class BuyerSearchUsedCarController {

    // Search for a used car by multiple filters
    async BuyerSearchUsedCar(carName, cartype, priceRange, manufactureYear) {
        try {
            // Pass each filter parameter directly to the entity's search method
            const usedCar = new UsedCar();
            const result = await usedCar.searchUsedCar(carName, cartype, priceRange, manufactureYear, null, null);

            // Return the result (success or failure with message)
            return result;
        } catch (error) {
            console.error('Error searching for used cars:', error);
            return { success: false, message: error.message };
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
            return error;
        }
    }
}

export { BuyerSearchUsedCarController, BuyerViewUsedCarController }