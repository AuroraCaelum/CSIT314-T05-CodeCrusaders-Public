import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import "./BuyerUsedCarUI.css";
import { UserLogoutController } from "../controller/UserAuthController";
import { ViewUsedCarController, SearchUsedCarController } from "../controller/UsedCarController";

import Swal from 'sweetalert2';

function BuyerUsedCarUI() {
    const [username] = useState(Cookies.get("username"));
    //const [searchUsername, setSearchUsername] = useState("");
    const [cars, setCars] = useState([
        { car_name: "Loading...", manufacture_year: "Loading...", mileage: "Loading...", price: "Loading...", car_image: "https://placehold.co/100x100?text=Car+Image", inspectCount: 0, shortlistCount: 0  }
    ]);

    useEffect(() => {
        const fetchCars = async () => {
            const snapshot = await ViewUsedCarController.getUsedCarList();
            if (snapshot !== null) {
                const carData = snapshot.docs.map(doc => ({
                    usedCarId: doc.id,
                    car_name: doc.data().car_name,
                    manufacture_year: doc.data().manufacture_year,
                    mileage: doc.data().mileage,
                    price: doc.data().price,
                    car_image: (doc.data().car_image),
                    inspectCount: 0,
                    shortlistCount: 0
                }));
                setCars(carData);
            }
        };

        fetchCars();
    }, []);

    // if (Cookies.get("userProfile") !== "UsedCarAgent") {
    //     window.open("/", "_self")
    // }

    const handleBuyerShortlist = () => {
        console.log("Buyer Shortlist");
        window.open("/buyershortlist", "_self");
    };

    const searchUsedCar = async () => {
        const carNameInput = document.getElementById('car_name');
        const vehicleTypeInput = document.getElementById('vehicleType');
        const priceRangeInput = document.getElementById('priceRange');
        const manufactureYearInput = document.getElementById('manufactureYear');

        let priceRange = [];
        priceRange[0] = priceRangeInput.value.toString().split("-")[0];
        priceRange[1] = priceRangeInput.value.toString().split("-")[1];

        const filterCriteria = {
            car_name: carNameInput ? carNameInput.value : '',
            vehicleType: vehicleTypeInput.value,
            priceRange: priceRange,
            manufactureYear: manufactureYearInput.value
        };
        
        const searchUsedCarController = new SearchUsedCarController();
        const searchResult = await searchUsedCarController.searchUsedCar(
            filterCriteria.car_name,
            filterCriteria.vehicleType,
            filterCriteria.priceRange,
            filterCriteria.manufactureYear
        );


        if (searchResult) {
            console.log("Search results:", searchResult.data);
            const carData = searchResult.data.map(doc => ({
                usedCarId: doc.id,
                car_name: doc.car_name,
                manufacture_year: doc.manufacture_year,
                mileage: doc.mileage,
                price: doc.price,
                car_image: doc.car_image
            }));
            setCars(carData);
        } else {
            console.error("Search failed:", searchResult.message);
        }

    };

    const viewUsedCar = async (usedCarId) => { //not done
        console.log('Fetching used Car for:', usedCarId);
        const viewUsedCarController = new ViewUsedCarController();
        const updatedCars = cars.map(car => {
            if (car.usedCarId === usedCarId) {
                car.inspectCount += 1;
            }
            return car;
        });
        setCars(updatedCars);
        const usedCar = await viewUsedCarController.viewUsedCar(usedCarId);
        console.log("Used Car data received:", usedCar);

        

        if (usedCar) {
            Swal.fire({
                title: 'View Used Car',
                html: `
                    <div style="text-align: left;">
                        <strong>Product Name:</strong> ${usedCar.body.car_name}<br>
                        <strong>Description:</strong> ${usedCar.body.description}<br>
                        <strong>Type:</strong> ${usedCar.body.car_type}<br>
                        <strong>Price:</strong> ${usedCar.body.price}<br>
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
                    <textarea id="review" class="swal2-input" placeholder="Write your review"></textarea>
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
        }).then((result) => {
            if (result.isConfirmed) {
                const { rating, review } = result.value;
                console.log(`Rating submitted for agent ${agent_username}:`, { rating, review });
                Swal.fire('Thank you!', 'Your rating and review have been submitted.', 'success');
            }
        });
    };
    
    const openLoanCalculator = async (price) => {
        let interestRateInput, loanTermInput;

        Swal.fire({
            title: '<u>Loan Calculator</u>',
            html: `
                <div>
                    <label>Loan Amount:</label>
                    <input type="text" class="swal2-input" value="$${price}" readonly>
                </div>
                <div>
                    <label>Loan Term (months):</label>
                    <input type="number" id="loanTerm" class="swal2-input" placeholder="Enter loan term in months" min="0">
                </div>
                <div>
                    <label>Interest Rate (%):</label>
                    <input type="number" id="interestRate" class="swal2-input" placeholder="Enter interest rate in whole numbers" min="0">
                </div>
                <div>
                    <button id="clearButton" class="swal2-confirm swal2-styled" style="margin-right: 10px;">Clear</button>
                    <button id="calculateButton" class="swal2-confirm swal2-styled">Calculate</button>
                </div>
            `,
            showConfirmButton: false,
            focusConfirm: false,
            didOpen: () => {
                document.getElementById("clearButton").addEventListener("click", () => {
                    document.getElementById("loanTerm").value = "";
                    document.getElementById("interestRate").value = "";
                });
    
                document.getElementById("calculateButton").addEventListener("click", () => {
                    interestRateInput = document.getElementById('interestRate').value;
                    loanTermInput = document.getElementById('loanTerm').value;
    
                    if (!interestRateInput || !loanTermInput) {
                        Swal.showValidationMessage(`Please provide both an interest rate and a loan term`);
                        return;
                    }
    
                    const interestRate = parseFloat(interestRateInput) / 100 / 12; // Monthly interest rate
                    const loanTerm = parseFloat(loanTermInput); // Total payments (months)
                    const monthlyPayment = (price * interestRate) / (1 - Math.pow(1 + interestRate, -loanTerm));
    
                    Swal.fire('Monthly Payment', `Your estimated monthly payment is $${monthlyPayment.toFixed(2)}`, 'info');
                });
            }
        });
    };

    const saveToShortlist = (usedCarId) => {
        const updatedCars = cars.map(car => {
            if (car.usedCarId === usedCarId) {
                car.shortlistCount += 1;  // Increment shortlist count when 'Save to Shortlist' is clicked
            }
            return car;
        });
        setCars(updatedCars);
        Swal.fire({
            title: 'Car Added!',
            text: "The car has been added to your shortlist.",
            icon: 'success',
            confirmButtonText: 'OK'
        }).then(() => {
            // Logic to add the car to the shortlist goes here
            console.log(`Car ${usedCarId} added to shortlist.`);
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
                window.open("/", "_self")
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

    // const handleSearch = (e) => {
    //     e.preventDefault();
    //     console.log("Searched Username:", searchUsername);
    // };

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
                {/* <form onSubmit={handleSearch}>
                    <input
                        type="text"
                        placeholder="Used Car Name"
                        value={searchUsername}
                        onChange={(e) => setSearchUsername(e.target.value)}
                    //className="search-input"
                    />
                    <button type="submit" className="bucSearch-button">
                        Search
                    </button>
                </form> */}
                <span>
                    <input id="car_name" class="swal2-input custom-select" placeholder= "Car Name(Hyundai)"></input>

                    <select id="vehicleType" class="swal2-input custom-select">
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

                    <select id="priceRange" class="swal2-input custom-select">
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
                    </select>

                    <select id="manufactureYear" class="swal2-input custom-select">
                        <option value="">Select manufacture year</option>
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
                    <span>Car Name:</span>
                    <span>Description:</span>
                    <span>Manufactured:</span>
                    <span>Mileage:</span>
                    <span>Price:</span>
                    <span></span>
                </div>
                {cars.map((car) => (
                    <div key={car.usedCarId} className="bucTable-row">
                        <img src={car.car_image} alt="Car" className="bucCar-image" />
                        <span>{car.car_name}</span>
                        <span>{car.description}</span>
                        <span>{car.manufacture_year}</span>
                        <span>{car.mileage.toLocaleString()}</span>
                        <span>${car.price.toLocaleString()}</span>
                        <span>
                            <button onClick={() => viewUsedCar(car.usedCarId)} className="bucInspect-button">
                                Inspect
                            </button>
                            <button onClick={() => saveToShortlist(car.usedCarId)} className="bucSTS-button">
                                Save to Shortlist
                            </button>
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default BuyerUsedCarUI;