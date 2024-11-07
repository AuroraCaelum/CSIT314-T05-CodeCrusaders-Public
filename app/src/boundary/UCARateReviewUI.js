import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import "./UCARateReviewUI.css";
import { Util } from "../Util";
import { UserLogoutController } from "../controller/UserAuthController";
import { ViewRateReviewController } from "../controller/RateReviewController";

import Swal from 'sweetalert2';

function UCARateReviewUI() {
    const [username] = useState(Cookies.get("username"));
    const [rateReviewList, setRateReviewList] = useState([
        { rate: "Loading...", review: "Loading...", reviewer_username: "Loading..." }
    ]);

    const fetchRateReview = async () => {
        const snapshot = await Util.getRateReviewList(username);
        console.log(snapshot)
        if (snapshot !== null) {
            const rateReviewData = snapshot.map(doc => ({
                rateReviewId: doc.documentId,
                rate: doc.rate,
                review: doc.review,
                reviewer_username: doc.reviewerUsername,
            }));
            setRateReviewList(rateReviewData);
        }
    };

    useEffect(() => {
        fetchRateReview();
    }, []);

    const viewRateReview = async (rateReviewId) => {
        const viewRateReviewController = new ViewRateReviewController();

        try {
            const rateReview = await viewRateReviewController.viewRateReview(rateReviewId);
            console.log(rateReview)
            if (rateReview) {
                Swal.fire({
                    title: 'View Rate and Review',
                    html: `
                        <div style="text-align: left;">
                            <strong>Rating</strong> ${rateReview.rate}<br>
                            <strong>Review</strong> ${rateReview.review}<br>
                            <strong>Review By</strong> ${rateReview.reviewerUsername} (${rateReview.reviewerType})<br>
                        </div>
                    `,
                    cancelButtonText: 'close',
                    focusConfirm: false
                });
            } else {
                Swal.fire({
                    title: 'No Reviews Found',
                    text: 'There is no review for this Agent',
                    icon: 'info',
                    confirmButtonText: 'Close'
                })
            }

        } catch (error) {
            console.error("Error displaying reviews", error);
        }

    };

    const handleLogout = async () => {
        const userAuthController = new UserLogoutController();
        const logout = await userAuthController.logout();
        if (logout) {
            Swal.fire({
                position: "center",
                title: 'Logout Successful',
                icon: 'success',
                confirmButtonText: 'Back to login',
                timer: 1500
            }).then(() => {
                window.open("/CSIT314-T05-CodeCrusaders/", "_self")
            });
        } else {
            Swal.fire({
                position: "center",
                title: 'Logout Failed',
                icon: 'error',
                confirmButtonText: 'OK',
                timer: 1500
            });
        }
    };

    const handleBack = () => {
        window.history.back();
    };

    return (
        <div className="rarContainer">
            <div className="rarHeader">
                <button onClick={handleBack} className="rarBack-button">
                    Back
                </button>
                <div className="rarProfile-picture">
                    <img
                        src={"https://placehold.co/40x40?text=" + Cookies.get("username")}
                        alt="Profile"
                    />
                </div>
                <span className="rarUsername">{username}</span>
                <button onClick={handleLogout} className="rarLogout-button">
                    Logout
                </button>
            </div>

            <div className="rarUser-table">
                <div className="rarTable-header">
                    <span>Ratings</span>
                    <span>Reviews</span>
                    <span>Reviewer</span>
                    <span></span>
                </div>
                {rateReviewList.map((rateReview => (
                    <div key={rateReview.username} className="rarTable-row">
                        <span>{rateReview.rate}</span>
                        <span>{rateReview.review}</span>
                        <span>{rateReview.reviewer_username}</span>
                        <button onClick={() => viewRateReview(rateReview.rateReviewId)} className="rarInspect-button">
                            View
                        </button>
                    </div>

                )))}
            </div>
        </div>
    );
}

export default UCARateReviewUI;
