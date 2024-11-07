import UsedCar from './entity/UsedCar'
import UserAccount from './entity/UserAccount'
import UserProfile from './entity/UserProfile'
import RateReview from './entity/RateReview'

class Util {

    static async getUserAccountList() {
        try {
            const userList = await UserAccount.getUserAccountList();
            return userList;
        } catch (error) {
            console.log("Error:", error);
            throw error;
        }
    }

    static async getUserProfiles() {
        try {
            const userProfiles = await UserProfile.getUserProfiles();
            return userProfiles;
        } catch (error) {
            console.log("Error:", error);
            throw error;
        }
    }

    static async getUsedCarList() {
        try {
            const usedCarList = await UsedCar.getUsedCarList();
            return usedCarList;
        } catch (error) {
            console.log("Error:", error);
            throw error;
        }
    }

    static async getRateReviewList(agent_username) {
        try {
            const rateReviewList = await RateReview.getRateReviewList(agent_username);
            console.log(rateReviewList);
            return rateReviewList;
        } catch (error) {
            console.log("Error:", error);
            throw error;
        }
    }
}

export { Util };