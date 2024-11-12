import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import axios from 'axios';
import Signup from './Signup';

// Mock modules
jest.mock('axios');
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn()
}));

// Mock store setup
const mockStore = configureStore([]);
const store = mockStore({});

// Test wrapper component
const TestWrapper = ({ children }) => (
  <Provider store={store}>
    <BrowserRouter>
      {children}
    </BrowserRouter>
  </Provider>
);

describe('Signup Component', () => {
  beforeEach(() => {
    store.clearActions();
    jest.clearAllMocks();
  });

  // Rendering tests
  describe('Rendering', () => {
    it('renders all form fields and buttons', () => {
      render(<Signup />, { wrapper: TestWrapper });

      expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/last name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/^password/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /sign up/i })).toBeInTheDocument();
      expect(screen.getByText(/already have an account/i)).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /log in/i })).toBeInTheDocument();
    });

    it('renders the logo on larger screens', () => {
      render(<Signup />, { wrapper: TestWrapper });
      const logo = screen.getByAltText('Logo');
      expect(logo).toBeInTheDocument();
    });
  });

  // Form interaction tests
  describe('Form Interactions', () => {
    it('updates input values when user types', async () => {
      render(<Signup />, { wrapper: TestWrapper });
      
      const firstNameInput = screen.getByLabelText(/first name/i);
      const lastNameInput = screen.getByLabelText(/last name/i);
      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/^password/i);
      const confirmPasswordInput = screen.getByLabelText(/confirm password/i);

      await userEvent.type(firstNameInput, 'John');
      await userEvent.type(lastNameInput, 'Doe');
      await userEvent.type(emailInput, 'john@example.com');
      await userEvent.type(passwordInput, 'password123');
      await userEvent.type(confirmPasswordInput, 'password123');

      expect(firstNameInput).toHaveValue('John');
      expect(lastNameInput).toHaveValue('Doe');
      expect(emailInput).toHaveValue('john@example.com');
      expect(passwordInput).toHaveValue('password123');
      expect(confirmPasswordInput).toHaveValue('password123');
    });

    it('toggles password visibility when show/hide button is clicked', async () => {
      render(<Signup />, { wrapper: TestWrapper });
      
      const passwordInput = screen.getByLabelText(/^password/i);
      const toggleButton = passwordInput.parentElement.querySelector('button');

      expect(passwordInput).toHaveAttribute('type', 'password');
      await userEvent.click(toggleButton);
      expect(passwordInput).toHaveAttribute('type', 'text');
      await userEvent.click(toggleButton);
      expect(passwordInput).toHaveAttribute('type', 'password');
    });
  });

  // Validation tests
  describe('Form Validation', () => {
    it('shows error when passwords do not match', async () => {
      const alertMock = jest.spyOn(window, 'alert').mockImplementation(() => {});
      render(<Signup />, { wrapper: TestWrapper });

      // Fill in required fields
      await userEvent.type(screen.getByLabelText(/first name/i), 'John');
      await userEvent.type(screen.getByLabelText(/last name/i), 'Doe');
      await userEvent.type(screen.getByLabelText(/email/i), 'john@example.com');
      await userEvent.type(screen.getByLabelText(/^password/i), 'password123');
      await userEvent.type(screen.getByLabelText(/confirm password/i), 'password456');
      
      fireEvent.submit(screen.getByRole('button', { name: /sign up/i }));
      
      expect(alertMock).toHaveBeenCalledWith("Passwords don't match");
      alertMock.mockRestore();
    });

    it('shows error when password is too short', async () => {
      const alertMock = jest.spyOn(window, 'alert').mockImplementation(() => {});
      render(<Signup />, { wrapper: TestWrapper });

      // Fill in required fields
      await userEvent.type(screen.getByLabelText(/first name/i), 'John');
      await userEvent.type(screen.getByLabelText(/last name/i), 'Doe');
      await userEvent.type(screen.getByLabelText(/email/i), 'john@example.com');
      await userEvent.type(screen.getByLabelText(/^password/i), 'pass');
      await userEvent.type(screen.getByLabelText(/confirm password/i), 'pass');
      
      fireEvent.submit(screen.getByRole('button', { name: /sign up/i }));
      
      expect(alertMock).toHaveBeenCalledWith('Password must be at least 8 characters long');
      alertMock.mockRestore();
    });

    it('shows error when email is invalid', async () => {
      const alertMock = jest.spyOn(window, 'alert').mockImplementation(() => {});
      render(<Signup />, { wrapper: TestWrapper });

      // Fill in required fields except valid email
      await userEvent.type(screen.getByLabelText(/first name/i), 'John');
      await userEvent.type(screen.getByLabelText(/last name/i), 'Doe');
      await userEvent.type(screen.getByLabelText(/email/i), 'invalidemail');
      await userEvent.type(screen.getByLabelText(/^password/i), 'password123');
      await userEvent.type(screen.getByLabelText(/confirm password/i), 'password123');
      
      fireEvent.submit(screen.getByRole('button', { name: /sign up/i }));
      
      expect(alertMock).toHaveBeenCalledWith('Please enter a valid email address');
      alertMock.mockRestore();
    });

    it('shows error when names are missing', async () => {
      const alertMock = jest.spyOn(window, 'alert').mockImplementation(() => {});
      render(<Signup />, { wrapper: TestWrapper });

      // Fill in everything except names
      await userEvent.type(screen.getByLabelText(/email/i), 'john@example.com');
      await userEvent.type(screen.getByLabelText(/^password/i), 'password123');
      await userEvent.type(screen.getByLabelText(/confirm password/i), 'password123');
      
      fireEvent.submit(screen.getByRole('button', { name: /sign up/i }));
      
      expect(alertMock).toHaveBeenCalledWith('Please enter both first and last name');
      alertMock.mockRestore();
    });
  });

  // API integration tests
  describe('API Integration', () => {
    it('successfully registers user and redirects', async () => {
      const mockResponse = {
        data: {
          user: {
            id: 1,
            name: 'John Doe',
            email: 'john@example.com'
          }
        }
      };

      axios.post.mockResolvedValueOnce(mockResponse);
      render(<Signup />, { wrapper: TestWrapper });

      await userEvent.type(screen.getByLabelText(/first name/i), 'John');
      await userEvent.type(screen.getByLabelText(/last name/i), 'Doe');
      await userEvent.type(screen.getByLabelText(/email/i), 'john@example.com');
      await userEvent.type(screen.getByLabelText(/^password/i), 'password123');
      await userEvent.type(screen.getByLabelText(/confirm password/i), 'password123');

      fireEvent.submit(screen.getByRole('button', { name: /sign up/i }));

      await waitFor(() => {
        expect(axios.post).toHaveBeenCalledWith(expect.any(String), {
          name: 'John Doe',
          email: 'john@example.com',
          password: 'password123'
        });
      });

      const actions = store.getActions();
      expect(actions).toContainEqual({
        type: expect.any(String),
        payload: mockResponse.data.user
      });
    });

    it('handles registration failure', async () => {
      const alertMock = jest.spyOn(window, 'alert').mockImplementation(() => {});
      axios.post.mockRejectedValueOnce(new Error('Registration failed'));
      
      render(<Signup />, { wrapper: TestWrapper });

      await userEvent.type(screen.getByLabelText(/first name/i), 'John');
      await userEvent.type(screen.getByLabelText(/last name/i), 'Doe');
      await userEvent.type(screen.getByLabelText(/email/i), 'john@example.com');
      await userEvent.type(screen.getByLabelText(/^password/i), 'password123');
      await userEvent.type(screen.getByLabelText(/confirm password/i), 'password123');

      fireEvent.submit(screen.getByRole('button', { name: /sign up/i }));

      await waitFor(() => {
        expect(alertMock).toHaveBeenCalledWith('Signup failed. Please try again.');
      });

      alertMock.mockRestore();
    });
  });
});