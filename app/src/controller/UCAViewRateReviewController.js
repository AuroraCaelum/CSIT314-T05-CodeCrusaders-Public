import RateReview from '../entity/RateReview';

class UCAViewRateReviewController {
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

export { UCAViewRateReviewController } ;
