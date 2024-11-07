// File path: src/entity/RateReview.js
import FirebaseService from '../FirebaseService';

class RateReview {
    static firebaseService = new FirebaseService(); // Singleton FirebaseService

    // constructor(rate, reviewBody, reviewBy, reviewByType, reviewTo) {
    //     this.rate = rate;
    //     this.reviewBody = reviewBody;
    //     this.reviewBy = reviewBy;
    //     this.reviewByType = reviewByType;
    //     this.reviewTo = reviewTo;
    // }

    // Add a new rate and review
    async leaveRateReview(agent_username, rate, review, reviewer_username, reviewer_type) {
        try {
            const reviewData = {
                rate: rate,
                review: review,
                reviewerUsername: reviewer_username,
                reviewerType: reviewer_type,
                reviewTo: agent_username,
            };

            await RateReview.firebaseService.addDocument('RateReview', reviewer_username, reviewData);
            console.log("Rate and review saved successfully");
            return { success: true, message: "Rate and review saved successfully" };
        } catch (error) {
            console.error("Error saving rate and review:", error);
            return { success: false, message: error.message };
        }
    }

    // Get all rate and review for Car agent
    static async viewRateReview(agentUsername) {
        try {
            const reviews = await RateReview.firebaseService.searchByFields('RateReview', { reviewTo: agentUsername });
            if (reviews.length > 0) {
                console.log("Reviews found:", reviews);
                return { success: true, data: reviews };
            } else {
                return { success: false, message: "No reviews found for this agent" };
            }
        } catch (error) {
            console.error("Error fetching reviews for agent:", error);
            return { success: false, message: error.message };
        }
    }
}

export default RateReview;
