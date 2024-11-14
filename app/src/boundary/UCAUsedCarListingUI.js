import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { Util } from "../Util";
import Chart from 'chart.js/auto';
import "./UCAUsedCarListingUI.css";
import { UserLogoutController } from "../controller/UserAuthController";
import {
    UCACreateUsedCarController, UCAViewUsedCarController, UCAUpdateUsedCarController, UCADeleteUsedCarController, UCASearchUsedCarController,
    UCATrackViewCountController, UCATrackShortlistCountController
} from "../controller/UCAUsedCarController";

import Swal from 'sweetalert2';

function UCAUsedCarListingUI() {
    const [username] = useState(Cookies.get("username"));
    const [cars, setCars] = useState([]);


    const fetchCars = async () => {
        const snapshot = await Util.getUsedCarListByUsername('agent', username);
        if (snapshot !== null) {
            const carData = snapshot.map(doc => ({
                usedCarId: doc.documentId,
                car_name: doc.car_name,
                description: (desc => desc.length >= 50 ? desc.substring(0, 10) + "..." : desc)(doc.description),
                manufacture_year: doc.manufacture_year,
                mileage: doc.mileage,
                price: doc.price,
                car_image: doc.car_image || "https://placehold.co/100x100?text=Car+Image",
                view_count: doc.view_count || 0,
                shortlist_count: doc.shortlist_count || 0
            }));
            setCars(carData);
        }
    };

    useEffect(() => {
        fetchCars();
    }, []);

    if (Cookies.get("userProfile") !== "UsedCarAgent") {
        window.open("/CSIT314-T05-CodeCrusaders/", "_self")
    }

    const clearUsedCar = async () => {
        document.getElementById('car_name_search_input').value = '';
        document.getElementById('carType_search_input').value = '';
        document.getElementById('priceRange_search_input').value = '';
        document.getElementById('manufactureYear_search_input').value = '';

        fetchCars();
    }

    const createUsedCar = () => {
        let seller_username_input, car_name_input, car_type_input, car_manufacturer_input, car_image_input, description_input, features_input, price_input, mileage_input, manufacture_year_input, engine_cap_input;

        Swal.fire({
            title: 'Create Used Car',
            width: 1200,
            html: ` 
                <div class="wrapper">
                    <div class="item">
                        <label>Car Image</label>
                        <input type="file" id="car_image" class="swal2-input" accept="image/*" placeholder="Car Image">
                    </div>
                    <div class="item">
                        <label>Seller Username</label>
                        <input type="text" id="seller_username" class="swal2-input" placeholder="Ex) sellerid">
                    </div>
                    <div class="item">
                        <label>Car Manufacturer</label>
                        <input type="text" id="car_manufacturer" class="swal2-input" placeholder="Ex) Hyundai">
                    </div>
                    <div class="item">
                        <label>Car Name</label>
                        <input type="text" id="car_name" class="swal2-input" placeholder="Ex) Ioniq 5">
                    </div>
                    <div class="item">
                        <label>Car Type</label>
                        <select id="car_type" class="swal2-select">
                            <option value="" disabled selected>Select Car Type</option>
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
                    </div>
                    <div class="item">
                        <label>Price ($)</label>
                        <input type="number" id="price" class="swal2-input" placeholder="Ex) 150000" min="0">
                    </div>
                    <div class="item">
                        <label>Manufacture Year</label>
                        <input type="number" id="manufacture_year" class="swal2-input" placeholder="Ex) 2021" min="0">
                    </div>
                    <div class="item">
                        <label>Mileage (km)</label>
                        <input type="number" id="mileage" class="swal2-input" placeholder="Ex) 100000" min="0">
                    </div>
                    <div class="item">
                        <label>Engine Capacity (CC)</label>
                        <input type="number" id="engine_cap" class="swal2-input" placeholder="Ex) 1500" min="0">
                    </div>
                    <div class="item">
                        <label>Features</label>
                        <input type="text" id="features" class="swal2-input" placeholder="Enter features...">
                    </div>
                    <div class="item" style="grid-column: span 2">
                        <label>Description</label>
                        <input type="text" id="description" class="swal2-input" placeholder="Enter description...">
                    </div>
                </div>
            `,
            confirmButtonText: 'Create Used Car',
            focusConfirm: false,
            didOpen: () => {
                const popup = Swal.getPopup();

                seller_username_input = popup.querySelector('#seller_username');
                car_name_input = popup.querySelector('#car_name');
                car_type_input = popup.querySelector('#car_type');
                car_manufacturer_input = popup.querySelector('#car_manufacturer');
                car_image_input = popup.querySelector('#car_image');
                description_input = popup.querySelector('#description');
                features_input = popup.querySelector('#features');
                price_input = popup.querySelector('#price');
                mileage_input = popup.querySelector('#mileage');
                manufacture_year_input = popup.querySelector('#manufacture_year');
                engine_cap_input = popup.querySelector('#engine_cap');

                console.log({ seller_username_input, car_name_input, car_type_input, car_manufacturer_input, car_image_input, description_input, features_input, price_input, mileage_input, manufacture_year_input, engine_cap_input });

                // if (!seller_username_input || !car_name_input || !car_type_input || !car_manufacturer_input) {
                //     console.error("One or more inputs are not found.");
                // }

                const handleEnterKey = (event) => {
                    if (event.key === 'Enter') {
                        Swal.clickConfirm();
                    }
                };

                if (seller_username_input) seller_username_input.onkeyup = handleEnterKey;
                if (car_name_input) car_name_input.onkeyup = handleEnterKey;
                if (car_type_input) car_type_input.onkeyup = handleEnterKey;
                if (car_manufacturer_input) car_manufacturer_input.onkeyup = handleEnterKey;
                if (car_image_input) car_image_input.onkeyup = handleEnterKey;
                if (description_input) description_input.onkeyup = handleEnterKey;
                if (features_input) features_input.onkeyup = handleEnterKey;
                if (mileage_input) mileage_input.onkeyup = handleEnterKey;
                if (price_input) price_input.onkeyup = handleEnterKey;
                if (manufacture_year_input) manufacture_year_input.onkeyup = handleEnterKey;
                if (engine_cap_input) engine_cap_input.onkeyup = handleEnterKey;

            },
            preConfirm: () => {
                const usedCarId = Date.now().toString();
                const seller_username = seller_username_input.value;
                const car_name = car_name_input.value;
                const car_type = car_type_input.value;
                const car_manufacturer = car_manufacturer_input.value;
                const car_image = car_image_input.files[0];
                const description = description_input.value;
                const features = features_input.value;
                const mileage = mileage_input.value;
                const price = price_input.value;
                const manufacture_year = manufacture_year_input.value;
                const engine_cap = engine_cap_input.value;


                if (!seller_username || !car_name || !car_type || !car_manufacturer || !car_image || !description || !features || !price || !mileage || !manufacture_year || !engine_cap) {
                    Swal.showValidationMessage(`Please fill in all fields`);
                    return false;
                } else if (mileage < 0 || price < 0 || manufacture_year < 0 || engine_cap < 0) {
                    Swal.showValidationMessage(`Number fields cannot be negative`);
                    return false;
                } else {
                    Swal.fire({
                        position: "center",
                        title: 'Saving...',
                        icon: 'info',
                        html: 'Saving used car to database, please wait.',
                        showConfirmButton: false
                    });
                }

                return { usedCarId, seller_username, car_name, car_type, car_manufacturer, car_image, description, features, price, mileage, manufacture_year, engine_cap };
            },
        }).then(async (result) => {
            if (result.isConfirmed) {
                const { usedCarId, seller_username, car_name, car_type, car_manufacturer, car_image, description, features, price, mileage, manufacture_year, engine_cap } = result.value;
                console.log('New Car Details:', {
                    usedCarId,
                    seller_username,
                    car_name,
                    car_type,
                    car_manufacturer,
                    car_image,
                    description,
                    features,
                    price,
                    mileage,
                    manufacture_year,
                    engine_cap
                });

                // Add logic here to handle account creation, like sending data to an API
                const ucaCreateUsedCarController = new UCACreateUsedCarController();
                const isSuccess = await ucaCreateUsedCarController.createUsedCar(usedCarId, Cookies.get("username"), seller_username, car_name, car_type, car_manufacturer, car_image, description, features, price, mileage, manufacture_year, engine_cap);

                console.log(isSuccess)
                if (isSuccess === 0) {
                    Swal.fire('Created!', 'Used car has successfully registered.', 'success');
                    fetchCars();
                } else if (isSuccess === 1) {
                    Swal.fire({
                        position: "center",
                        title: 'Failed!',
                        icon: 'error',
                        html: 'Failed to create a used car.<br><br><small>Please check that you have entered a correct seller username.</small>',
                        confirmButtonText: 'OK',
                    });
                } else if (isSuccess === 2) {
                    Swal.fire({
                        position: "center",
                        title: 'Failed!',
                        icon: 'error',
                        html: 'Failed to create a used car.<br><br><small>It looks like a server error. Please try a while later!</small>',
                        confirmButtonText: 'OK',
                    });
                }
            }
        });
    };

    const viewUsedCar = async (usedCarId) => {
        console.log('Fetching used Car for:', usedCarId);
        const ucaViewUsedCarController = new UCAViewUsedCarController();
        const usedCar = await ucaViewUsedCarController.viewUsedCar(usedCarId);
        console.log("Used Car data received:", usedCar);
        console.log(usedCarId);

        if (usedCar != null) {
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
                cancelButtonText: 'close',
                confirmButtonText: 'Update Details',
                showDenyButton: true,
                denyButtonText: 'Delete',
                focusConfirm: false
            }).then((result) => {
                if (result.isConfirmed) {
                    updateUsedCar(usedCar);
                } else if (result.isDenied) {
                    deleteUsedCar(usedCarId, usedCar.body.car_name);
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

    const updateUsedCar = (usedCar) => {
        console.log(usedCar.body.description)

        Swal.fire({
            title: 'Update Used Car Detail',
            width: 1200,
            html: `
                <div class="wrapper" style="grid-template-columns: 1fr 1fr 1fr 1fr;">
                    <div class="item" style="grid-column: span 1">
                        <label>Current Image</label>
                        <img src=${usedCar.body.car_image} alt="Car" class="uclCar-image" />
                    </div>
                    <div class="item" style="grid-column: span 2">
                        <label>Car Image</label>
                        <input type="file" id="car_image" class="swal2-input" accept="image/*">
                    </div>
                    <div class="item" style="grid-column: span 1">
                        <label>Seller Username</label>
                        <input type="text" id="seller_username" class="swal2-input" value=${usedCar.body.seller_username}>
                    </div>
                </div>
                <div class="wrapper">
                    <div class="item">
                        <label>Car Manufacturer</label>
                        <input type="text" id="car_manufacturer" class="swal2-input" value=${usedCar.body.car_manufacturer}>
                    </div>
                    <div class="item">
                        <label>Car Name</label>
                        <input type="text" id="car_name_input" class="swal2-input" value="${usedCar.body.car_name}">
                    </div>
                    <div class="item">
                        <label>Car Type</label>
                        <select id="car_type" class="swal2-select">
                            <option value="Sedan" ${(usedCar.body.car_type) === "Sedan" ? 'selected' : ''}>Sedan</option>
                            <option value="SUV" ${(usedCar.body.car_type) === "SUV" ? 'selected' : ''}>SUV</option>
                            <option value="Hatchback" ${(usedCar.body.car_type) === "Hatchback" ? 'selected' : ''}>Hatchback</option>
                            <option value="Wagon" ${(usedCar.body.car_type) === "Wagon" ? 'selected' : ''}>Wagon</option>
                            <option value="Coupe" ${(usedCar.body.car_type) === "Coupe" ? 'selected' : ''}>Coupe</option>
                            <option value="Van" ${(usedCar.body.car_type) === "Van" ? 'selected' : ''}>Van</option>
                            <option value="MiniVan" ${(usedCar.body.car_type) === "MiniVan" ? 'selected' : ''}>MiniVan</option>
                            <option value="Pickup Truck" ${(usedCar.body.car_type) === "Pickup Truck" ? 'selected' : ''}>Pickup Truck</option>
                            <option value="Convertible" ${(usedCar.body.car_type) === "Convertible" ? 'selected' : ''}>Convertible</option>
                            <option value="Sports Car" ${(usedCar.body.car_type) === "Sports Car" ? 'selected' : ''}>Sports Car</option>
                        </select>
                    </div>
                    <div class="item">
                        <label>Price ($)</label>
                        <input type="number" id="price" class="swal2-input" value=${usedCar.body.price} min="0">
                    </div>
                    <div class="item">
                        <label>Manufacture Year</label>
                        <input type="number" id="manufacture_year" class="swal2-input" value=${usedCar.body.manufacture_year} min="0">
                    </div>
                    <div class="item">
                        <label>Mileage (km)</label>
                        <input type="number" id="mileage" class="swal2-input" value=${usedCar.body.mileage} min="0">
                    </div>
                    <div class="item">
                        <label>Engine Capacity (cc)</label>
                        <input type="number" id="engine_cap" class="swal2-input" value=${usedCar.body.engine_cap} min="0">
                    </div>
                    <div class="item">
                        <label>Features</label>
                        <input type="text" id="features" class="swal2-input" value="${usedCar.body.features}">
                    </div>
                    <div class="item" style="grid-column: span 2">
                        <label>Description</label>
                        <input type="text" id="description" class="swal2-input" value="${usedCar.body.description}">
                    </div>
                </div>
            `,
            confirmButtonText: 'Update',
            focusConfirm: false,
            preConfirm: () => {
                const seller_username = document.getElementById('seller_username').value;
                const car_name = document.getElementById('car_name_input').value;
                const car_type = document.getElementById('car_type').value;
                const car_manufacturer = document.getElementById('car_manufacturer').value;
                const car_image = document.getElementById('car_image').files[0];
                const description = document.getElementById('description').value;
                const features = document.getElementById('features').value;
                const price = document.getElementById('price').value;
                const mileage = document.getElementById('mileage').value;
                const manufacture_year = document.getElementById('manufacture_year').value;
                const engine_cap = document.getElementById('engine_cap').value;

                console.log(seller_username)
                console.log(car_name)
                console.log(car_type)
                console.log(car_manufacturer)
                console.log(car_image)
                console.log(description)
                console.log(features)
                console.log(price)
                console.log(mileage)
                console.log(manufacture_year)
                console.log(engine_cap)

                if (!seller_username || !car_name || !car_type || !car_manufacturer || !description || !features || !price || !mileage || !manufacture_year || !engine_cap) {
                    Swal.showValidationMessage(`Please fill in all fields`);
                    return false;
                } else if (mileage < 0 || price < 0 || manufacture_year < 0 || engine_cap < 0) {
                    Swal.showValidationMessage(`Number fields cannot be negative`);
                    return false;
                } else {
                    Swal.fire({
                        position: "center",
                        title: 'Updating...',
                        icon: 'info',
                        html: 'Updating used car to database, please wait.',
                        showConfirmButton: false
                    });
                }

                return { seller_username, car_name, car_type, car_manufacturer, car_image, description, features, price, mileage, manufacture_year, engine_cap };
            }
        }).then(async (updateResult) => {
            if (updateResult.isConfirmed) {
                const { seller_username, car_name, car_type, car_manufacturer, car_image, description, features, price, mileage, manufacture_year, engine_cap } = updateResult.value;
                const ucaUpdateUsedCarController = new UCAUpdateUsedCarController();
                const isSuccess = await ucaUpdateUsedCarController.updateUsedCar(usedCar.usedCarId, seller_username, car_name, car_type, car_manufacturer, car_image, description, features, price, mileage, manufacture_year, engine_cap);

                if (isSuccess === 0) {
                    console.log('Updated Used Car Details:', {
                        seller_username, car_name, car_type, car_manufacturer, car_image, description, features, price, mileage, manufacture_year, engine_cap
                    });
                    Swal.fire('Updated!', 'Used car detail has successfully updated.', 'success');
                    fetchCars();
                } else if (isSuccess === 1) {
                    Swal.fire({
                        position: "center",
                        title: 'Failed!',
                        icon: 'error',
                        html: 'Failed to update a used car.<br><br><small>Please check that you have entered a correct seller username.</small>',
                        confirmButtonText: 'OK',
                    });
                } else if (isSuccess === 2) {
                    Swal.fire({
                        position: "center",
                        title: 'Failed!',
                        icon: 'error',
                        html: 'Failed to update a used car.<br><br><small>It looks like a server error. Please try a while later!</small>',
                        confirmButtonText: 'OK',
                    });
                }
            }
        });
    };

    const deleteUsedCar = async (usedCarId, car_name) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You are about to Delete this used car.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, Delete it!',
            cancelButtonText: 'No, cancel'
        }).then(async (DeleteResult) => {
            if (DeleteResult.isConfirmed) {
                const ucaDeleteUsedCarController = new UCADeleteUsedCarController();
                const isDeleted = await ucaDeleteUsedCarController.deleteUsedCar(usedCarId);

                if (isDeleted) {
                    Swal.fire('Deleted!', 'Used car successfully deleted.', 'success');
                } else {
                    Swal.fire('Failed!', 'Error occurred while deleting used car from the database. Please try again.', 'error');
                }
                console.log('Car Deleted:', car_name);
                Swal.fire('Deleted!', 'The product has been Deleted.', 'success');
                fetchCars();
            }
        });
    }

    const searchUsedCar = async () => {
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

        const ucaSearchUsedCarController = new UCASearchUsedCarController();
        const searchResult = await ucaSearchUsedCarController.searchUsedCar(
            filterCriteria.car_name,
            filterCriteria.car_type,
            filterCriteria.priceRange,
            filterCriteria.manufactureYear,
            Cookies.get('username'),
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
            console.log(searchResult);
            const carData = searchResult.map(doc => ({
                usedCarId: doc.id,
                car_name: doc.car_name,
                manufacture_year: doc.manufacture_year,
                description: doc.description,
                mileage: doc.mileage,
                price: doc.price,
                car_image: doc.car_image,
                view_count: doc.view_count || 0,
                shortlist_count: doc.shortlist_count || 0
            }));

            setCars(carData);
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
                const UcaTrackViewCountController = new UCATrackViewCountController();
                const viewCountHistory = await UcaTrackViewCountController.trackViewCount(usedCarId);

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
                const UcaTrackShortlistCountController = new UCATrackShortlistCountController();
                const shortlistCountHistory = await UcaTrackShortlistCountController.trackShortlistCount(usedCarId);

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
        <div className="uclContainer">
            <div className="uclHeader">
                <button onClick={handleBack} className="uclBack-button">
                    Back
                </button>
                <div className="uclProfile-picture">
                    <img
                        src={"https://placehold.co/40x40?text=" + Cookies.get("username")}
                        alt="Profile"
                    />
                </div>
                <span className="uclUsername">{username}</span>
                <button onClick={handleLogout} className="uclLogout-button">
                    Logout
                </button>
            </div>

            <div className="uclSearch-bar">
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

                    <button onClick={searchUsedCar} className="bucSearch-button">
                        Search
                    </button>
                    <button onClick={clearUsedCar} className="bucSearch-button">
                        Clear
                    </button>
                </span>
                <span>
                    <button onClick={createUsedCar} className="uclCreate-button">
                        Create Used Car
                    </button>
                </span>
            </div>
            <div className="uclUser-table">
                <div className="uclTable-header">
                    <span>Car Picture</span>
                    <span>Car Name</span>
                    <span>Description</span>
                    <span>Manufactured</span>
                    <span>Mileage</span>
                    <span>Price</span>
                    <span></span>
                </div>
                {cars.map((car) => (
                    <div key={car.usedCarId} className="uclTable-row">
                        <img src={car.car_image} alt="Car" className="uclCar-image" />
                        <span>{car.car_name}</span>
                        <span>{car.description}</span>
                        <span>{car.manufacture_year}</span>
                        <span>{car.mileage.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</span>
                        <span>${car.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</span>
                        <button onClick={() => viewUsedCar(car.usedCarId)} className="uclInspect-button">
                            View
                        </button>
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

export default UCAUsedCarListingUI;
