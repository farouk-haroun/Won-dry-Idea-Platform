import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import axios from 'axios';
import Login from './login';
import authReducer from '../store/authSlice';
import { API_BASE_URL } from '../utils/constants';

// Mock axios
jest.mock('axios');

// Mock react-router-dom hooks
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

// Setup store
const setupStore = (preloadedState = {}) => {
  return configureStore({
    reducer: {
      auth: authReducer,
    },
    preloadedState,
  });
};

// Test wrapper component
const renderWithProviders = (
  ui,
  {
    preloadedState = {},
    store = setupStore(preloadedState),
    ...renderOptions
  } = {}
) => {
  const Wrapper = ({ children }) => {
    return (
      <Provider store={store}>
        <MemoryRouter>
          {children}
        </MemoryRouter>
      </Provider>
    );
  };
  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
};

describe('Login Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    test('renders login form with all necessary elements', () => {
      renderWithProviders(<Login />);

      // Check for form elements
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /^non-vu log in$/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /^v.*vu log in$/i })).toBeInTheDocument();
      
      // Check for links
      expect(screen.getByText(/forgot password/i)).toBeInTheDocument();
      expect(screen.getByText(/sign up/i)).toBeInTheDocument();
    });

    test('renders logo on larger screens', () => {
      renderWithProviders(<Login />);
      const logo = screen.getByAltText(/logo/i);
      expect(logo).toBeInTheDocument();
      expect(logo).toHaveAttribute('src', '/logo.svg');
    });
  });

  describe('Form Interaction', () => {
    test('updates email input value on change', async () => {
      renderWithProviders(<Login />);
      const emailInput = screen.getByLabelText(/email/i);
      
      await waitFor(() => {
        fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
        expect(emailInput.value).toBe('test@example.com');
      });
    });

    test('updates password input value on change', async () => {
      renderWithProviders(<Login />);
      const passwordInput = screen.getByLabelText(/password/i);
      
      await waitFor(() => {
        fireEvent.change(passwordInput, { target: { value: 'password123' } });
        expect(passwordInput.value).toBe('password123');
      });
    });

    test('displays validation messages for required fields when submitting empty form', async () => {
      renderWithProviders(<Login />);
      const submitButton = screen.getByRole('button', { name: /^non-vu log in$/i });
      
      await waitFor(() => {
        fireEvent.click(submitButton);
        const emailInput = screen.getByLabelText(/email/i);
        const passwordInput = screen.getByLabelText(/password/i);
        
        expect(emailInput).toBeInvalid();
        expect(passwordInput).toBeInvalid();
      });
    });
  });

  describe('API Integration', () => {
    test('successful login redirects to discover page', async () => {
      const mockResponse = {
        status: 200,
        data: {
          user: {
            id: '123',
            name: 'Test User',
            email: 'test@example.com'
          },
          token: 'mock-token'
        }
      };
      
      axios.post.mockResolvedValueOnce(mockResponse);
      
      renderWithProviders(<Login />);
      
      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const submitButton = screen.getByRole('button', { name: /^non-vu log in$/i });

      await waitFor(() => {
        fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
        fireEvent.change(passwordInput, { target: { value: 'password123' } });
      });

      await waitFor(() => {
        fireEvent.click(submitButton);
      });
      
      await waitFor(() => {
        expect(axios.post).toHaveBeenCalledWith(
          `${API_BASE_URL}/users/login`,
          {
            email: 'test@example.com',
            password: 'password123'
          }
        );
        expect(mockNavigate).toHaveBeenCalledWith('/discover');
      });
    });

    test('displays error message on failed login', async () => {
      axios.post.mockRejectedValueOnce(new Error('Invalid credentials'));
      
      renderWithProviders(<Login />);
      
      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const submitButton = screen.getByRole('button', { name: /^non-vu log in$/i });

      await waitFor(() => {
        fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
        fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });
      });

      await waitFor(() => {
        fireEvent.click(submitButton);
      });
      
      await waitFor(() => {
        expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
      });
    });

    test('clears error message when component mounts', async () => {
      const preloadedState = {
        auth: {
          error: 'Previous error message'
        }
      };
      
      renderWithProviders(<Login />, { preloadedState });
      
      await waitFor(() => {
        expect(screen.queryByText(/previous error message/i)).not.toBeInTheDocument();
      });
    });
  });

  describe('Navigation', () => {
    test('signup link navigates to signup page', async () => {
      renderWithProviders(<Login />);
      const signupLink = screen.getByText(/sign up/i);
      
      await waitFor(() => {
        expect(signupLink).toHaveAttribute('href', '/signup');
      });
    });
  });
});