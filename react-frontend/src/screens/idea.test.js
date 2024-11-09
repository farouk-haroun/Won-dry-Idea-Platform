import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import Idea from './idea';
import ProfilePopup from '../components/ProfilePopup';

// Mock the ProfilePopup component
jest.mock('../components/ProfilePopup', () => jest.fn(() => <div data-testid="profile-popup">Profile Popup</div>));

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
    expect(screen.getByRole('button', { name: 'MM' })).toBeInTheDocument();
    expect(screen.getByText('Wondry © 2024')).toBeInTheDocument();
  });

  test('navigates to login page on logout', () => {
    const navigateMock = jest.fn();
    jest.spyOn(require('react-router-dom'), 'useNavigate').mockImplementation(() => navigateMock);

    render(
      <Router>
        <Idea />
      </Router>
    );

    const profileButton = screen.getByRole('button', { name: 'MM' });
    fireEvent.click(profileButton);

    const logoutButton = screen.getByText('Profile Popup');
    fireEvent.click(logoutButton);

    expect(navigateMock).toHaveBeenCalledWith('/login');
  });

  test('opens and closes ProfilePopup when the profile icon is clicked', () => {
    render(
      <Router>
        <Idea />
      </Router>
    );

    const profileButton = screen.getByRole('button', { name: 'MM' });
    
    // Open Profile Popup
    fireEvent.click(profileButton);
    expect(screen.getByTestId('profile-popup')).toBeInTheDocument();

    // Close Profile Popup
    fireEvent.click(profileButton);
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