import UsedCar from './entity/UsedCar'
import UserAccount from './entity/UserAccount'
import UserProfile from './entity/UserProfile'
import RateReview from './entity/RateReview'
import Shortlist from './entity/Shortlist'

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

    static async getShortlistList(username) {
        try {
            const shortlistList = await Shortlist.getShortlistList(username);
            console.log(shortlistList);
            return shortlistList;
        } catch (error) {
            console.log("Error:", error);
            throw error;
        }
    }

    static async increaseCount(usedCarId, countType) {
        try {
            const increase = await UsedCar.increaseCount(usedCarId, countType);
            console.log(increase);
            return increase;
        } catch (error) {
            console.log("Error:", error);
            throw error;
        }
    }

}

export { Util };