import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Home from './home';
import '@testing-library/jest-dom';

// Mock navigate function
const mockNavigate = jest.fn();

// Mock fetch responses
const mockIdeaSpaces = {
  ideaSpaces: [
    {
      _id: '1',
      title: 'Test Idea Space',
      description: 'Test description',
      members: 10,
      category: 'Technology'
    }
  ]
};

const mockChallenges = [
  {
    _id: '1',
    title: 'Test Challenge',
    description: 'Test challenge description',
    status: 'open',
    stars: 5,
    views: 100,
    comments: 10,
    thumbnailUrl: 'test-url.jpg'
  }
];

// Mock react-router-dom
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  Link: ({ children, to }) => <a href={to}>{children}</a>
}));

// Mock ProfilePopup
jest.mock('../components/ProfilePopup', () => {
  return function MockProfilePopup({ onClose, onLogout }) {
    return (
      <div data-testid="profile-popup">
        <button onClick={onLogout}>Sign Out</button>
        <button onClick={onClose}>Close</button>
      </div>
    );
  };
});

// Mock IdeaSpaceCard
jest.mock('../components/IdeaSpaceCard', () => {
  return function MockIdeaSpaceCard({ ideaSpace }) {
    return <div data-testid="idea-space-card">{ideaSpace.title}</div>;
  };
});

describe('Home Component', () => {
  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
    
    // Mock fetch
    global.fetch = jest.fn((url) => {
      if (url.includes('/ideaspaces')) {
        return Promise.resolve({
          json: () => Promise.resolve(mockIdeaSpaces)
        });
      }
      if (url.includes('/challenges')) {
        return Promise.resolve({
          json: () => Promise.resolve(mockChallenges)
        });
      }
    });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  test('renders header elements correctly', () => {
    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );

    expect(screen.getByAltText('Wondry Logo')).toBeInTheDocument();
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Discover')).toBeInTheDocument();
  });

  test('shows and hides profile popup', () => {
    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );

    // Profile popup should not be visible initially
    expect(screen.queryByTestId('profile-popup')).not.toBeInTheDocument();

    // Click profile button
    fireEvent.click(screen.getByText('MM'));
    expect(screen.getByTestId('profile-popup')).toBeInTheDocument();

    // Click close button
    fireEvent.click(screen.getByText('Close'));
    expect(screen.queryByTestId('profile-popup')).not.toBeInTheDocument();
  });

  test('handles logout correctly', () => {
    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );

    // Open profile popup and click logout
    fireEvent.click(screen.getByText('MM'));
    fireEvent.click(screen.getByText('Sign Out'));
    
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });

  test('displays loading state while fetching data', () => {
    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );

    expect(screen.getByText('Loading challenges...')).toBeInTheDocument();
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  test('displays challenges after loading', async () => {
    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Test Challenge')).toBeInTheDocument();
      expect(screen.getByText('Test challenge description')).toBeInTheDocument();
      expect(screen.getByText('open')).toBeInTheDocument();
    });
  });

  test('displays idea spaces after loading', async () => {
    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId('idea-space-card')).toBeInTheDocument();
      expect(screen.getByText('Test Idea Space')).toBeInTheDocument();
    });
  });

  test('displays error state when fetch fails', async () => {
    // Mock fetch to reject
    global.fetch = jest.fn().mockRejectedValue(new Error('Failed to fetch'));

    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('No challenges available')).toBeInTheDocument();
      expect(screen.getByText('No idea spaces found')).toBeInTheDocument();
    });
  });

  test('displays announcements section', () => {
    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );

    expect(screen.getByText('Announcements')).toBeInTheDocument();
    expect(screen.getByText('Idea Innovation Challenge Winner')).toBeInTheDocument();
    expect(screen.getByText('Interactive Dashboards')).toBeInTheDocument();
  });

  test('displays footer', () => {
    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );

    expect(screen.getByText('Wondry © 2024')).toBeInTheDocument();
  });
});