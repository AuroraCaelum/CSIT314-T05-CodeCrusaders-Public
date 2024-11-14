import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import "./UCARateReviewUI.css";
import { Util } from "../Util";
import { UserLogoutController } from "../controller/UserAuthController";
import { UCAViewRateReviewController } from "../controller/UCAViewRateReviewController";

import Swal from 'sweetalert2';

function UCARateReviewUI() {
    const [username] = useState(Cookies.get("username"));
    const [rateReviewList, setRateReviewList] = useState([]);

    const fetchRateReview = async () => {
        const snapshot = await Util.getRateReviewList(username);
        console.log(snapshot)
        if (snapshot !== null) {
            const rateReviewData = snapshot.map(doc => ({
                rateReviewId: doc.documentId,
                rate: doc.rate,
                review: (review => review.length >= 150 ? review.substring(0, 150) + "..." : review)(doc.review),
                reviewer_username: doc.reviewerUsername,
            }));
            setRateReviewList(rateReviewData);
        }
    };

    useEffect(() => {
        fetchRateReview();
    }, []);

    const viewRateReview = async (rateReviewId) => {
        const ucaViewRateReviewController = new UCAViewRateReviewController();

        try {
            const rateReview = await ucaViewRateReviewController.viewRateReview(rateReviewId);
            console.log(rateReview)
            if (rateReview != null) {
                Swal.fire({
                    title: 'View Rate and Review',
                    html: `
                        <div style="text-align: left;">
                            <div style="margin-bottom: 10px;">
                                <strong>Rating</strong>
                                <span>
                                    <span class="star" style="font-size: 2em; color: ${1 <= rateReview.rate ? 'gold' : 'gray'}; cursor: pointer;">&#9733;</span>
                                    <span class="star" style="font-size: 2em; color: ${2 <= rateReview.rate ? 'gold' : 'gray'}; cursor: pointer;">&#9733;</span>
                                    <span class="star" style="font-size: 2em; color: ${3 <= rateReview.rate ? 'gold' : 'gray'}; cursor: pointer;">&#9733;</span>
                                    <span class="star" style="font-size: 2em; color: ${4 <= rateReview.rate ? 'gold' : 'gray'}; cursor: pointer;">&#9733;</span>
                                    <span class="star" style="font-size: 2em; color: ${5 <= rateReview.rate ? 'gold' : 'gray'}; cursor: pointer;">&#9733;</span>
                                </span>
                            </div>
                            <div style="margin-bottom: 10px;">
                                <strong>Review</strong> ${rateReview.review}
                            </div>
                            <div style="margin-bottom: 10px;">
                                <strong>Review By</strong> ${rateReview.reviewerUsername} (${rateReview.reviewerType})
                            </div>
                        </div>
                    `,
                    cancelButtonText: 'close',
                    focusConfirm: false
                });
            } else {
                Swal.fire({
                    title: 'Error!',
                    text: 'Failed to fetch review from the database.',
                    icon: 'error',
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
                        <span>{[1, 2, 3, 4, 5].map((value) => (
                            <span key={value} className="star" style={{ fontSize: '2em', color: value <= rateReview.rate ? 'gold' : 'gray' }}>&#9733;</span>
                        ))}</span>
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
