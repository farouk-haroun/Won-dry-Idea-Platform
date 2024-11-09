import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import {
  BrowserRouter as Router,
  useNavigate,
} from 'react-router-dom';
import Idea from './idea';

// Mock the ProfilePopup component
jest.mock('../components/ProfilePopup', () => ({ onClose, onLogout }) => (
  <div data-testid="profile-popup">
    <button onClick={onLogout}>Logout</button>
    <button onClick={onClose}>Close</button>
  </div>
));

// Mock useNavigate
jest.mock('react-router-dom', () => {
  const originalModule = jest.requireActual('react-router-dom');

  return {
    __esModule: true,
    ...originalModule,
    useNavigate: jest.fn(),
  };
});

beforeAll(() => {
  jest.spyOn(console, 'warn').mockImplementation((message) => {
    if (!message.includes('React Router Future Flag Warning')) {
      console.warn(message);
    }
  });
});

afterAll(() => {
  console.warn.mockRestore();
});

describe('Idea Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders the component with correct elements', () => {
    render(
      <Router>
        <Idea />
      </Router>
    );

    expect(screen.getByAltText('Wondry Logo')).toBeInTheDocument();
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Discover')).toBeInTheDocument();
    expect(screen.getByText('Analytics')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Profile' })).toBeInTheDocument();
    expect(screen.getByText('Wondry © 2024')).toBeInTheDocument();
  });

  test('navigates to login page on logout', () => {
    const navigateMock = jest.fn();
    useNavigate.mockReturnValue(navigateMock);

    render(
      <Router>
        <Idea />
      </Router>
    );

    const profileButton = screen.getByRole('button', { name: 'Profile' });
    fireEvent.click(profileButton);

    const logoutButton = screen.getByText('Logout');
    fireEvent.click(logoutButton);

    expect(navigateMock).toHaveBeenCalledWith('/login');
  });

  test('opens and closes ProfilePopup when the profile icon is clicked', () => {
    render(
      <Router>
        <Idea />
      </Router>
    );

    const profileButton = screen.getByRole('button', { name: 'Profile' });

    // Open Profile Popup
    fireEvent.click(profileButton);
    expect(screen.getByTestId('profile-popup')).toBeInTheDocument();

    // Close Profile Popup
    fireEvent.click(screen.getByText('Close'));
    expect(screen.queryByTestId('profile-popup')).not.toBeInTheDocument();
  });

  test('renders the iframe with correct source', () => {
    render(
      <Router>
        <Idea />
      </Router>
    );

    const iframe = screen.getByTitle('Embedded Miro Board');
    expect(iframe).toBeInTheDocument();
    expect(iframe).toHaveAttribute(
      'src',
      'https://miro.com/app/live-embed/uXjVLagsR90=/?moveToViewport=-1784,-1392,7151,3705&embedId=140779962039'
    );
  });
});
