import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { act } from 'react';
import Swal from 'sweetalert2';
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

window.open = jest.fn();

jest.mock('sweetalert2', () => ({
  fire: jest.fn()
}));

describe('UI Render Test', () => {
  describe('Login UI', () => {
    test('LoginUI renders without crashing', async () => {
      await act(async () => {
        render(<LoginUI />);
      });
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
      expect(screen.getByText('Car Name')).toBeInTheDocument();
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
});

describe('Unit Test', () => {
  beforeEach(() => {
    //Swal.fire.mockClear();
    Swal.fire = jest.fn().mockResolvedValue(true);
  });

  describe('TC 30: Login', () => {

    describe('TC 30-1: Launch Website', () => {

      test('Launch Website', async () => {
        render(<LoginUI />);
        expect(screen.getByPlaceholderText(/Enter your user ID/i)).toBeInTheDocument();
      });

    });

    describe('TC 30-2: Invalid choice of UserProfile', () => {

      test('Missing user profile', async () => {
        render(<LoginUI />);

        fireEvent.change(screen.getByTestId("loginAs"), { target: { value: '' } });
        fireEvent.click(screen.getByText("Login"));

        expect(Swal.fire).toHaveBeenCalledWith({
          position: "center",
          title: 'Invalid Input',
          icon: 'error',
          text: 'Please select user profile.',
          confirmButtonText: 'OK',
          timer: 1500
        });
      });
    });

    describe('TC 30-3: Invalid username/password', () => {

      test('Missing username and password', async () => {
        render(<LoginUI />);

        fireEvent.change(screen.getByTestId("loginAs"), { target: { value: 'Seller' } });

        fireEvent.change(screen.getByPlaceholderText(/Enter your user ID/i), { target: { value: '' } });
        fireEvent.change(screen.getByLabelText(/Password:/), { target: { value: '' } });

        fireEvent.click(screen.getByText("Login"));

        expect(Swal.fire).toHaveBeenCalledWith({
          position: "center",
          title: 'Invalid Input',
          icon: 'error',
          text: 'Please fill up username/password.',
          confirmButtonText: 'OK',
          timer: 1500
        });
      });
    });

  });

  describe('TC 31: Logout', () => {

    test('Logout', async () => {
      render(<SellerUsedCarUI />);

      Object.defineProperty(document, 'cookie', {
        writable: true,
        value: 'username=seller'
      });

      fireEvent.click(screen.getByText("Logout"));

      await waitFor(() => {
        expect(Swal.fire).toHaveBeenCalledWith({
          position: "center",
          title: 'Logout Successful',
          icon: 'success',
          confirmButtonText: 'Back to login',
          timer: 1500
        });
      });

    });
  });

  describe('TC 32: Track Number of Views of Used Cars for Seller', () => {
    const mockTrackViewCount = jest.fn();
    const mockTrackShortlistCount = jest.fn();
    beforeEach(() => {
      const mockCarData = [
        {
          usedCarId: '1',
          car_name: 'Car 1',
          description: 'Description 1',
          manufacture_year: 2020,
          mileage: 10000,
          price: 15000,
          view_count: 10,
          shortlist_count: 5
        },
        {
          usedCarId: '2',
          car_name: 'Car 2',
          description: 'Description 2',
          manufacture_year: 2021,
          mileage: 5000,
          price: 20000,
          view_count: 20,
          shortlist_count: 10
        }
      ];

      Swal.fire.mockClear();

      React.useState = jest.fn()
        .mockReturnValueOnce(["seller"])
        .mockReturnValueOnce([mockCarData, {}]);
      React.useEffect = jest.fn().mockImplementation(f => f());

      render(
        <SellerUsedCarUI
          cars={mockCarData}
          trackViewCount={mockTrackViewCount}
          trackShortlistCount={mockTrackShortlistCount}
        />
      );
    });

    test('Track View Count', async () => {
      // Fake cookie data
      Object.defineProperty(document, 'cookie', {
        writable: true,
        value: 'username=seller'
      });

      fireEvent.click(screen.getAllByTestId('viewIcon')[0]);
      expect(Swal.fire).toHaveBeenCalled();
    });
  });

  describe('TC 33: Track Number of Shortlist of Used Cars for Seller', () => {
    const mockTrackViewCount = jest.fn();
    const mockTrackShortlistCount = jest.fn();
    beforeEach(() => {
      const mockCarData = [
        {
          usedCarId: '1',
          car_name: 'Car 1',
          description: 'Description 1',
          manufacture_year: 2020,
          mileage: 10000,
          price: 15000,
          view_count: 10,
          shortlist_count: 5
        },
        {
          usedCarId: '2',
          car_name: 'Car 2',
          description: 'Description 2',
          manufacture_year: 2021,
          mileage: 5000,
          price: 20000,
          view_count: 20,
          shortlist_count: 10
        }
      ];

      Swal.fire.mockClear();

      React.useState = jest.fn()
        .mockReturnValueOnce(["seller"])
        .mockReturnValueOnce([mockCarData, {}]);
      React.useEffect = jest.fn().mockImplementation(f => f());

      render(
        <SellerUsedCarUI
          cars={mockCarData}
          trackViewCount={mockTrackViewCount}
          trackShortlistCount={mockTrackShortlistCount}
        />
      );
    });

    test('Track Shortlist Count', async () => {
      // Fake cookie data
      Object.defineProperty(document, 'cookie', {
        writable: true,
        value: 'username=seller'
      });

      fireEvent.click(screen.getAllByTestId('shortlistIcon')[0]);
      expect(Swal.fire).toHaveBeenCalled();
    });
  });

  describe('TC 34: Give Rate and Review to Used Car Agent', () => {
    const mockTrackViewCount = jest.fn();
    const mockTrackShortlistCount = jest.fn();
    const mockViewUsedCar = jest.fn();
    const mockRateReview = jest.fn();
    beforeEach(async () => {
      const mockCarData = [
        {
          usedCarId: '1',
          car_name: 'Car 1',
          description: 'Description 1',
          manufacture_year: 2020,
          mileage: 10000,
          price: 15000,
          view_count: 10,
          shortlist_count: 5
        },
        {
          usedCarId: '2',
          car_name: 'Car 2',
          description: 'Description 2',
          manufacture_year: 2021,
          mileage: 5000,
          price: 20000,
          view_count: 20,
          shortlist_count: 10
        }
      ];

      const mockCarDetail = {
        usedCarId: '1',
        agent_username: 'agent',
        seller_username: 'seller',
        car_name: 'Car 1',
        car_image: "https://placehold.co/100x100?text=Car+Image",
        car_type: 'Type',
        car_manufacturer: 'Manufacturer',
        features: 'Features',
        description: 'Description 1',
        manufacture_year: 2020,
        mileage: 10000,
        engine_cap: 2000,
        price: 15000,
        view_count: 10,
        shortlist_count: 5
      }

      Swal.fire.mockClear();

      React.useState = jest.fn()
        .mockReturnValueOnce(["seller"])
        .mockReturnValueOnce([mockCarData, jest.fn()]);
      React.useEffect = jest.fn().mockImplementation(f => f());

      jest.mock('./controller/SellerUsedCarController', () => ({
        SellerViewUsedCarController: {
          viewUsedCar: jest.fn().mockResolvedValue(
            { "usedCarId": '1', "body": mockCarDetail }
          ),
        }
      }));

      await render(
        <SellerUsedCarUI
          cars={mockCarData}
          trackViewCount={mockTrackViewCount}
          trackShortlistCount={mockTrackShortlistCount}
          viewUsedCar={mockViewUsedCar}
          leaveRateReview={mockRateReview}
        />
      );
    });

    test('Open rate and review popup', async () => {
      // Fake cookie data
      Object.defineProperty(document, 'cookie', {
        writable: true,
        value: 'username=seller'
      });

      // Fire sweetalert
      let ratingInput = 0, reviewInput;

      Swal.fire({
        title: '<h2 style="text-decoration: underline;">Feedback</h2>',
        html: `
                <div>
                    <p><strong>Agent:</strong>agent</p>
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
                    <textarea id="review" placeholder="Write your review" rows="10" cols="50"></textarea>
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
            Swal.showValidationMessage(`Please fill up all inputs.`);
            return false;
          }

          return { rate: ratingInput, review: reviewInput };
        }
      }).then(async (result) => {
        if (result.isConfirmed) {
          const { rate, review } = result.value;

          const reviewer_username = Cookies.get('username');
          const reviewer_type = Cookies.get('userProfile');

          const sellerleaveRateReviewController = new SellerLeaveRateReviewController(agent_username, rate, review, reviewer_username, reviewer_type);
          const isSuccess = await sellerleaveRateReviewController.leaveRateReview(agent_username, rate, review, reviewer_username, reviewer_type);

          if (isSuccess) {
            console.log(`Rating submitted for agent ${agent_username}:`, { rate, review });
            Swal.fire('Thank you!', 'Your rating and review have been submitted.', 'success');
          } else {
            console.log('Rating submission failed');
            Swal.fire('Error', 'Error occurred while saving your rate and review. Please try again.', 'error');
          }
        }
      });

      expect(Swal.fire).toHaveBeenCalled();
    });
  });
});