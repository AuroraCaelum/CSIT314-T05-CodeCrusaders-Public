import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import Chart from 'chart.js/auto';
import "./BuyerUsedCarUI.css";
import { Util } from "../Util";
import { UserLogoutController } from "../controller/UserAuthController";
import { BuyerViewUsedCarController, BuyerSearchUsedCarController, BuyerTrackViewCountController, BuyerTrackShortlistCountController } from "../controller/BuyerUsedCarController";
import { BuyerLeaveRateReviewController } from "../controller/BuyerRateReviewController";
import { BuyerLoanCalculatorController } from "../controller/BuyerLoanCalculatorController";
import { BuyerSaveShortlistController } from "../controller/BuyerShortlistController";

import Swal from 'sweetalert2';

function BuyerUsedCarUI() {
    const [username] = useState(Cookies.get("username"));
    const [cars, setCars] = useState([]);

    const fetchCars = async () => {
        const snapshot = await Util.getUsedCarList();
        if (snapshot !== null) {
            const carData = snapshot.docs.map(doc => ({
                usedCarId: doc.id,
                car_name: doc.data().car_name,
                car_type: doc.data().car_type,
                description: (desc => desc.length >= 150 ? desc.substring(0, 150) + "..." : desc)(doc.data().description),
                manufacture_year: doc.data().manufacture_year,
                mileage: doc.data().mileage,
                price: doc.data().price,
                car_image: (doc.data().car_image),
                view_count: doc.data().view_count || 0,
                shortlist_count: doc.data().shortlist_count || 0
            }));
            setCars(carData);
        }
    };

    useEffect(() => {
        fetchCars();
    }, []);

    const handleBuyerShortlist = () => {
        console.log("Buyer Shortlist");
        window.open("/CSIT314-T05-CodeCrusaders/buyershortlist", "_self");
    };

    const clearUsedCar = async () => {
        document.getElementById('car_name').value = '';
        document.getElementById('vehicleType').value = '';
        document.getElementById('priceRange').value = '';
        document.getElementById('manufactureYear').value = '';

        fetchCars();
    }

    const searchUsedCar = async () => {
        const carNameInput = document.getElementById('car_name');
        const carTypeInput = document.getElementById('vehicleType');
        const priceRangeInput = document.getElementById('priceRange');
        const manufactureYearInput = document.getElementById('manufactureYear');

        let priceRange = priceRangeInput.value.toString().split("-");

        const filterCriteria = {
            car_name: carNameInput ? carNameInput.value : '',
            car_type: carTypeInput.value,
            priceRange: priceRange,
            manufactureYear: manufactureYearInput.value
        };

        const buyerSearchUsedCarController = new BuyerSearchUsedCarController();
        const searchResult = await buyerSearchUsedCarController.searchUsedCar(
            filterCriteria.car_name,
            filterCriteria.car_type,
            filterCriteria.priceRange,
            filterCriteria.manufactureYear,
            // Cookies.get('username')
        );


        if (searchResult === null) {
            Swal.fire({
                title: 'No Results',
                text: 'No used cars found matching the search criteria.',
                icon: 'info',
                confirmButtonText: 'OK'
            });
            return;
        } else {
            const carData = searchResult.map(doc => ({
                usedCarId: doc.id,
                car_name: doc.car_name,
                car_type: doc.car_type,
                description: (desc => desc.length >= 150 ? desc.substring(0, 150) + "..." : desc)(doc.description),
                manufacture_year: doc.manufacture_year,
                mileage: doc.mileage,
                price: doc.price,
                car_image: doc.car_image,
                view_count: doc.view_count || 0,
                shortlist_count: doc.shortlist_count || 0
            }));
            setCars(carData);
        }
    };

    const viewUsedCar = async (usedCarId) => {
        console.log('Fetching used Car for:', usedCarId);
        
        const updatedCars = cars.map(car => {
            if (car.usedCarId === usedCarId) {
                car.view_count += 1;
            }
            return car;
        });
        setCars(updatedCars);
        Util.increaseCount(usedCarId, "view");

        const buyerViewUsedCarController = new BuyerViewUsedCarController();
        const usedCar = await buyerViewUsedCarController.viewUsedCar(usedCarId);
        console.log("Used Car data received:", usedCar);

        if (usedCar !== null) {
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
        } else {
            console.error("Failed to load car information:", usedCar.body.price);
            Swal.fire({
                title: 'Error',
                text: 'An error has occurred. Please try again.',
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
            didOpen: () => {
                document.getElementById("clearButton").addEventListener("click", () => {
                    document.getElementById("loanAmount").value = price;
                    document.getElementById("loanTerm").value = "";
                    document.getElementById("interestRate").value = "";
                });

                document.getElementById("calculateButton").addEventListener("click", async () => {
                    priceInput = document.getElementById('loanAmount').value;
                    interestRateInput = document.getElementById('interestRate').value;
                    loanTermInput = document.getElementById('loanTerm').value;

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

    const saveToShortlist = async (car) => {
        const username = Cookies.get('username');

        const updatedCars = cars.map(item => {
            if (item.usedCarId === car.usedCarId) {
                item.shortlist_count += 1;  // Increment shortlist count when 'Save to Shortlist' is clicked
            }
            return item;
        });
        setCars(updatedCars);
        Util.increaseCount(car.usedCarId, "shortlist");

        const buyerSaveShortlistController = new BuyerSaveShortlistController();
        const isSuccess = await buyerSaveShortlistController.saveToShortlist(username, car);

        console.log("Check save Shortlist at Boundary", username, car.usedCarId, car.car_name, car.car_type, car.manufacture_year, car.price);

        if (isSuccess) {
            Swal.fire({
                title: 'Car Added!',
                text: `Car ${car.car_name} added to shortlist!`,
                icon: 'success',
                confirmButtonText: 'OK'
            });
            console.log(`Car ${car.car_name} added to shortlist.`);
        } else {
            Swal.fire({
                title: 'Failed!',
                text: `Car ${car.car_name} failed to add on shortlist.`,
                icon: 'error',
                confirmButtonText: 'OK'
            });
            console.log(`Car ${car.car_name} failed to add on shortlist.`);
        }
    };

    const trackViewCount = async (usedCarId) => {
        Swal.fire({
            title: 'View Count History',
            width: 800,
            html: `
                <canvas id="viewCountChart" width="400" height="200"></canvas>
                <h3 id="viewCountChartLoading">Loading Chart...</h3>
                <h3 id="viewCountErrorText" style="display: none;">View Count History Data Not Found!</h3>
            `,
            confirmButtonText: 'Close',
            focusConfirm: false,
            didOpen: async () => {
                const buyerTrackViewCountController = new BuyerTrackViewCountController();
                const viewCountHistory = await buyerTrackViewCountController.trackViewCount(usedCarId);

                if (viewCountHistory === undefined || viewCountHistory === null) {
                    document.getElementById("viewCountChart").style.display = "none";
                    document.getElementById("viewCountChartLoading").style.display = "none";
                    document.getElementById("viewCountErrorText").style.display = "block";
                } else {
                    const orderedViewCountHistory = {};
                    Object.keys(viewCountHistory).sort().forEach(key => {
                        orderedViewCountHistory[key] = viewCountHistory[key];
                    });

                    const accumulatedViewCountHistory = {};
                    Object.keys(orderedViewCountHistory).forEach((key, index) => {
                        if (index === 0) {
                            accumulatedViewCountHistory[key] = orderedViewCountHistory[key];
                        } else {
                            accumulatedViewCountHistory[key] = orderedViewCountHistory[key] + accumulatedViewCountHistory[Object.keys(accumulatedViewCountHistory)[index - 1]];
                        }
                    });

                    const ctx = document.getElementById('viewCountChart');
                    new Chart(ctx, {
                        data: {
                            labels: Object.keys(orderedViewCountHistory),
                            datasets: [{
                                type: 'line',
                                label: 'Monthly View Count',
                                data: Object.values(orderedViewCountHistory),
                                fill: false,
                                borderColor: 'rgb(230, 212, 110)',
                                tension: 0.1
                            }, {
                                type: 'line',
                                label: 'Cumulative View Count',
                                data: Object.values(accumulatedViewCountHistory),
                                fill: true,
                                showLine: false,
                                backgroundColor: 'rgba(110, 136, 229, 0.6)',
                                tension: 0.1
                            }]
                        }
                    });

                    document.getElementById("viewCountChartLoading").style.display = "none";
                }
            }
        });
    };

    const trackShortlistCount = async (usedCarId) => {
        Swal.fire({
            title: 'Shortlist Count History',
            width: 800,
            html: `
                <canvas id="shortlistCountChart" width="400" height="200"></canvas>
                <h3 id="shortlistCountChartLoading">Loading Chart...</h3>
                <h3 id="shortlistCountErrorText" style="display: none;">Shortlist Count History Data Not Found!</h3>
            `,
            confirmButtonText: 'Close',
            focusConfirm: false,
            didOpen: async () => {
                const buyerTrackShortlistCountController = new BuyerTrackShortlistCountController();
                const shortlistCountHistory = await buyerTrackShortlistCountController.trackShortlistCount(usedCarId);

                if (shortlistCountHistory === undefined || shortlistCountHistory === null) {
                    document.getElementById("shortlistCountChart").style.display = "none";
                    document.getElementById("shortlistCountChartLoading").style.display = "none";
                    document.getElementById("shortlistCountErrorText").style.display = "block";
                } else {
                    const orderedShortlistCountHistory = {};
                    Object.keys(shortlistCountHistory).sort().forEach(key => {
                        orderedShortlistCountHistory[key] = shortlistCountHistory[key];
                    });

                    const accumulatedShortlistCountHistory = {};
                    Object.keys(orderedShortlistCountHistory).forEach((key, index) => {
                        if (index === 0) {
                            accumulatedShortlistCountHistory[key] = orderedShortlistCountHistory[key];
                        } else {
                            accumulatedShortlistCountHistory[key] = orderedShortlistCountHistory[key] + accumulatedShortlistCountHistory[Object.keys(accumulatedShortlistCountHistory)[index - 1]];
                        }
                    });

                    const ctx = document.getElementById('shortlistCountChart');
                    new Chart(ctx, {
                        data: {
                            labels: Object.keys(orderedShortlistCountHistory),
                            datasets: [{
                                type: 'line',
                                label: 'Monthly View Count',
                                data: Object.values(orderedShortlistCountHistory),
                                fill: false,
                                borderColor: 'rgb(230, 212, 110)',
                                tension: 0.1
                            }, {
                                type: 'line',
                                label: 'Cumulative View Count',
                                data: Object.values(accumulatedShortlistCountHistory),
                                fill: true,
                                showLine: false,
                                backgroundColor: 'rgba(110, 136, 229, 0.6)',
                                tension: 0.1
                            }]
                        }
                    });

                    document.getElementById("shortlistCountChartLoading").style.display = "none";
                }
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
        <div className="bucContainer">
            <div className="bucHeader">
                <button onClick={handleBack} className="bucBack-button">
                    Back
                </button>
                <div className="bucProfile-picture">
                    <img
                        src={"https://placehold.co/40x40?text=" + Cookies.get("username")}
                        alt="Profile"
                    />
                </div>
                <span className="bucUsername">{username}</span>
                <button onClick={handleLogout} className="bucLogout-button">
                    Logout
                </button>
            </div>

            <div className="bucSearch-bar">
                <span>
                    <input id="car_name" className="swal2-input custom-select" placeholder="Car Name(Hyundai)"></input>

                    <select id="vehicleType" className="swal2-input custom-select">
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

                    <select id="priceRange" className="swal2-input custom-select">
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

                    <select id="manufactureYear" className="swal2-input custom-select">
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

                    <button onClick={searchUsedCar} className="bucSearch-button">
                        Search
                    </button>
                    <button onClick={clearUsedCar} className="bucSearch-button">
                        Clear
                    </button>
                </span>
                <span>
                    <button onClick={handleBuyerShortlist} className="bucMyShortlist-button">
                        My Shortlist
                    </button>
                </span>
            </div>
            <div className="bucUser-table">
                <div className="bucTable-header">
                    <span>Car Picture</span>
                    <span>Car Name</span>
                    <span>Description</span>
                    <span>Manufactured</span>
                    <span>Mileage</span>
                    <span>Price</span>
                    <span></span>
                </div>
                {cars.map((car) => (
                    <div key={car.usedCarId} className="bucTable-row">
                        <img src={car.car_image} alt="Car" className="bucCar-image" />
                        <span>{car.car_name}</span>
                        <span>{car.description}</span>
                        <span>{car.manufacture_year}</span>
                        <span>{car.mileage.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</span>
                        <span>${car.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</span>
                        <span>
                            <button onClick={() => viewUsedCar(car.usedCarId)} className="bucView-button">
                                View
                            </button>
                            <button onClick={() => saveToShortlist(car)} className="bucSTS-button">
                                Save to Shortlist
                            </button>
                        </span>
                        <span>
                            <div className="counter-display">
                                <span onClick={() => trackViewCount(car.usedCarId)} title="Click to track view count"><img src={"viewIcon.png"} alt="Inspect" className="uclInspect-png-image" />{car.view_count}</span>  {/* Display inspect count with an icon */}
                                <span onClick={() => trackShortlistCount(car.usedCarId)} title="Click to track shortlist count"><img src={"saveShortlistIcon.png"} alt="Shortlist" className="uclShortlist-png-image" />{car.shortlist_count}</span>  {/* Display shortlist count with an icon */}
                            </div>
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default BuyerUsedCarUI;