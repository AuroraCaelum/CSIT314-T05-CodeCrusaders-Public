import RateReview from '../entity/RateReview';

class BuyerLeaveRateReviewController {

    // Create a new rate and review
    async leaveRateReview(agent_username, rate, review, reviewer_username, reviewer_type) {
        try {
            const rateReview = new RateReview(agent_username, rate, review, reviewer_username, reviewer_type);
            const result = await rateReview.leaveRateReview(agent_username, rate, review, reviewer_username, reviewer_type);
            return result;
        } catch (error) {
            console.error('Error creating rate and review:', error);
            return false;
        }
    }
}

export { BuyerLeaveRateReviewController } ;
