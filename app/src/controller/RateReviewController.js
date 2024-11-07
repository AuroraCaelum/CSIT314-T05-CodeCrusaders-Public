// File path: src/controller/RateReviewController.js
import RateReview from '../entity/RateReview';

class LeaveRateReviewController {

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

class ViewRateReviewController {
    // Get all reviews for a specific agent

    async viewRateReview(rateReviewId) {
        try {
            const result = await RateReview.viewRateReview(rateReviewId);
            return result;
        } catch (error) {
            console.error('Error fetching reviews for agent:', error);
            return { success: false, message: error.message };
        }
    }
}

export { LeaveRateReviewController, ViewRateReviewController} ;
