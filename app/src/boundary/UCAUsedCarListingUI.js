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
        let prodNameInput, descriptionInput, typeInput, priceInput, manufactureYearInput, mileageInput, engineCapInput, curbWeightInput, featuresInput, imageFileInput;

        Swal.fire({
            title: 'Create Used Car',
            width: 1200,
            html: `
                <div class="wrapper">
                    <input type="file" id="car_image" class="swal2-input" accept="image/*" placeholder="Car Image">
                    <div class="item">
                        <label>Car Manufacturer</label>
                        <input type="text" id="car_manufacturer" class="swal2-input" placeholder="Ex) Hyundai">
                    </div>
                    <div class="item">
                        <label>Car Name</label>
                        <input type="text" id="car_name" class="swal2-input" placeholder="Ex) Ioniq 5">
                    </div>
                    <div class="item">
                        <label>Price ($)</label>
                        <input type="text" id="price" class="swal2-input" placeholder="Ex) 150000">
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
                    <div class="item">
                        <label>Description</label>
                        <input type="textarea" id="description" class="swal2-input" placeholder="Enter description...">
                    </div>
                </div>
            `,
            confirmButtonText: 'Create Used Car',
            focusConfirm: false,
            didOpen: () => {
                const popup = Swal.getPopup();
                prodNameInput = popup.querySelector('#prodName');
                descriptionInput = popup.querySelector('#description');
                typeInput = popup.querySelector('#type');
                priceInput = popup.querySelector('#price');
                manufactureYearInput = popup.querySelector('#manufactureYear');
                mileageInput = popup.querySelector('#mileage');
                engineCapInput = popup.querySelector('#engineCap');
                curbWeightInput = popup.querySelector('#curbWeight');
                featuresInput = popup.querySelector('#features');
                imageFileInput = popup.querySelector('#carImage');

                console.log({ prodNameInput, descriptionInput, typeInput, priceInput, manufactureYearInput, mileageInput, engineCapInput, curbWeightInput, featuresInput, imageFileInput });

                const handleEnterKey = (event) => {
                    if (event.key === 'Enter') {
                        Swal.clickConfirm();
                    }
                };

                if (prodNameInput) prodNameInput.onkeyup = handleEnterKey;
                if (descriptionInput) descriptionInput.onkeyup = handleEnterKey;
                if (typeInput) typeInput.onkeyup = handleEnterKey;
                if (priceInput) priceInput.onkeyup = handleEnterKey;
                if (manufactureYearInput) manufactureYearInput.onkeyup = handleEnterKey;
                if (mileageInput) mileageInput.onkeyup = handleEnterKey;
                if (engineCapInput) engineCapInput.onkeyup = handleEnterKey;
                if (curbWeightInput) curbWeightInput.onkeyup = handleEnterKey;
                if (featuresInput) featuresInput.onkeyup = handleEnterKey;
                if (imageFileInput) imageFileInput.onkeyup = handleEnterKey;

            },
            preConfirm: () => {
                const prodName = prodNameInput.value;
                const description = descriptionInput.value;
                const type = typeInput.value;
                const price = priceInput.value;
                const manufactureYear = manufactureYearInput.value;
                const mileage = mileageInput.value;
                const engineCap = engineCapInput.value;
                const curbWeight = curbWeightInput.value;
                const features = featuresInput.value;
                const imageFile = imageFileInput[0];

                if (!prodName || !description || !type || !price || !manufactureYear || !mileage || !engineCap || !curbWeight || !features || !imageFile) {
                    Swal.showValidationMessage(`Please fill in all the fields`);
                }
                else {
                    Swal.fire("Product Listed!"); //is it ok if we change it to this instead of "Product Created!" ?
                }

                return { prodName, description, type, price, manufactureYear, mileage, engineCap, curbWeight, features, imageFile };
            },
        }).then(async (result) => {
            if (result.isConfirmed) {
                const { prodName, description, type, price, manufactureYear, mileage, engineCap, curbWeight, features, imageFile } = result.value;
                console.log('New Account Details:', {
                    prodName,
                    description,
                    type,
                    price,
                    manufactureYear,
                    mileage,
                    engineCap,
                    curbWeight,
                    features,
                    imageFile
                });

                const formData = new FormData();
                formData.append("prodName", prodName);
                formData.append("description", description);
                formData.append("type", type);
                formData.append("price", price);
                formData.append("manufactureYear", manufactureYear);
                formData.append("mileage", mileage);
                formData.append("engineCap", engineCap);
                formData.append("curbWeight", curbWeight);
                formData.append("features", features);
                formData.append("carImage", imageFile);

                // Add logic here to handle account creation, like sending data to an API
                const createUsedCarController = new CreateUsedCarController();
                const isSuccess = await createUsedCarController.createUsedCar(
                    prodName,
                    description,
                    type,
                    price,
                    manufactureYear,
                    mileage,
                    engineCap,
                    curbWeight,
                    features,
                    imageFile
                );

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
