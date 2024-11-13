import { render, screen } from '@testing-library/react';
import App from './App';
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

describe('Login UI', () => {
  test('LoginUI renders without crashing', async () => {
    render(<LoginUI />);
    expect(screen.getByText('Login')).toBeInTheDocument();
  });
});

describe('User Admin UI', () => {
  test('UAUserManagementUI renders without crashing', async () => {
    render(<UAUserManagementUI />);
    expect(screen.getByText('User Account Management')).toBeInTheDocument();
  });

  test('UAUserAccountManagementUI renders without crashing', async () => {
    render(<UAUserAccountManagementUI />);
    expect(screen.getByText('Create user account')).toBeInTheDocument();
  });

  test('UAUserProfileManagementUI renders without crashing', async () => {
    render(<UAUserProfileManagementUI />);
    expect(screen.getByText('Create user profile')).toBeInTheDocument();
  });
});

describe('Used Car Agent UI', () => {
  test('UCAUsedCarManagementUI renders without crashing', async () => {
    render(<UCAUsedCarManagementUI />);
    expect(screen.getByText('Used Car Listing')).toBeInTheDocument();
  });

  test('UCAUsedCarListingUI renders without crashing', async () => {
    // Set fake Cookie
    Object.defineProperty(document, 'cookie', {
      writable: true,
      value: 'username=usedcaragent'
    });
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
    // Set fake Cookie
    Object.defineProperty(document, 'cookie', {
      writable: true,
      value: 'username=seller'
    });
    expect(screen.getByText('Manufactured')).toBeInTheDocument();
  });
});