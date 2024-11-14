import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import "./BuyerShortlistUI.css";
import { Util } from "../Util";
import { UserLogoutController } from "../controller/UserAuthController";
import { BuyerLeaveRateReviewController } from "../controller/BuyerRateReviewController";
import { BuyerLoanCalculatorController } from "../controller/BuyerLoanCalculatorController";
import { BuyerViewShortlistController, BuyerSearchShortlistController, BuyerDeleteShortlistController } from "../controller/BuyerShortlistController";

import Swal from 'sweetalert2';

function BuyerShortlistUI() {
    const [username] = useState(Cookies.get("username"));
    const [shortlist, setShortlist] = useState([]);

    const fetchCars = async () => {
        const snapshot = await Util.getShortlistList(username);
        if (snapshot !== null) {
            if (snapshot === undefined || snapshot.length === 0) {
                const carData = [];
                setShortlist(carData);
            } else {
                const carData = snapshot.map(doc => ({
                    shortlistId: doc.documentId,
                    usedCarId: doc.usedCarId,
                    car_name: doc.car_name,
                    description: (desc => desc.length >= 150 ? desc.substring(0, 150) + "..." : desc)(doc.description),
                    manufacture_year: doc.manufacture_year,
                    mileage: doc.mileage,
                    price: doc.price,
                    car_image: doc.car_image
                }));
                setShortlist(carData);
            }
        }
    };

    useEffect(() => {
        fetchCars();
    }, []);

    const clearSearch = async () => {
        document.getElementById('car_name_search_input').value = '';
        document.getElementById('carType_search_input').value = '';
        document.getElementById('priceRange_search_input').value = '';
        document.getElementById('manufactureYear_search_input').value = '';

        fetchCars();
    };

    const searchShortlist = async () => {
        const carNameInput = document.getElementById('car_name_search_input');
        const carTypeInput = document.getElementById('carType_search_input');
        const priceRangeInput = document.getElementById('priceRange_search_input');
        const manufactureYearInput = document.getElementById('manufactureYear_search_input');

        let priceRange = priceRangeInput.value.toString().split("-");

        const filterCriteria = {
            car_name: carNameInput ? carNameInput.value : '',
            car_type: carTypeInput.value,
            priceRange: priceRange,
            manufactureYear: manufactureYearInput.value
        };
        
        console.log(filterCriteria)

        const buyerSearchShortlistController = new BuyerSearchShortlistController();
        const searchResult = await buyerSearchShortlistController.searchShortlist(
            Cookies.get('username'),
            filterCriteria.car_name,
            filterCriteria.car_type,
            filterCriteria.priceRange,
            filterCriteria.manufactureYear
        );

        console.log(searchResult);

        if (searchResult === null) {
            console.log("Search results:", searchResult);
            Swal.fire({
                title: 'No Results',
                text: 'No used cars found matching the search criteria.',
                icon: 'info',
                confirmButtonText: 'OK'
            });
        } else {
            console.log(searchResult);
            const shortlistData = searchResult.map(doc => ({
                usedCarId: doc.usedCarId,
                car_name: doc.car_name,
                car_type: doc.car_type,
                manufacture_year: doc.manufacture_year,
                description: (desc => desc.length >= 150 ? desc.substring(0, 150) + "..." : desc)(doc.description),
                mileage: doc.mileage,
                price: doc.price,
                car_image: doc.car_image
            }));
            setShortlist(shortlistData);
        }
    };

    const viewUsedCar = async (usedCarId) => {
        console.log('Fetching used Car for:', usedCarId);
        const buyerViewShortlistController = new BuyerViewShortlistController();
        Util.increaseCount(usedCarId, "view");
        const usedCar = await buyerViewShortlistController.viewUsedCarFromShortlist(usedCarId);
        console.log("Used Car data received:", usedCar);

        if (usedCar) {
            Swal.fire({
                title: 'View Used Car',
                width: 800,
                html: `
                    <div style="text-align: left; display: flex;">
                        <span>
                            <img src=${usedCar.body.car_image} alt="Car" class="uclCar-image" style="width: 250px; max-width: none; max-height: none; border-radius: 10px;"/><br>
                        </span>
                        <span style="margin-left: 20px;">
                            <div class="uclCar-contents">
                                <strong>Car Name:</strong> ${usedCar.body.car_name}
                            </div>
                            <div class="uclCar-contents">
                                <strong>Type:</strong> ${usedCar.body.car_type}
                            </div>
                            <div class="uclCar-contents">
                                <strong>Price:</strong> $${usedCar.body.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                            </div>
                            <div class="uclCar-contents">
                                <strong>Manufacturer:</strong> ${usedCar.body.car_manufacturer}
                            </div>
                            <div class="uclCar-contents">
                                <strong>Manufacture Year:</strong> ${usedCar.body.manufacture_year}
                            </div>
                            <div class="uclCar-contents">
                                <strong>Engine cap:</strong> ${usedCar.body.engine_cap.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                            </div>
                            <div class="uclCar-contents">
                                <strong>Mileage:</strong> ${usedCar.body.mileage.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}km
                            </div>
                            <div class="uclCar-contents">
                                <strong>Features:</strong> ${usedCar.body.features}
                            </div>
                            <div class="uclCar-contents">
                                <strong>Description:</strong> ${usedCar.body.description}
                            </div>
                            <div class="uclCar-contents">
                                <strong>Seller Username:</strong> ${usedCar.body.seller_username}
                            </div>
                        </span>
                    </div>
                `,
                showCancelButton: true,
                cancelButtonText: 'Close',
                confirmButtonText: 'Rate and Review',
                showDenyButton: true,
                denyButtonText: 'Loan Calculator',
                focusConfirm: false
            }).then((result) => {
                if (result.isConfirmed) {
                    leaveRateReview(usedCar.body.agent_username);
                } else if (result.isDenied) {
                    openLoanCalculator(usedCar.body.price);
                }
            });
            console.log(usedCar);
            console.log("display success in UI for: ", usedCarId);
            console.log("image check", usedCar.car_image);
            console.log("image check", usedCar.body.car_name);

        } else {
            console.error("Failed to load car information:", usedCar.body.price);
            Swal.fire({
                title: 'Error',
                text: 'Failed to load car information.',
                icon: 'error',
                confirmButtonText: 'Close'
            });
        }
    };

    const leaveRateReview = (agent_username) => {
        let ratingInput = 0, reviewInput;

        Swal.fire({
            title: '<h2 style="text-decoration: underline;">Feedback</h2>',
            html: `
                <div>
                    <p><strong>Agent:</strong> ${agent_username}</p>
                </div>
                <div id="star-rating" style="margin: 10px 0;">
                    <label>Rating:</label>
                    <span class="star" data-value="1" style="font-size: 2em; color: gray; cursor: pointer;">&#9733;</span>
                    <span class="star" data-value="2" style="font-size: 2em; color: gray; cursor: pointer;">&#9733;</span>
                    <span class="star" data-value="3" style="font-size: 2em; color: gray; cursor: pointer;">&#9733;</span>
                    <span class="star" data-value="4" style="font-size: 2em; color: gray; cursor: pointer;">&#9733;</span>
                    <span class="star" data-value="5" style="font-size: 2em; color: gray; cursor: pointer;">&#9733;</span>
                </div>
                <div>
                    <label>Review:</label>
                    <textarea id="review" placeholder="Write your review" rows="10" cols="50"></textarea>
                </div>
            `,
            confirmButtonText: 'Submit',
            focusConfirm: false,
            didOpen: () => {
                const stars = document.querySelectorAll('#star-rating .star');
                stars.forEach(star => {
                    star.addEventListener('click', () => {
                        ratingInput = star.getAttribute('data-value');
                        stars.forEach(s => s.style.color = s.getAttribute('data-value') <= ratingInput ? 'gold' : 'gray');
                    });
                });
            },
            preConfirm: () => {
                reviewInput = document.getElementById('review').value;

                if (!ratingInput || !reviewInput) {
                    Swal.showValidationMessage(`Please provide both a rating and a review`);
                    return false;
                }

                return { rating: ratingInput, review: reviewInput };
            }
        }).then(async (result) => {
            if (result.isConfirmed) {
                const { rating, review } = result.value;

                const reviewer_username = Cookies.get('username');
                const reviewer_type = Cookies.get('userProfile');

                const buyerLeaveRateReviewController = new BuyerLeaveRateReviewController(agent_username, rating, review, reviewer_username, reviewer_type);
                const isSuccess = await buyerLeaveRateReviewController.leaveRateReview(agent_username, rating, review, reviewer_username, reviewer_type);

                if (isSuccess) {
                    console.log(`Rating submitted for agent ${agent_username}:`, { rating, review });
                    Swal.fire('Thank you!', 'Your rating and review have been submitted.', 'success');
                } else {
                    console.log('Rating submission failed');
                    Swal.fire('Error', 'Failed to submit your rating and review. Please try again later.', 'error');
                }
            }
        });
    };

    const openLoanCalculator = async (price) => {
        let priceInput, interestRateInput, loanTermInput;

        Swal.fire({
            title: '<u>Loan Calculator</u>',
            width: 600,
            html: `
                <div class="calc-wrapper">
                    <label>Loan Amount: ($)</label>
                    <input type="number" id="loanAmount" class="swal2-input" value="${price}">
                    <label>Loan Term (months):</label>
                    <input type="number" id="loanTerm" class="swal2-input" placeholder="Enter loan term" min="0">
                    <label>Interest Rate (%):</label>
                    <input type="number" id="interestRate" class="swal2-input" placeholder="Enter interest rate" min="0">
                    <button id="clearButton" class="swal2-confirm swal2-styled" style="margin-right: 10px;">Clear</button>
                    <button id="calculateButton" class="swal2-confirm swal2-styled">Calculate</button>
                </div>
            `,
            showConfirmButton: false,
            focusConfirm: false,
            didOpen: async () => {
                document.getElementById("clearButton").addEventListener("click", () => {
                    document.getElementById("loanAmount").value = price;
                    document.getElementById("loanTerm").value = "";
                    document.getElementById("interestRate").value = "";
                });

                document.getElementById("calculateButton").addEventListener("click", async () => {
                    priceInput = document.getElementById('loanAmount').value;
                    interestRateInput = document.getElementById('interestRate').value;
                    loanTermInput = document.getElementById('loanTerm').value;

                    console.log(priceInput, interestRateInput, loanTermInput);

                    if ( !priceInput || !interestRateInput || !loanTermInput) {
                        Swal.showValidationMessage(`Please provide both an interest rate and a loan term`);
                        return;
                    }
                    
                    const monthlyPayment = await BuyerLoanCalculatorController.loanCalculator(priceInput, loanTermInput, interestRateInput);

                    Swal.fire('Monthly Payment', `Your estimated monthly payment is $${monthlyPayment}`, 'info');
                });
            }
        });
    };

    const handleRemoveFromShortlist = (shortlistId, usedCarId) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You will not be able to recover this car from your shortlist!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, remove it!',
            cancelButtonText: 'No, keep it'
        }).then(async (result) => {
            if (result.isConfirmed) {
                const buyerDeleteShortlistController = new BuyerDeleteShortlistController();
                await buyerDeleteShortlistController.deleteShortlist(shortlistId);
                // Logic to remove the car from the shortlist goes here
                console.log(`Car ${shortlistId} removed from shortlist.`);
                Swal.fire('Removed!', 'The car has been removed from your shortlist.', 'success');
                Util.decreaseCount(usedCarId, "shortlist");
                fetchCars();
            } else if (result.isDismissed) {
                Swal.fire('Cancelled', 'The car is still in your shortlist.', 'info');
            }
        });
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
        <div className="bsContainer">
            <div className="bsHeader">
                <button onClick={handleBack} className="bsBack-button">
                    Back
                </button>
                <div className="bsProfile-picture">
                    <img
                        src={"https://placehold.co/40x40?text=" + Cookies.get("username")}
                        alt="Profile"
                    />
                </div>
                <span className="bsUsername">{username}</span>
                <button onClick={handleLogout} className="bsLogout-button">
                    Logout
                </button>
            </div>

            <div className="bsSearch-bar">
                <span>
                    <input id="car_name_search_input" className="swal2-input custom-select" placeholder="Car Name(Hyundai)"></input>

                    <select id="carType_search_input" className="swal2-input custom-select">
                        <option value="">Select Vehicle Type</option>
                        <option value="Sedan">Sedan</option>
                        <option value="SUV">SUV</option>
                        <option value="Hatchback">Hatchback</option>
                        <option value="Wagon">Wagon</option>
                        <option value="Coupe">Coupe</option>
                        <option value="Van">Van</option>
                        <option value="MiniVan">MiniVan</option>
                        <option value="Pickup Truck">Pickup Truck</option>
                        <option value="Convertible">Convertible</option>
                        <option value="Sports Car">Sports Car</option>
                    </select>

                    <select id="priceRange_search_input" className="swal2-input custom-select">
                        <option value="">Select price range</option>
                        <option value="0-10000">$0 - $10,000</option>
                        <option value="10001-20000">$10,001 - $20,000</option>
                        <option value="20001-30000">$20,001 - $30,000</option>
                        <option value="30001-40000">$30,001 - $40,000</option>
                        <option value="40001-50000">$40,001 - $50,000</option>
                        <option value="50001-60000">$50,001 - $60,000</option>
                        <option value="60001-70000">$60,001 - $70,000</option>
                        <option value="70001-80000">$70,001 - $80,000</option>
                        <option value="80001-90000">$80,001 - $90,000</option>
                        <option value="90001-100000">$90,001 - $100,000</option>
                        <option value="100001-110000">$100,001 - $110,000</option>
                        <option value="110001-120000">$110,001 - $120,000</option>
                        <option value="120001-130000">$120,001 - $130,000</option>
                        <option value="130001-140000">$130,001 - $140,000</option>
                        <option value="140001-150000">$140,001 - $150,000</option>
                        <option value="150001-160000">$150,001 - $160,000</option>
                        <option value="160001-170000">$160,001 - $170,000</option>
                        <option value="170001-180000">$170,001 - $180,000</option>
                        <option value="180001-190000">$180,001 - $190,000</option>
                        <option value="190001-200000">$190,001 - $200,000</option>
                        <option value="210001-220000">$210,001 - $220,000</option>
                        <option value="220001-230000">$220,001 - $230,000</option>
                        <option value="230001-240000">$230,001 - $240,000</option>
                        <option value="240001-250000">$240,001 - $250,000</option>
                        <option value="250001-260000">$250,001 - $260,000</option>
                        <option value="260001-270000">$260,001 - $270,000</option>
                        <option value="270001-280000">$270,001 - $280,000</option>
                        <option value="280001-290000">$280,001 - $290,000</option>
                    </select>

                    <select id="manufactureYear_search_input" className="swal2-input custom-select">
                        <option value="">Select manufacture year</option>
                        <option value="2024">2024</option>
                        <option value="2023">2023</option>
                        <option value="2022">2022</option>
                        <option value="2021">2021</option>
                        <option value="2020">2020</option>
                        <option value="2019">2019</option>
                        <option value="2018">2018</option>
                        <option value="2017">2017</option>
                        <option value="2016">2016</option>
                        <option value="2015">2015</option>
                        <option value="2014">2014</option>
                        <option value="2013">2013</option>
                        <option value="2012">2012</option>
                        <option value="2011">2011</option>
                        <option value="2010">2010</option>
                    </select>

                    <button onClick={searchShortlist} className="bucSearch-button">
                        Search
                    </button>
                    <button onClick={clearSearch} className="bucSearch-button">
                        Clear
                    </button>
                </span>
            </div>
            <div className="bsUser-table">
                <div className="bsTable-header">
                    <span>Car Picture</span>
                    <span>Car Name</span>
                    <span>Description</span>
                    <span>Manufactured</span>
                    <span>Mileage</span>
                    <span>Price</span>
                    <span></span>
                </div>
                {shortlist.map((car) => (
                    <div key={car.shortlistId} className="bsTable-row">
                        <img src={car.car_image} alt="Car" className="bsCar-image" />
                        <span>{car.car_name}</span>
                        <span>{car.description}</span>
                        <span>{car.manufacture_year}</span>
                        <span>{car.mileage.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}km</span>
                        <span>${car.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</span>
                        <span>
                            <button onClick={() => viewUsedCar(car.usedCarId)} className="bsView-button">
                                View
                            </button>
                            <button onClick={() => handleRemoveFromShortlist(car.shortlistId, car.usedCarId)} className="bsRFS-button">
                                Remove from Shortlist
                            </button>
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default BuyerShortlistUI;