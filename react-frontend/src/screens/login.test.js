import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Login from './login';

describe('Login Component', () => {

  // Test if the component renders without crashing
  it('renders login form correctly', () => {
    render(<Login />);
    
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
    render(<Login />);
    const emailInput = screen.getByPlaceholderText(/Email/i);
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    expect(emailInput.value).toBe('test@example.com');
  });

  // Test if typing in password input works
  it('allows typing in the password input', () => {
    render(<Login />);
    const passwordInput = screen.getByPlaceholderText(/Password/i);
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    expect(passwordInput.value).toBe('password123');
  });

  // Test if form submission works and logs the email and password
  it('submits the form and logs the email and password', () => {
    console.log = jest.fn(); // Mock console.log

    render(<Login />);
    const emailInput = screen.getByPlaceholderText(/Email/i);
    const passwordInput = screen.getByPlaceholderText(/Password/i);
    const loginButton = screen.getByRole('button', { name: /Non-VU Log In/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(loginButton);

    expect(console.log).toHaveBeenCalledWith('Login attempt with:', { email: 'test@example.com', password: 'password123' });
  });

  // Test if the 'Forgot password?' link is rendered
  it('renders forgot password link', () => {
    render(<Login />);
    expect(screen.getByText(/Forgot password?/i)).toBeInTheDocument();
  });

  // Test if the 'Sign Up' link is rendered
  it('renders sign up link', () => {
    render(<Login />);
    expect(screen.getByText(/Sign Up/i)).toBeInTheDocument();
  });
});
