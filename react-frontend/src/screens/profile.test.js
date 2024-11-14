import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import Profile from './profile';
import axios from 'axios';
import { API_BASE_URL } from '../utils/constants';

// Mock axios
jest.mock('axios');

// Mock the ProfilePopup component
jest.mock('../components/ProfilePopup', () => {
  return function MockProfilePopup({ onClose, onLogout }) {
    return (
      <div data-testid="profile-popup">
        <button onClick={onClose}>Close</button>
        <button onClick={onLogout}>Sign Out</button>
      </div>
    );
  };
});

// Mock the ChallengeCard component
jest.mock('../components/ChallengeCard', () => {
  return function MockChallengeCard({ challenge }) {
    return (
      <div data-testid="challenge-card">
        <h3>{challenge.title}</h3>
        <p>{challenge.description}</p>
      </div>
    );
  };
});

// Mock the ProfileSettingsPopup component
jest.mock('../components/ProfileSettingsPopup', () => {
  return function MockProfileSettingsPopup({ isOpen, onClose, userProfile, onUpdateProfile }) {
    if (!isOpen) return null;
    return (
      <div role="dialog" data-testid="profile-settings-popup">
        <button onClick={onClose}>Close</button>
        <button onClick={() => onUpdateProfile({ name: 'Updated Name' })}>Save</button>
      </div>
    );
  };
});

const mockNavigate = jest.fn();

// Mock router
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

// Suppress console warnings and errors
const originalWarn = console.warn;
const originalError = console.error;
const originalLog = console.log;

beforeAll(() => {
  console.warn = (...args) => {
    if (typeof args[0] === 'string' && 
        (args[0].includes('React Router Future Flag Warning') ||
         args[0].includes('babel-preset-react-app'))) {
      return;
    }
    originalWarn.apply(console, args);
  };

  console.error = (...args) => {
    if (typeof args[0] === 'string' && 
        (args[0].includes('Warning: An update to') ||
         args[0].includes('Error logging out'))) {
      return;
    }
    originalError.apply(console, args);
  };

  console.log = jest.fn();
});

afterAll(() => {
  console.warn = originalWarn;
  console.error = originalError;
  console.log = originalLog;
});

const mockChallenges = [
  {
    _id: '1',
    title: 'Test Challenge 1',
    description: 'Description 1',
    status: 'ACTIVE',
    stages: [],
    thumbnailUrl: 'test-url-1'
  },
  {
    _id: '2',
    title: 'Test Challenge 2',
    description: 'Description 2',
    status: 'COMPLETED',
    stages: [],
    thumbnailUrl: 'test-url-2'
  }
];

const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('Profile Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    axios.get.mockResolvedValue({ data: mockChallenges });
  });

  describe('Layout and Header', () => {
    test('renders header with logo and navigation', () => {
      renderWithRouter(<Profile />);
      expect(screen.getByAltText('Wondry Logo')).toBeInTheDocument();
      expect(screen.getByText('Home')).toBeInTheDocument();
      expect(screen.getByText('Discover')).toBeInTheDocument();
    });

    test('renders profile avatar with correct initials', () => {
      renderWithRouter(<Profile />);
      expect(screen.getByTestId('profile-avatar')).toHaveTextContent('MM');
    });

    test('renders navigation links with correct hrefs', () => {
      renderWithRouter(<Profile />);
      const homeLink = screen.getByRole('link', { name: /home/i });
      const discoverLink = screen.getByRole('link', { name: /discover/i });
      expect(homeLink).toHaveAttribute('href', '/');
      expect(discoverLink).toHaveAttribute('href', '/discover');
    });
  });

  describe('Profile Information', () => {
    test('displays user profile information correctly', () => {
      renderWithRouter(<Profile />);
      expect(screen.getByText('Mothuso Malunga')).toBeInTheDocument();
      expect(screen.getByText('Computer Science')).toBeInTheDocument();
    });

    test('renders profile edit and settings buttons', () => {
      renderWithRouter(<Profile />);
      expect(screen.getByText('Edit Profile')).toBeInTheDocument();
      expect(screen.getByText('Settings')).toBeInTheDocument();
    });

    test('opens profile settings popup on edit button click', async () => {
      renderWithRouter(<Profile />);
      const editButton = screen.getByText('Edit Profile');
      await act(async () => {
        fireEvent.click(editButton);
      });
      expect(screen.getByTestId('profile-settings-popup')).toBeInTheDocument();
    });
  });

  describe('Content Tabs', () => {
    test('renders all tab buttons', () => {
      renderWithRouter(<Profile />);
      expect(screen.getByText('My Challenges')).toBeInTheDocument();
      expect(screen.getByText('My Ideas')).toBeInTheDocument();
      expect(screen.getByText('Drafts')).toBeInTheDocument();
      expect(screen.getByText('Favorites')).toBeInTheDocument();
    });
  });

  describe('Search and Filter', () => {
    test('renders search input and filter controls', () => {
      renderWithRouter(<Profile />);
      expect(screen.getByPlaceholderText('Search your content...')).toBeInTheDocument();
      expect(screen.getByTestId('sort-select')).toBeInTheDocument();
    });

    test('sort select has correct options', () => {
      renderWithRouter(<Profile />);
      expect(screen.getByText('Sort by: Recent')).toBeInTheDocument();
    });
  });

  describe('Challenges Display', () => {
    test('displays no challenges message when API returns empty array', async () => {
      axios.get.mockResolvedValueOnce({ data: [] });
      renderWithRouter(<Profile />);
      await waitFor(() => {
        expect(screen.getByTestId('no-challenges-message')).toBeInTheDocument();
      });
    });

    test('handles API error gracefully', async () => {
      axios.get.mockRejectedValueOnce(new Error('API Error'));
      renderWithRouter(<Profile />);
      await waitFor(() => {
        expect(screen.getByTestId('no-challenges-message')).toBeInTheDocument();
      });
    });
  });

  describe('Footer', () => {
    test('renders footer with copyright', () => {
      renderWithRouter(<Profile />);
      expect(screen.getByText(/Wondry © 2024/)).toBeInTheDocument();
    });
  });

  describe('Responsive Design', () => {
    test('menu icon is only visible on mobile', () => {
      renderWithRouter(<Profile />);
      const menuIcon = document.querySelector('.md\\:hidden');
      expect(menuIcon).toBeInTheDocument();
    });
  });
});