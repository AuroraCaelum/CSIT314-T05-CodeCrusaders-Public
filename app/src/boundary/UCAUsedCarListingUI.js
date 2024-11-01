import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import "./UCAUsedCarListingUI.css";
import { UserLogoutController } from "../controller/UserAuthController";
// import { ViewUserAccountController } from "../controller/UserAccountController";
import { CreateUsedCarController } from "../controller/UsedCarController";
import { ViewUsedCarController, DeleteUsedCarController } from "../controller/UsedCarController";

import Swal from 'sweetalert2';

function UCAUsedCarListingUI() {
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

    if (Cookies.get("userProfile") !== "UsedCarAgent") {
        window.open("/", "_self")
    }

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
                return {
                    carModel: carModelInput.value,
                    vehicleType: vehicleTypeInput.value,
                    priceRange: priceRangeInput.value,
                    manufactureYear: manufactureYearInput.value
                };
            },
        }).then((result) => {
            if (result.isConfirmed) {
                const { carModel, vehicleType, priceRange, manufactureYear } = result.value;
                console.log('Filter criteria:', {
                    carModel,
                    vehicleType,
                    priceRange,
                    manufactureYear
                });
                // Add logic here to handle account creation, like sending data to an API
            }
        });
    };


    const handleCreateUsedCar = () => {
        let car_image_input, seller_username_input, car_manufacturer_input, car_name_input, car_type_input, price_input, manufacture_year_input, mileage_input, engine_cap_input, features_input, description_input;

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
                        <label>Engine Capacity (cc)</label>
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
                car_image_input = popup.querySelector('#car_image');
                seller_username_input = popup.querySelector('#seller_username');
                car_manufacturer_input = popup.querySelector('#car_manufacturer');
                car_name_input = popup.querySelector('#car_name');
                car_type_input = popup.querySelector('#car_type');
                price_input = popup.querySelector('#price');
                manufacture_year_input = popup.querySelector('#manufacture_year');
                mileage_input = popup.querySelector('#mileage');
                engine_cap_input = popup.querySelector('#engine_cap');
                features_input = popup.querySelector('#features');
                description_input = popup.querySelector('#description');

                console.log({ car_image_input, seller_username_input, car_manufacturer_input, car_name_input, car_type_input, price_input, manufacture_year_input, mileage_input, engine_cap_input, features_input, description_input });

                const handleEnterKey = (event) => {
                    if (event.key === 'Enter') {
                        Swal.clickConfirm();
                    }
                };

                if (car_image_input) car_image_input.onkeyup = handleEnterKey;
                if (seller_username_input) seller_username_input.onkeyup = handleEnterKey;
                if (car_manufacturer_input) car_manufacturer_input.onkeyup = handleEnterKey;
                if (car_name_input) car_name_input.onkeyup = handleEnterKey;
                if (car_type_input) car_type_input.onkeyup = handleEnterKey;
                if (price_input) price_input.onkeyup = handleEnterKey;
                if (manufacture_year_input) manufacture_year_input.onkeyup = handleEnterKey;
                if (mileage_input) mileage_input.onkeyup = handleEnterKey;
                if (engine_cap_input) engine_cap_input.onkeyup = handleEnterKey;
                if (features_input) features_input.onkeyup = handleEnterKey;
                if (description_input) description_input.onkeyup = handleEnterKey;
            },
            preConfirm: () => {
                const car_image = car_image_input[0];
                const seller_username = seller_username_input.value;
                const car_manufacturer = car_manufacturer_input.value;
                const car_name = car_name_input.value;
                const car_type = car_type_input.value;
                const price = price_input.value;
                const manufacture_year = manufacture_year_input.value;
                const mileage = mileage_input.value;
                const engine_cap = engine_cap_input.value;
                const features = features_input.value;
                const description = description_input.value;

                if (!car_image || !seller_username || !car_manufacturer || !car_name || !car_type || !price || !manufacture_year || !mileage || !engine_cap || !features || !description) {
                    Swal.showValidationMessage(`Please fill in all fields`);
                    return false;
                }
                else {
                    Swal.fire("Product Listed!"); //is it ok if we change it to this instead of "Product Created!" ?
                }

                return { car_image, seller_username, car_manufacturer, car_name, car_type, price, manufacture_year, mileage, engine_cap, features, description };
            },
        }).then(async (result) => {
            if (result.isConfirmed) {
                const { car_image, seller_username, car_manufacturer, car_name, car_type, price, manufacture_year, mileage, engine_cap, features, description } = result.value;
                console.log('New Car Details:', {
                    car_image,
                    seller_username,
                    car_manufacturer,
                    car_name,
                    car_type,
                    price,
                    manufacture_year,
                    mileage,
                    engine_cap,
                    features,
                    description
                });

                const formData = new FormData();
                formData.append('car_image', car_image);
                formData.append('seller_username', seller_username);
                formData.append('car_manufacturer', car_manufacturer);
                formData.append('car_name', car_name);
                formData.append('car_type', car_type);
                formData.append('price', price);
                formData.append('manufacture_year', manufacture_year);
                formData.append('mileage', mileage);
                formData.append('engine_cap', engine_cap);
                formData.append('features', features);
                formData.append('description', description);

                // Add logic here to handle account creation, like sending data to an API
                const createUsedCarController = new CreateUsedCarController();
                const isSuccess = await createUsedCarController.createUsedCar(Cookies.get("username"), seller_username, car_name, car_type, car_manufacturer, car_image, description, features, price, mileage, manufacture_year, engine_cap);

                if (isSuccess) {
                    console.log("Used Car successfully created.");
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
                cancelButtonText: 'close',
                confirmButtonText: 'Update Details',
                showDenyButton: true,
                denyButtonText: 'Delete',
                focusConfirm: false
            }).then((result) => {
                if (result.isConfirmed) {
                    handleUpdateUsedCar(usedCarId);
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
                            console.log('Car Deleted:', usedCarId.prodName);
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

    const handleUpdateUsedCar = (user) => {
        Swal.fire({
            title: 'Update Used Car Detail',
            html: `
                <input type="text" id="prodName" class="swal2-input" placeholder="Product Name" value="${user.prodName}">
                <input type="text" id="description" class="swal2-input" placeholder="Description" value="${user.description}">
                <input type="text" id="type" class="swal2-input" placeholder="Type" value="${user.type}">
                <input type="text" id="price" class="swal2-input" placeholder="Price">
            `,
            confirmButtonText: 'Update',
            focusConfirm: false,
            preConfirm: () => {
                const prodName = document.getElementById('prodName').value;
                const description = document.getElementById('description').value;
                const type = document.getElementById('type').value;
                const price = document.getElementById('price').value;

                if (!prodName || !description || !type || !price) {
                    Swal.showValidationMessage(`Please fill in all fields`);
                    return false;
                }
                return { prodName, description, type, price };
            }
        }).then((updateResult) => {
            if (updateResult.isConfirmed) {
                const { prodName, description, type, price } = updateResult.value;
                console.log('Updated Used Car Details:', {
                    prodName,
                    description,
                    type,
                    price
                });
                Swal.fire('Updated!', 'The used car details have been updated.', 'success');
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
                        <img src={car.image} alt="Car" className="uclCar-image" />
                        <span>{car.car_name}</span>
                        <span>{car.manufacture_year}</span>
                        <span>{car.mileage.toLocaleString()}</span>
                        <span>${car.price.toLocaleString()}</span>
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
