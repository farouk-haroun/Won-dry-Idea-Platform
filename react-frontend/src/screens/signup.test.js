import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import axios from 'axios';
import Signup from './signup';

// Mock dependencies
jest.mock('axios');
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn()
}));

// Mock Redux store
const mockStore = configureStore({
  reducer: {
    auth: (state = { user: null, token: null }, action) => {
      if (action.type === 'auth/login') {
        return {
          user: action.payload.user,
          token: action.payload.token
        };
      }
      return state;
    }
  }
});

const renderSignup = () => {
  render(
    <Provider store={mockStore}>
      <BrowserRouter>
        <Signup />
      </BrowserRouter>
    </Provider>
  );
};

describe('Signup Component', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  test('renders signup form with all fields', () => {
    renderSignup();
    
    expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/last name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign up/i })).toBeInTheDocument();
  });

  test('validates matching passwords', async () => {
    renderSignup();
    
    const passwordInput = screen.getByLabelText(/^password/i);
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
    const submitButton = screen.getByRole('button', { name: /sign up/i });

    // Fill in valid password length
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'password456' } });
    
    // Add required fields to pass initial validations
    fireEvent.change(screen.getByLabelText(/first name/i), { target: { value: 'John' } });
    fireEvent.change(screen.getByLabelText(/last name/i), { target: { value: 'Doe' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'john@example.com' } });
    
    window.alert = jest.fn();
    
    fireEvent.click(submitButton);
    
    expect(window.alert).toHaveBeenCalledWith("Passwords don't match");
  });

  test('validates password length', async () => {
    renderSignup();
    
    const passwordInput = screen.getByLabelText(/^password/i);
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
    const submitButton = screen.getByRole('button', { name: /sign up/i });

    // Add required fields first
    fireEvent.change(screen.getByLabelText(/first name/i), { target: { value: 'John' } });
    fireEvent.change(screen.getByLabelText(/last name/i), { target: { value: 'Doe' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'john@example.com' } });

    // Add short password
    fireEvent.change(passwordInput, { target: { value: 'short' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'short' } });
    
    window.alert = jest.fn();
    
    fireEvent.click(submitButton);
    
    expect(window.alert).toHaveBeenCalledWith('Password must be at least 8 characters long');
  });

  test('validates email format', async () => {
    renderSignup();
    
    const emailInput = screen.getByLabelText(/email/i);
    const submitButton = screen.getByRole('button', { name: /sign up/i });

    // Add required fields first
    fireEvent.change(screen.getByLabelText(/first name/i), { target: { value: 'John' } });
    fireEvent.change(screen.getByLabelText(/last name/i), { target: { value: 'Doe' } });
    
    // Add valid length password to pass that validation
    fireEvent.change(screen.getByLabelText(/^password/i), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText(/confirm password/i), { target: { value: 'password123' } });

    // Add invalid email
    fireEvent.change(emailInput, { target: { value: 'invalidemail' } });
    
    window.alert = jest.fn();
    
    fireEvent.click(submitButton);
    
    expect(window.alert).toHaveBeenCalledWith('Please enter a valid email address');
  });

  test('validates required fields', async () => {
    renderSignup();
    
    const submitButton = screen.getByRole('button', { name: /sign up/i });
    
    // Add valid length password to pass that validation
    fireEvent.change(screen.getByLabelText(/^password/i), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText(/confirm password/i), { target: { value: 'password123' } });
    
    // Add valid email to pass that validation
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
    
    window.alert = jest.fn();
    
    fireEvent.click(submitButton);
    
    expect(window.alert).toHaveBeenCalledWith('Please enter both first and last name');
  });

  test('toggles password visibility', () => {
    renderSignup();
    
    const passwordInput = screen.getByLabelText(/^password/i);
    const toggleButton = passwordInput.parentElement.querySelector('button');
    
    expect(passwordInput.type).toBe('password');
    
    fireEvent.click(toggleButton);
    expect(passwordInput.type).toBe('text');
    
    fireEvent.click(toggleButton);
    expect(passwordInput.type).toBe('password');
  });

  test('handles successful signup', async () => {
    const mockResponse = {
      data: {
        token: 'mock-token',
        user: { id: 1, name: 'John Doe', email: 'john@example.com' }
      }
    };
    
    axios.post.mockResolvedValueOnce(mockResponse);
    
    renderSignup();
    
    // Fill in the form
    fireEvent.change(screen.getByLabelText(/first name/i), { target: { value: 'John' } });
    fireEvent.change(screen.getByLabelText(/last name/i), { target: { value: 'Doe' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByLabelText(/^password/i), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText(/confirm password/i), { target: { value: 'password123' } });
    
    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));
    
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(expect.any(String), {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123'
      });
      expect(localStorage.getItem('token')).toBe('mock-token');
    });
  });

  test('handles signup error', async () => {
    const mockError = {
      response: {
        data: {
          error: 'Email already exists'
        }
      }
    };
    
    axios.post.mockRejectedValueOnce(mockError);
    window.alert = jest.fn();
    
    renderSignup();
    
    // Fill in the form
    fireEvent.change(screen.getByLabelText(/first name/i), { target: { value: 'John' } });
    fireEvent.change(screen.getByLabelText(/last name/i), { target: { value: 'Doe' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByLabelText(/^password/i), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText(/confirm password/i), { target: { value: 'password123' } });
    
    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));
    
    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith('Signup failed: Email already exists');
    });
  });
});