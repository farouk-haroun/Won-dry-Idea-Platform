import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import store from '../store';
import Login from './login';
import { MemoryRouter } from 'react-router-dom';

describe('Login Component', () => {
  // Helper function to render the component with Redux provider and Router
  function renderWithProvider(ui) {
    return render(
      <Provider store={store}>
        <MemoryRouter>{ui}</MemoryRouter>
      </Provider>
    );
  }

  // Test if the component renders without crashing
  it('renders login form correctly', () => {
    renderWithProvider(<Login />);
    
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();

    // Check if the login buttons are rendered
    const buttons = screen.getAllByRole('button');
    
    // Check the content of the buttons to distinguish between them
    const nonVUButton = buttons.find(button => button.textContent === 'Non-VU Log In');
    const vuButton = buttons.find(button => button.textContent.includes('VU Log In'));

    // Assert that both buttons are rendered
    expect(nonVUButton).toBeInTheDocument();
    expect(vuButton).toBeInTheDocument();
  });

  // Test if typing in email input works
  it('allows typing in the email input', () => {
    renderWithProvider(<Login />);
    const emailInput = screen.getByPlaceholderText(/Email/i);
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    expect(emailInput.value).toBe('test@example.com');
  });

  // Test if typing in password input works
  it('allows typing in the password input', () => {
    renderWithProvider(<Login />);
    const passwordInput = screen.getByPlaceholderText(/Password/i);
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    expect(passwordInput.value).toBe('password123');
  });

  // Test if form submission works and logs the email and password
  it('submits the form and logs the email and password', () => {
    // Spy on console.log
    jest.spyOn(console, 'log').mockImplementation(() => {});

    renderWithProvider(<Login />);
    const emailInput = screen.getByPlaceholderText(/Email/i);
    const passwordInput = screen.getByPlaceholderText(/Password/i);
    const loginButton = screen.getByRole('button', { name: /Non-VU Log In/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(loginButton);

    expect(console.log).toHaveBeenCalledWith('Login attempt with:', {
      email: 'test@example.com',
      password: 'password123',
    });

    // Restore console.log after the test
    console.log.mockRestore();
  });

  // Test if the 'Forgot password?' link is rendered
  it('renders forgot password link', () => {
    renderWithProvider(<Login />);
    expect(screen.getByText(/Forgot password\?/i)).toBeInTheDocument();
  });

  // Test if the 'Sign Up' link is rendered
  it('renders sign up link', () => {
    renderWithProvider(<Login />);
    expect(screen.getByText(/Sign Up/i)).toBeInTheDocument();
  });
});
