// File path: src/controller/SellerRateReviewController.js
import RateReview from '../entity/RateReview';

class SellerLeaveRateReviewController {

    // Create a new rate and review
    async leaveRateReview(agent_username, rate, review, reviewer_username, reviewer_type) {
        try {
            const rateReview = new RateReview(agent_username, rate, review, reviewer_username, reviewer_type);
            const result = await rateReview.leaveRateReview(agent_username, rate, review, reviewer_username, reviewer_type);
            return result;
        } catch (error) {
            console.error('Error creating rate and review:', error);
            return { success: false, message: error.message };
        }
    }
}

export { SellerLeaveRateReviewController } ;
