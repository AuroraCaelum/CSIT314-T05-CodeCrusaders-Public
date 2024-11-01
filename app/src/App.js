// import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import LoginUI from './boundary/LoginUI';
import UserManagementUI from './boundary/UserManagementUI';
import UserAccountManagementUI from './boundary/UserAccountManagementUI';
import UserProfileManagementUI from './boundary/UserProfileManagementUI';
import UsedCarManagementUI from './boundary/UsedCarManagementUI';
import UCAUsedCarListingUI from './boundary/UCAUsedCarListingUI';
import UCARateReviewUI from './boundary/UCARateReviewUI';
import BuyerMainUI from './boundary/BuyerMainUI';
import BuyerUsedCarUI from './boundary/BuyerUsedCarUI';
import BuyerShortlistUI from './boundary/BuyerShortlistUI';


function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<LoginUI />} />
                <Route path="/usermanagement" element={<UserManagementUI />} />
                <Route path="/useraccountmanagement" element={<UserAccountManagementUI />} />
                <Route path="/userprofilemanagement" element={<UserProfileManagementUI />} />
                <Route path="/usedcarmanagement" element={<UsedCarManagementUI />} />
                <Route path="/ucausedcarlisting" element={<UCAUsedCarListingUI />} />
                <Route path="/ucarateandreview" element={<UCARateReviewUI />} />
                <Route path="/buyermain" element={<BuyerMainUI />} />
                <Route path="/buyerusedcar" element={<BuyerUsedCarUI />} />
                <Route path="/buyershortlist" element={<BuyerShortlistUI />} />
            </Routes>
        </Router>
    );
}

export default App;
// const express = require('express');
// const app = express();
// const userAccountController = require('./controller/UserAccountController');

// app.use(express.json());

// // User authentication routes
// app.post('/register', userAccountController.register);
// app.post('/login', userAccountController.login);
// app.post('/logout', userAccountController.logout);

// app.listen(5000, () => {
//     console.log('Server is running on port 5000');
// });
