import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';
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

// const mockUserAdminLoginCredential = {
//   userProfile: "User Admin",
//   lName: "Admin",
//   fName: "Admin",
//   email: "admin@csit314.com",
//   username: "admin",
//   password: "adminpw",
//   phoneNum: "8111 1111"
// };

jest.mock('sweetalert2', () => ({
  fire: jest.fn()
}));

// jest.mock('./Util', () => ({
//   Util: {
//     // getUserProfiles: jest.fn().mockResolvedValue({
//     //   docs: mockUserProfileList.map(profile => ({
//     //     _document: { data: { value: { mapValue: { fields: profile } } } }
//     //   })),
//     // }),
//   }
// }));

describe('UI Render Test', () => {
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

// describe('Unit Test', () => {
//   beforeEach(() => {
//     Swal.fire.mockClear();
//   });

//   describe('TC-1', () => {
//     test('TC1-1: Launch Website', async () => {
//       render(<LoginUI />);
//       expect(screen.getByPlaceholderText(/Enter your user ID/i)).toBeInTheDocument();
//     });

//     describe('TC1-2: Invalid username/password', () => {
//       beforeEach(() => {
//         console.Console = jest.fn();
//       });

//       test('All input is missing', async () => {
//         // const mockUserProfileListLoad = jest.fn().mockResolvedValue(mockUserProfileList);
//         // Input invalid username and password
//         render(<LoginUI />);
//         fireEvent.click(screen.getByText("Login"));

//         expect(Swal.fire).toHaveBeenCalledWith({
//           position: "center",
//           title: 'Invalid Input',
//           icon: 'error',
//           text: 'Please select user profile.',
//           confirmButtonText: 'OK',
//           timer: 1500
//         });
//       });

//       test('Missing username and password', async () => {
//         render(<LoginUI />);

//         // Select a profile
//         fireEvent.change(screen.getByTestId("loginAs"), { target: { value: 'UserAdmin' } });

//         // Trigger login with empty username and password
//         fireEvent.click(screen.getByText("Login"));

//         expect(Swal.fire).toHaveBeenCalledWith({
//           position: "center",
//           title: 'Invalid Input',
//           icon: 'error',
//           text: 'Please fill up username/password.',
//           confirmButtonText: 'OK',
//           timer: 1500
//         });
//       });
//     });
//   });
// });