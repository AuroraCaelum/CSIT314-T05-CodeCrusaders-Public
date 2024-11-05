import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import "./UCAUsedCarListingUI.css";
import { UserLogoutController } from "../controller/UserAuthController";
// import { ViewUserAccountController } from "../controller/UserAccountController";
import { CreateUsedCarController, UpdateUsedCarController } from "../controller/UsedCarController";
import { ViewUsedCarController, DeleteUsedCarController, SearchUsedCarController } from "../controller/UsedCarController";

import Swal from 'sweetalert2';

function UCAUsedCarListingUI() {
    const [username] = useState(Cookies.get("username"));
    //const [searchUsername, setSearchUsername] = useState("");
    const [cars, setCars] = useState([
        { car_name: "Loading...", manufacture_year: "Loading...", mileage: "Loading...", price: "Loading...", image: "https://placehold.co/100x100?text=Car+Image" }
    ]);

    const fetchCars = async () => {
        const snapshot = await ViewUsedCarController.getUsedCarList();
        if (snapshot !== null) {
            const carData = snapshot.docs.map(doc => ({
                usedCarId: doc.id,
                car_name: doc.data().car_name,
                manufacture_year: doc.data().manufacture_year,
                mileage: doc.data().mileage,
                price: doc.data().price,
                car_image: doc.data().car_image
            }));
            setCars(carData);
        }
    };

    useEffect(() => {
        fetchCars();
    }, []);

    if (Cookies.get("userProfile") !== "UsedCarAgent") {
        window.open("/", "_self")
    }


    const handleCreateUsedCar = () => {
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
                            <option value="">Select Car Type</option>
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
                        <input type="text" id="price" class="swal2-input" placeholder="Ex) 150000">
                    </div>
                    <div class="item">
                        <label>Manufacture Year</label>
                        <input type="text" id="manufacture_year" class="swal2-input" placeholder="Ex) 2021">
                    </div>
                    <div class="item">
                        <label>Mileage (km)</label>
                        <input type="text" id="mileage" class="swal2-input" placeholder="Ex) 100000">
                    </div>
                    <div class="item">
                        <label>Engine Capacity (CC)</label>
                        <input type="text" id="engine_cap" class="swal2-input" placeholder="Ex) 1500">
                    </div>
                    <div class="item">
                        <label>Features</label>
                        <input type="text" id="features" class="swal2-input" placeholder="Enter features...">
                    </div>
                    <div class="item" style="grid-column: span 2">
                        <label>Description</label>
                        <input type="textarea" id="description" class="swal2-input" placeholder="Enter description...">
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

                if (!seller_username_input || !car_name_input || !car_type_input || !car_manufacturer_input) {
                    console.error("One or more inputs are not found.");
                }

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
                }
                else {
                    Swal.fire("Product Created!");
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
                const createUsedCarController = new CreateUsedCarController();
                const isSuccess = await createUsedCarController.createUsedCar(usedCarId, Cookies.get("username"), seller_username, car_name, car_type, car_manufacturer, car_image, description, features, price, mileage, manufacture_year, engine_cap);

                if (isSuccess) {
                    console.log(usedCarId);
                    console.log("Used Car successfully created.");
                    fetchCars();
                } else {
                    console.error("Failed to create used car.");
                }
            }
        });
    };

    const handleViewUsedCar = async (usedCarId) => { //not done
        console.log('Fetching used Car for:', usedCarId);
        const viewUsedCarController = new ViewUsedCarController();
        const usedCar = await viewUsedCarController.viewUsedCar(usedCarId);
        console.log("Used Car data received:", usedCar);
        console.log(usedCarId);

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
                cancelButtonText: 'close',
                confirmButtonText: 'Update Details',
                showDenyButton: true,
                denyButtonText: 'Delete',
                focusConfirm: false
            }).then((result) => {
                if (result.isConfirmed) {
                    handleUpdateUsedCar(usedCar);
                } else if (result.isDenied) {
                    Swal.fire({
                        title: 'Are you sure?',
                        text: "You are about to Delete this product.",
                        icon: 'warning',
                        showCancelButton: true,
                        confirmButtonText: 'Yes, Delete it!',
                        cancelButtonText: 'No, cancel'
                    }).then(async (DeleteResult) => {
                        if (DeleteResult.isConfirmed) {
                            const deleteUsedCarController = new DeleteUsedCarController();
                            const isDeleted = await deleteUsedCarController.deleteUsedCar(usedCarId);

                            if (isDeleted) {
                                Swal.fire('Deleted!', 'This car has been deleted.', 'success');
                            } else {
                                Swal.fire('Failed!', 'Failed to delete this car.', 'error');
                            }
                            console.log('Car Deleted:', usedCar.body.car_name);
                            Swal.fire('Deleteed!', 'The product has been Deleted.', 'success');
                        }
                    });
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

    const handleUpdateUsedCar = (usedCar) => {
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
                    <div class="item"">
                        <label>Car Name</label>
                        <input type="text" id="car_name" class="swal2-input" value=${usedCar.body.car_name}>
                    </div>
                    <div class="item"">
                        <label>Car Type</label>
                        <select id="car_type" class="swal2-select">
                            <option value="">Select Car Type</option>
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
                    <div class="item"">
                        <label>Price ($)</label>
                        <input type="text" id="price" class="swal2-input" value=${usedCar.body.price}>
                    </div>
                    <div class="item"">
                        <label>Manufacture Year</label>
                        <input type="text" id="manufacture_year" class="swal2-input" value=${usedCar.body.manufacture_year}>
                    </div>
                    <div class="item"">
                        <label>Mileage (km)</label>
                        <input type="text" id="mileage" class="swal2-input" value=${usedCar.body.mileage}>
                    </div>
                    <div class="item"">
                        <label>Engine Capacity (cc)</label>
                        <input type="text" id="engine_cap" class="swal2-input" value=${usedCar.body.engine_cap}>
                    </div>
                    <div class="item"">
                        <label>Features</label>
                        <input type="text" id="features" class="swal2-input" value=${usedCar.body.features}>
                    </div>
                    <div class="item" style="grid-column: span 2">
                        <label>Description</label>
                        <input type="textarea" id="description" class="swal2-input" value=${usedCar.body.description}>
                    </div>
                </div>
            `,
            confirmButtonText: 'Update',
            focusConfirm: false,
            preConfirm: () => {
                const seller_username = document.getElementById('seller_username').value;
                const car_name = document.getElementById('car_name').value;
                const car_type = document.getElementById('car_type').value;
                const car_manufacturer = document.getElementById('car_manufacturer').value;
                const car_image = document.getElementById('car_image').files[0];
                const description = document.getElementById('description').value;
                const features = document.getElementById('features').value;
                const price = document.getElementById('price').value;
                const mileage = document.getElementById('mileage').value;
                const manufacture_year = document.getElementById('manufacture_year').value;
                const engine_cap = document.getElementById('engine_cap').value;

                if (!seller_username || !car_name || !car_type || !car_manufacturer || !description || !features || !price || !mileage || !manufacture_year || !engine_cap) {
                    Swal.showValidationMessage(`Please fill in all fields`);
                    return false;
                }
                return { seller_username, car_name, car_type, car_manufacturer, car_image, description, features, price, mileage, manufacture_year, engine_cap };
            }
        }).then(async (updateResult) => {
            if (updateResult.isConfirmed) {
                const { seller_username, car_name, car_type, car_manufacturer, car_image, description, features, price, mileage, manufacture_year, engine_cap } = updateResult.value;
                const updateUsedCarController = new UpdateUsedCarController();
                const isSuccess = await updateUsedCarController.updateUsedCar(usedCar.usedCarId, seller_username, car_name, car_type, car_manufacturer, car_image, description, features, price, mileage, manufacture_year, engine_cap);

                if (isSuccess) {
                    console.log('Updated Used Car Details:', {
                        seller_username, car_name, car_type, car_manufacturer, car_image, description, features, price, mileage, manufacture_year, engine_cap
                    });
                    Swal.fire('Updated!', 'The used car details have been updated.', 'success');
                    fetchCars();
                } else {
                    Swal.fire('Error!', 'Failed to update car details.', 'error');
                }
            }
        });
    };

    const handleSearchUsedCar = () => { //this is for saerch pop up
        let carModelInput, vehicleTypeInput, priceRangeInput, manufactureYearInput;

        Swal.fire({
            title: 'Search Used Car',
            html: `
                <select id="carModel" class="swal2-input custom-select">
                <option value="">Select car model</option>
                <option value="Sedan">Sedan</option>
                <option value="SUV">SUV</option>
                <option value="Truck">Truck</option>
                <option value="Convertible">Convertible</option>
            </select>

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
            `,

            // customClass: {
            //     input: 'swal2-input custom-select'
            // },

            confirmButtonText: 'Search Used Car',
            focusConfirm: false,
            didOpen: () => {
                const popup = Swal.getPopup();
                carModelInput = popup.querySelector('#carModel');
                vehicleTypeInput = popup.querySelector('#vehicleType');
                priceRangeInput = popup.querySelector('#priceRange');
                manufactureYearInput = popup.querySelector('#manufactureYear');

                const handleEnterKey = (event) => {
                    if (event.key === 'Enter') {
                        Swal.clickConfirm();
                    }
                };
                
                carModelInput.onkeyup = handleEnterKey;
                vehicleTypeInput.onkeyup = handleEnterKey;
                priceRangeInput.onkeyup = handleEnterKey;
                manufactureYearInput.onkeyup = handleEnterKey;
            },
            preConfirm: () => {
                let priceRange = [];
                priceRange[0] = priceRangeInput.value.toString().split("-")[0];
                priceRange[1] = priceRangeInput.value.toString().split("-")[1];
                return {
                    carModel: carModelInput.value,
                    vehicleType: vehicleTypeInput.value,
                    priceRange: priceRange,
                    manufactureYear: manufactureYearInput.value
                };
            },
        }).then(async (result) => {
            if (result.isConfirmed) {
                const { carModel, vehicleType, priceRange, manufactureYear } = result.value;
                console.log('Filter criteria:', {
                    carModel,
                    vehicleType,
                    priceRange,
                    manufactureYear
                });
                // Add logic here to handle account creation, like sending data to an API
                const searchUsedCarController = new SearchUsedCarController();
                const searchResult = await searchUsedCarController.searchUsedCar(carModel, vehicleType, priceRange, manufactureYear);

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
                {/* <form onSubmit={handleSearch}>
                    <input
                        type="text"
                        placeholder="Used Car Name"
                        value={searchUsername}
                        onChange={(e) => setSearchUsername(e.target.value)}
                    //className="search-input"
                    />
                    <button type="submit" className="uclSearch-button">
                        Search
                    </button>
                </form> */}
                <button onClick={handleSearchUsedCar} className="uclSearch-button">
                    Search
                </button>

                <button onClick={handleCreateUsedCar} className="uclCreate-button">
                    Create Used Car
                </button>
            </div>
            <div className="uclUser-table">
                <div className="uclTable-header">
                    <span></span>
                    <span>Car Name:</span>
                    <span>Manufactured:</span>
                    <span>Mileage:</span>
                    <span>Price:</span>
                    <span></span>
                </div>
                {cars.map((car) => (
                    <div key={car.usedCarId} className="uclTable-row">
                        <img src={car.car_image} alt="Car" className="uclCar-image" />
                        <span>{car.car_name}</span>
                        <span>{car.manufacture_year}</span>
                        <span>{car.mileage.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</span>
                        <span>${car.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</span>
                        <button onClick={() => handleViewUsedCar(car.usedCarId)} className="uclInspect-button">
                            Inspect
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default UCAUsedCarListingUI;
