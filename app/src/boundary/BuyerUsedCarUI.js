import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import "./BuyerUsedCarUI.css";
import { UserLogoutController } from "../controller/UserAuthController";
import { CreateUsedCarController } from "../controller/UsedCarController";
import { ViewUsedCarController, DeleteUsedCarController } from "../controller/UsedCarController";

import Swal from 'sweetalert2';
import { SnapshotMetadata } from "firebase/firestore";

function BuyerUsedCarUI() {
    const [username] = useState(Cookies.get("username"));
    //const [searchUsername, setSearchUsername] = useState("");
    const [cars, setCars] = useState([
        { car_name: "Loading...", manufacture_year: "Loading...", mileage: "Loading...", price: "Loading...", image: "https://placehold.co/100x100?text=Car+Image" }
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
                    image: (doc.data().car_image === undefined) ? "https://placehold.co/100x100?text=Car+Image" : "https://firebasestorage.googleapis.com/v0/b/moeuigosa-encjrx.appspot.com/o/car_images%2F" + doc.data().car_image + "?alt=media"
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

    const handleSearchUsedCar = () => { //this is for saerch pop up
        let carModelInput, vehicleTypeInput, priceRangeInput, manufactureYearInput;

        // Swal.fire({
        //     title: 'Search Used Car',
        //     html: `
        //         <select id="carModel" class="swal2-input custom-select">
        //         <option value="">Select car model</option>
        //         <option value="Sedan">Sedan</option>
        //         <option value="SUV">SUV</option>
        //         <option value="Truck">Truck</option>
        //         <option value="Convertible">Convertible</option>
        //     </select>

        //     <select id="vehicleType" class="swal2-input custom-select">
        //         <option value="">Select vehicle type</option>
        //         <option value="Electric">Electric</option>
        //         <option value="Hybrid">Hybrid</option>
        //         <option value="Diesel">Diesel</option>
        //         <option value="Petrol">Petrol</option>
        //     </select>

        //     <select id="priceRange" class="swal2-input custom-select">
        //         <option value="">Select price range</option>
        //         <option value="0-10000">$0 - $10,000</option>
        //         <option value="10001-20000">$10,001 - $20,000</option>
        //         <option value="20001-30000">$20,001 - $30,000</option>
        //         <option value="30001-40000">$30,001 - $40,000</option>
        //     </select>

        //     <select id="manufactureYear" class="swal2-input custom-select">
        //         <option value="">Select manufacture year</option>
        //         <option value="2023">2023</option>
        //         <option value="2022">2022</option>
        //         <option value="2021">2021</option>
        //         <option value="2020">2020</option>
        //     </select>
        //     `,

        //     // customClass: {
        //     //     input: 'swal2-input custom-select'
        //     // },

        //     confirmButtonText: 'Search Used Car',
        //     focusConfirm: false,
        //     didOpen: () => {
        //         const popup = Swal.getPopup();
        //         carModelInput = popup.querySelector('#carModel');
        //         vehicleTypeInput = popup.querySelector('#vehicleType');
        //         priceRangeInput = popup.querySelector('#priceRange');
        //         manufactureYearInput = popup.querySelector('#manufactureYear');

        //         const handleEnterKey = (event) => {
        //             if (event.key === 'Enter') {
        //                 Swal.clickConfirm();
        //             }
        //         };

        //         carModelInput.onkeyup = handleEnterKey;
        //         vehicleTypeInput.onkeyup = handleEnterKey;
        //         priceRangeInput.onkeyup = handleEnterKey;
        //         manufactureYearInput.onkeyup = handleEnterKey;
        //     },
        //     preConfirm: () => {
        //         return {
        //             carModel: carModelInput.value,
        //             vehicleType: vehicleTypeInput.value,
        //             priceRange: priceRangeInput.value,
        //             manufactureYear: manufactureYearInput.value
        //         };
        //     },
        // }).then((result) => {
        //     if (result.isConfirmed) {
        //         const { carModel, vehicleType, priceRange, manufactureYear } = result.value;
        //         console.log('Filter criteria:', {
        //             carModel,
        //             vehicleType,
        //             priceRange,
        //             manufactureYear
        //         });
        //         // Add logic here to handle account creation, like sending data to an API
        //     }
        // });
    };


    // const handleCreateUsedCar = () => {
    //     let car_image_input, seller_username_input, car_manufacturer_input, car_name_input, car_type_input, price_input, manufacture_year_input, mileage_input, engine_cap_input, features_input, description_input;

    //     Swal.fire({
    //         title: 'Create Used Car',
    //         width: 1200,
    //         html: `
    //             <div class="wrapper">
    //                 <div class="item">
    //                     <label>Car Image</label>
    //                     <input type="file" id="car_image" class="swal2-input" accept="image/*" placeholder="Car Image">
    //                 </div>
    //                 <div class="item">
    //                     <label>Seller Username</label>
    //                     <input type="text" id="seller_username" class="swal2-input" placeholder="Ex) sellerid">
    //                 </div>
    //                 <div class="item">
    //                     <label>Car Manufacturer</label>
    //                     <input type="text" id="car_manufacturer" class="swal2-input" placeholder="Ex) Hyundai">
    //                 </div>
    //                 <div class="item">
    //                     <label>Car Name</label>
    //                     <input type="text" id="car_name" class="swal2-input" placeholder="Ex) Ioniq 5">
    //                 </div>
    //                 <div class="item">
    //                     <label>Car Type</label>
    //                     <select id="car_type" class="swal2-select">
    //                         <option value="">Select Car Type</option>
    //                         <option value="Sedan">Sedan</option>
    //                         <option value="SUV">SUV</option>
    //                         <option value="Hatchback">Hatchback</option>
    //                         <option value="Wagon">Wagon</option>
    //                         <option value="Coupe">Coupe</option>
    //                         <option value="Van">Van</option>
    //                         <option value="MiniVan">MiniVan</option>
    //                         <option value="Pickup Truck">Pickup Truck</option>
    //                         <option value="Convertible">Convertible</option>
    //                         <option value="Sports Car">Sports Car</option>
    //                     </select>
    //                 </div>
    //                 <div class="item">
    //                     <label>Price ($)</label>
    //                     <input type="text" id="price" class="swal2-input" placeholder="Ex) 150000">
    //                 </div>
    //                 <div class="item">
    //                     <label>Manufacture Year</label>
    //                     <input type="text" id="manufacture_year" class="swal2-input" placeholder="Ex) 2021">
    //                 </div>
    //                 <div class="item">
    //                     <label>Mileage (km)</label>
    //                     <input type="text" id="mileage" class="swal2-input" placeholder="Ex) 100000">
    //                 </div>
    //                 <div class="item">
    //                     <label>Engine Capacity (cc)</label>
    //                     <input type="text" id="engine_cap" class="swal2-input" placeholder="Ex) 1500">
    //                 </div>
    //                 <div class="item">
    //                     <label>Features</label>
    //                     <input type="text" id="features" class="swal2-input" placeholder="Enter features...">
    //                 </div>
    //                 <div class="item" style="grid-column: span 2">
    //                     <label>Description</label>
    //                     <input type="textarea" id="description" class="swal2-input" placeholder="Enter description...">
    //                 </div>
    //             </div>
    //         `,
    //         confirmButtonText: 'Create Used Car',
    //         focusConfirm: false,
    //         didOpen: () => {
    //             const popup = Swal.getPopup();
    //             car_image_input = popup.querySelector('#car_image');
    //             seller_username_input = popup.querySelector('#seller_username');
    //             car_manufacturer_input = popup.querySelector('#car_manufacturer');
    //             car_name_input = popup.querySelector('#car_name');
    //             car_type_input = popup.querySelector('#car_type');
    //             price_input = popup.querySelector('#price');
    //             manufacture_year_input = popup.querySelector('#manufacture_year');
    //             mileage_input = popup.querySelector('#mileage');
    //             engine_cap_input = popup.querySelector('#engine_cap');
    //             features_input = popup.querySelector('#features');
    //             description_input = popup.querySelector('#description');

    //             console.log({ car_image_input, seller_username_input, car_manufacturer_input, car_name_input, car_type_input, price_input, manufacture_year_input, mileage_input, engine_cap_input, features_input, description_input });

    //             const handleEnterKey = (event) => {
    //                 if (event.key === 'Enter') {
    //                     Swal.clickConfirm();
    //                 }
    //             };

    //             if (car_image_input) car_image_input.onkeyup = handleEnterKey;
    //             if (seller_username_input) seller_username_input.onkeyup = handleEnterKey;
    //             if (car_manufacturer_input) car_manufacturer_input.onkeyup = handleEnterKey;
    //             if (car_name_input) car_name_input.onkeyup = handleEnterKey;
    //             if (car_type_input) car_type_input.onkeyup = handleEnterKey;
    //             if (price_input) price_input.onkeyup = handleEnterKey;
    //             if (manufacture_year_input) manufacture_year_input.onkeyup = handleEnterKey;
    //             if (mileage_input) mileage_input.onkeyup = handleEnterKey;
    //             if (engine_cap_input) engine_cap_input.onkeyup = handleEnterKey;
    //             if (features_input) features_input.onkeyup = handleEnterKey;
    //             if (description_input) description_input.onkeyup = handleEnterKey;
    //         },
    //         preConfirm: () => {
    //             const car_image = car_image_input[0];
    //             const seller_username = seller_username_input.value;
    //             const car_manufacturer = car_manufacturer_input.value;
    //             const car_name = car_name_input.value;
    //             const car_type = car_type_input.value;
    //             const price = price_input.value;
    //             const manufacture_year = manufacture_year_input.value;
    //             const mileage = mileage_input.value;
    //             const engine_cap = engine_cap_input.value;
    //             const features = features_input.value;
    //             const description = description_input.value;

    //             if (!car_image || !seller_username || !car_manufacturer || !car_name || !car_type || !price || !manufacture_year || !mileage || !engine_cap || !features || !description) {
    //                 Swal.showValidationMessage(`Please fill in all fields`);
    //                 return false;
    //             }
    //             else {
    //                 Swal.fire("Product Listed!"); //is it ok if we change it to this instead of "Product Created!" ?
    //             }

    //             return { car_image, seller_username, car_manufacturer, car_name, car_type, price, manufacture_year, mileage, engine_cap, features, description };
    //         },
    //     }).then(async (result) => {
    //         if (result.isConfirmed) {
    //             const { car_image, seller_username, car_manufacturer, car_name, car_type, price, manufacture_year, mileage, engine_cap, features, description } = result.value;
    //             console.log('New Car Details:', {
    //                 car_image,
    //                 seller_username,
    //                 car_manufacturer,
    //                 car_name,
    //                 car_type,
    //                 price,
    //                 manufacture_year,
    //                 mileage,
    //                 engine_cap,
    //                 features,
    //                 description
    //             });

    //             const formData = new FormData();
    //             formData.append('car_image', car_image);
    //             formData.append('seller_username', seller_username);
    //             formData.append('car_manufacturer', car_manufacturer);
    //             formData.append('car_name', car_name);
    //             formData.append('car_type', car_type);
    //             formData.append('price', price);
    //             formData.append('manufacture_year', manufacture_year);
    //             formData.append('mileage', mileage);
    //             formData.append('engine_cap', engine_cap);
    //             formData.append('features', features);
    //             formData.append('description', description);

    //             // Add logic here to handle account creation, like sending data to an API
    //             const createUsedCarController = new CreateUsedCarController();
    //             const isSuccess = await createUsedCarController.createUsedCar(Cookies.get("username"), seller_username, car_name, car_type, car_manufacturer, car_image, description, features, price, mileage, manufacture_year, engine_cap);

    //             if (isSuccess) {
    //                 console.log("Used Car successfully created.");
    //             } else {
    //                 console.error("Failed to create used car.");
    //             }
    //         }
    //     });
    // };

    const handleViewUsedCar = async (usedCarId) => { //not done
        console.log('Fetching used Car for:', usedCarId);
        const viewUsedCarController = new ViewUsedCarController();
        const usedCar = await viewUsedCarController.viewUsedCar(usedCarId);
        console.log("Used Car data received:", usedCar);

        if (usedCar) {
            Swal.fire({
                title: 'View Used Car',
                html: `
                    <div style="text-align: left;">
                        <strong>Product Name:</strong> ${usedCar.prodName}<br>
                        <strong>Description:</strong> ${usedCar.description}<br>
                        <strong>Type:</strong> ${usedCar.type}<br>
                        <strong>Price:</strong> ${usedCar.price}<br>
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
                    handleRateAndReview(usedCarId);
                } else if (result.isDenied) {
                    handleLoanCalculator(usedCar.price);
                }
            });
            console.log(usedCar);
            console.log("display success in UI for: ", usedCarId);
        } else {
            console.error("Failed to load car information:", usedCarId);
            Swal.fire({
                title: 'Error',
                text: 'Failed to load car information.',
                icon: 'error',
                confirmButtonText: 'Close'
            });
        }
    };

    const handleRateAndReview = (usedCarId, agentName) => {
        let ratingInput = 0, reviewInput;
    
        Swal.fire({
            title: '<h2 style="text-decoration: underline;">Feedback</h2>',
            html: `
                <div>
                    <p><strong>Agent:</strong> ${agentName}</p>
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
                console.log(`Rating submitted for car ${usedCarId}:`, { rating, review });
                Swal.fire('Thank you!', 'Your rating and review have been submitted.', 'success');
            }
        });
    };
    
    const handleLoanCalculator = (price) => {
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

    const handleAddToShortlist = (usedCarId) => {
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
                    <select id="carModel" class="swal2-input custom-select">
                        <option value="">Select car model</option>
                        <option value="Sedan">Sedan</option>
                        <option value="SUV">SUV</option>
                        <option value="Truck">Truck</option>
                        <option value="Convertible">Convertible</option>
                    </select>

                    <select id="vehicleType" class="swal2-input custom-select">
                        <option value="">Select vehicle type</option>
                        <option value="Electric">Electric</option>
                        <option value="Hybrid">Hybrid</option>
                        <option value="Diesel">Diesel</option>
                        <option value="Petrol">Petrol</option>
                    </select>

                    <select id="priceRange" class="swal2-input custom-select">
                        <option value="">Select price range</option>
                        <option value="0-10000">$0 - $10,000</option>
                        <option value="10001-20000">$10,001 - $20,000</option>
                        <option value="20001-30000">$20,001 - $30,000</option>
                        <option value="30001-40000">$30,001 - $40,000</option>
                    </select>

                    <select id="manufactureYear" class="swal2-input custom-select">
                        <option value="">Select manufacture year</option>
                        <option value="2023">2023</option>
                        <option value="2022">2022</option>
                        <option value="2021">2021</option>
                        <option value="2020">2020</option>
                    </select>
                    
                    <button onClick={handleSearchUsedCar} className="bucSearch-button">
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
                    <span></span>
                    <span>Car Name:</span>
                    <span>Manufactured:</span>
                    <span>Mileage:</span>
                    <span>Price:</span>
                    <span></span>
                </div>
                {cars.map((car) => (
                    <div key={car.usedCarId} className="bucTable-row">
                        <img src={car.image} alt="Car" className="bucCar-image" />
                        <span>{car.car_name}</span>
                        <span>{car.manufacture_year}</span>
                        <span>{car.mileage.toLocaleString()}</span>
                        <span>${car.price.toLocaleString()}</span>
                        <span>
                            <button onClick={() => handleViewUsedCar(car.usedCarId)} className="bucInspect-button">
                                Inspect
                            </button>
                            <button onClick={() => handleAddToShortlist(car.usedCarId)} className="bucSTS-button">
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