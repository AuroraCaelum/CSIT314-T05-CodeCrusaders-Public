// File path: src/controller/RateReviewController.js
import RateReview from '../entity/RateReview';

class CreateReviewController {

    // Create a new rate and review
    async createRateReview(rate, reviewBody, reviewBy, reviewByType, reviewTo, reviewId) {
        try {
            const review = new RateReview(rate, reviewBody, reviewBy, reviewByType, reviewTo);
            const result = await review.createRateReview(reviewId);
            return result;
        } catch (error) {
            console.error('Error creating rate and review:', error);
            return { success: false, message: error.message };
        }
    }
}

class RateReviewController {
    // Get all reviews for a specific agent
    async viewRateReviewsForAgent(agentUsername) {
        try {
            const result = await RateReview.viewRateReview(agentUsername);
            return result;
        } catch (error) {
            console.error('Error fetching reviews for agent:', error);
            return { success: false, message: error.message };
        }
    }
}

export { CreateReviewController, RateReviewController} ;
