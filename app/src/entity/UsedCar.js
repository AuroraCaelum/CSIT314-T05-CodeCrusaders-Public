import FirebaseService from './FirebaseService';

class Car {
    constructor(listingId, agentId, sellerId, carDetails, price) {
        this.listingId = listingId;
        this.agentId = agentId;
        this.sellerId = sellerId;
        this.carDetails = carDetails;
        this.price = price;
        this.firebaseService = new FirebaseService();
    }

    async createListing() {
        try {
            this.listingId = await this.firebaseService.addDocument('cars', {
                agentId: this.agentId,
                sellerId: this.sellerId,
                carDetails: this.carDetails,
                price: this.price,
                views: 0,
                shortlistedCount: 0
            });
        } catch (error) {
            console.error("Error creating car listing:", error);
        }
    }

    async getListing() {
        try {
            const listingData = await this.firebaseService.getDocument('cars', this.listingId);
            Object.assign(this, listingData);
        } catch (error) {
            console.error("Error fetching car listing:", error);
        }
    }

    async updateListing(newData) {
        try {
            await this.firebaseService.updateDocument('cars', this.listingId, newData);
            Object.assign(this, newData);
        } catch (error) {
            console.error("Error updating car listing:", error);
        }
    }
}

export default Car;
