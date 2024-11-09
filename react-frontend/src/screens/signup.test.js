// src/screens/signup.test.js

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import Signup from './signup';
import axios from 'axios';

// Mock axios to avoid making real API requests
jest.mock('axios');

const mockStore = configureStore([]);

describe('Signup Component', () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      auth: { user: null },
    });
  });

  // Test if the signup form renders correctly
  it('renders the signup form correctly', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <Signup />
        </MemoryRouter>
      </Provider>
    );

    // Check for form input fields
    expect(screen.getByLabelText(/First Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Last Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^Password$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^Confirm Password$/i)).toBeInTheDocument();

    // Check for the submit button
    expect(screen.getByRole('button', { name: /Sign Up/i })).toBeInTheDocument();
  });

  // Test if the form validates matching passwords
  it('shows an alert if passwords do not match', () => {
    window.alert = jest.fn(); // Mock alert function

    render(
      <Provider store={store}>
        <MemoryRouter>
          <Signup />
        </MemoryRouter>
      </Provider>
    );

    // Fill out form fields with non-matching passwords
    fireEvent.change(screen.getByLabelText(/First Name/i), { target: { value: 'John' } });
    fireEvent.change(screen.getByLabelText(/Last Name/i), { target: { value: 'Doe' } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByLabelText(/^Password$/i), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText(/^Confirm Password$/i), {
      target: { value: 'password321' },
    });

    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /Sign Up/i }));

    // Check that the alert is shown for mismatching passwords
    expect(window.alert).toHaveBeenCalledWith("Passwords don't match");
  });

  // Test if the form validates the minimum password length
  it('shows an alert if the password is less than 8 characters', () => {
    window.alert = jest.fn(); // Mock alert function

    render(
      <Provider store={store}>
        <MemoryRouter>
          <Signup />
        </MemoryRouter>
      </Provider>
    );

    // Fill out form fields with a short password
    fireEvent.change(screen.getByLabelText(/First Name/i), { target: { value: 'John' } });
    fireEvent.change(screen.getByLabelText(/Last Name/i), { target: { value: 'Doe' } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByLabelText(/^Password$/i), { target: { value: 'short' } });
    fireEvent.change(screen.getByLabelText(/^Confirm Password$/i), { target: { value: 'short' } });

    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /Sign Up/i }));

    // Check that the alert is shown for short passwords
    expect(window.alert).toHaveBeenCalledWith('Password must be at least 8 characters long');
  });

  // Test if the form validates the email format
  it('shows an alert if an invalid email is entered', () => {
    window.alert = jest.fn(); // Mock alert function

    render(
      <Provider store={store}>
        <MemoryRouter>
          <Signup />
        </MemoryRouter>
      </Provider>
    );

    // Fill out form fields with an invalid email
    fireEvent.change(screen.getByLabelText(/First Name/i), { target: { value: 'John' } });
    fireEvent.change(screen.getByLabelText(/Last Name/i), { target: { value: 'Doe' } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'invalidemail' } });
    fireEvent.change(screen.getByLabelText(/^Password$/i), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText(/^Confirm Password$/i), {
      target: { value: 'password123' },
    });

    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /Sign Up/i }));

    // Check that the alert is shown for invalid email
    expect(window.alert).toHaveBeenCalledWith('Please enter a valid email address');
  });

  // Test if the password visibility toggle works
  it('toggles password visibility when the eye icon is clicked', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <Signup />
        </MemoryRouter>
      </Provider>
    );

    const passwordInput = screen.getByLabelText(/^Password$/i);

    // Password field should be hidden initially
    expect(passwordInput.type).toBe('password');

    // Click the toggle button
    const toggleButton = screen.getByLabelText(/Show password/i);
    fireEvent.click(toggleButton);

    // Password field should be visible
    expect(passwordInput.type).toBe('text');
  });

  // Test successful signup
  it('signs up a new user and redirects to the discover page', async () => {
    // Mock the API response for successful signup
    axios.post.mockResolvedValue({
      data: {
        user: { id: 1, name: 'John Doe', email: 'john@example.com' },
      },
    });

    // Mock the navigate function
    const navigate = jest.fn();
    jest.spyOn(require('react-router-dom'), 'useNavigate').mockReturnValue(navigate);

    render(
      <Provider store={store}>
        <MemoryRouter>
          <Signup />
        </MemoryRouter>
      </Provider>
    );

    // Fill out form fields
    fireEvent.change(screen.getByLabelText(/First Name/i), { target: { value: 'John' } });
    fireEvent.change(screen.getByLabelText(/Last Name/i), { target: { value: 'Doe' } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByLabelText(/^Password$/i), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText(/^Confirm Password$/i), {
      target: { value: 'password123' },
    });

    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /Sign Up/i }));

    // Check that the axios post request is called with correct arguments
    expect(axios.post).toHaveBeenCalledWith(`${API_BASE_URL}/users/register`, {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
    });

    // Check that navigate is called to redirect the user
    expect(navigate).toHaveBeenCalledWith('/discover');
  });
});
