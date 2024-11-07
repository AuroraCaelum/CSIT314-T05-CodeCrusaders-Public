import { render, screen } from '@testing-library/react';
import App from './App';
import LoginUI from './boundary/LoginUI';
import UserManagementUI from './boundary/UserManagementUI';
import UserAccountManagementUI from './boundary/UserAccountManagementUI';
import UserProfileManagementUI from './boundary/UserProfileManagementUI';
import UsedCarManagementUI from './boundary/UsedCarManagementUI';
import UCAUsedCarListingUI from './boundary/UCAUsedCarListingUI';
import UCARateReviewUI from './boundary/UCARateReviewUI';
import BuyerUsedCarUI from './boundary/BuyerUsedCarUI';
import BuyerShortlistUI from './boundary/BuyerShortlistUI';
import SellerUsedCarUI from './boundary/SellerUsedCarUI';

describe('App Common UI', () => {
  test('App renders without crashing', async () => {
    render(<App />);
    expect(screen.getByText('Login')).toBeInTheDocument();
  });

  test('LoginUI renders without crashing', async () => {
    render(<LoginUI />);
    expect(screen.getByText('Login')).toBeInTheDocument();
  });
});

describe('User Admin UI', () => {
  test('UserManagementUI renders without crashing', async () => {
    render(<UserManagementUI />);
    expect(screen.getByText('User Account Management')).toBeInTheDocument();
  });

  test('UserAccountManagementUI renders without crashing', async () => {
    render(<UserAccountManagementUI />);
    expect(screen.getByText('Create user account')).toBeInTheDocument();
  });

  test('UserProfileManagementUI renders without crashing', async () => {
    render(<UserProfileManagementUI />);
    expect(screen.getByText('Create user profile')).toBeInTheDocument();
  });
});

describe('Used Car Agent UI', () => {
  test('UsedCarManagementUI renders without crashing', async () => {
    render(<UsedCarManagementUI />);
    expect(screen.getByText('Used Car Listing')).toBeInTheDocument();
  });

  test('UCAUsedCarListingUI renders without crashing', async () => {
    render(<UCAUsedCarListingUI />);
    expect(screen.getByText('Car Name')).toBeInTheDocument();
  });

  test('UCARateReviewUI renders without crashing', async () => {
    // Set fake Cookie
    Object.defineProperty(document, 'cookie', {
      writable: true,
      value: 'username=usedcaragent'
    });
    render(<UCARateReviewUI />);
    expect(screen.getByText('Reviewer')).toBeInTheDocument();
  });
});

describe('Buyer and Seller UI', () => {
  test('BuyerUsedCarUI renders without crashing', async () => {
    render(<BuyerUsedCarUI />);
    expect(screen.getByText('Select manufacture year')).toBeInTheDocument();
  });

  test('BuyerShortlistUI renders without crashing', async () => {
    render(<BuyerShortlistUI />);
    expect(screen.getByText('Remove from Shortlist')).toBeInTheDocument();
  });

  test('SellerUsedCarUI renders without crashing', async () => {
    render(<SellerUsedCarUI />);
    expect(screen.getByText('Manufactured')).toBeInTheDocument();
  });
});