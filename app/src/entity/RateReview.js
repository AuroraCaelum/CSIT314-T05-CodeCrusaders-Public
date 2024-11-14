// File path: src/entity/RateReview.js
import FirebaseService from '../FirebaseService';

class RateReview {
    static firebaseService = new FirebaseService(); // Singleton FirebaseService

    // Add a new rate and review
    async leaveRateReview(agent_username, rate, review, reviewer_username, reviewer_type) {
        try {
            const reviewData = {
                rate: Number(rate),
                review: review,
                reviewerUsername: reviewer_username,
                reviewerType: reviewer_type,
                reviewTo: agent_username,
            };

            let documentId = Date.now().toString().concat(reviewer_username)

            await RateReview.firebaseService.addDocument('RateReview', documentId, reviewData);
            console.log("Rate and review saved successfully");
            return true;
        } catch (error) {
            console.error("Error saving rate and review:", error);
            return false;
        }
    }
    

    // Get detailed rate and review for Car agent
    static async viewRateReview(rateReviewId) {
        try {
            const review = await RateReview.firebaseService.getDocument('RateReview', rateReviewId);
            return review;
        } catch (error) {
            console.error("Error fetching reviews for agent:", error);
            return { success: false, message: error.message };
        }
    }

    // Get all rate and review for Car agent
    static async getRateReviewList(agent_username) {
        try {
            const firebaseService = new FirebaseService();
            const rateReview = await firebaseService.searchByFields('RateReview', { reviewTo: agent_username });
            console.log(rateReview);
            return rateReview;
        } catch (error) {
            console.error("Error:", error);
            throw error;
        }
    }

}

export default RateReview;
