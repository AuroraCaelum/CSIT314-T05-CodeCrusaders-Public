// import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import LoginUI from './boundary/LoginUI';
import UAUserManagementUI from './boundary/UAUserManagementUI';
import UAUserAccountManagementUI from './boundary/UAUserAccountManagementUI';
import UAUserProfileManagementUI from './boundary/UAUserProfileManagementUI';
import UCAUsedCarManagementUI from './boundary/UCAUsedCarManagementUI';
import UCAUsedCarListingUI from './boundary/UCAUsedCarListingUI';
import UCARateReviewUI from './boundary/UCARateReviewUI';
import BuyerUsedCarUI from './boundary/BuyerUsedCarUI';
import BuyerShortlistUI from './boundary/BuyerShortlistUI';
import SellerUsedCarUI from './boundary/SellerUsedCarUI';


function App() {
    return (
        <Router basename='/CSIT314-T05-CodeCrusaders'>
            <Routes>
                <Route path="/" element={<LoginUI />} />
                <Route path="/usermanagement" element={<UAUserManagementUI />} />
                <Route path="/useraccountmanagement" element={<UAUserAccountManagementUI />} />
                <Route path="/userprofilemanagement" element={<UAUserProfileManagementUI />} />
                <Route path="/usedcarmanagement" element={<UCAUsedCarManagementUI />} />
                <Route path="/ucausedcarlisting" element={<UCAUsedCarListingUI />} />
                <Route path="/ucarateandreview" element={<UCARateReviewUI />} />
                <Route path="/buyerusedcar" element={<BuyerUsedCarUI />} />
                <Route path="/buyershortlist" element={<BuyerShortlistUI />} />
                <Route path="/sellerusedcar" element={<SellerUsedCarUI />} />
            </Routes>
        </Router>
    );
}

export default App;