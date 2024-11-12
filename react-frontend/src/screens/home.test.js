import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { createMemoryRouter, RouterProvider, createRoutesFromElements, Route } from 'react-router-dom';
import Home from './home';
import '@testing-library/jest-dom';

// Mock navigate function
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

// Mock IdeaSpaceCard component
jest.mock('../components/IdeaSpaceCard', () => {
  return function MockIdeaSpaceCard({ topic }) {
    return <div data-testid={`idea-space-${topic}`}>{topic}</div>;
  };
});

// Mock ProfilePopup component
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

// Suppress Router Warnings
beforeAll(() => {
  const originalWarn = console.warn;
  console.warn = (...args) => {
    if (args[0]?.includes?.('React Router')) return;
    originalWarn(...args);
  };
});

afterAll(() => {
  jest.restoreAllMocks();
});

// Helper function to render with router
const renderWithRouter = (component, { route = '/' } = {}) => {
  const router = createMemoryRouter(
    createRoutesFromElements(
      <Route path="/" element={component} />
    ),
    { initialEntries: [route] }
  );

  return render(<RouterProvider router={router} />);
};

describe('Home Component', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  // Header Tests
  describe('Header', () => {
    test('renders logo and navigation links', () => {
      renderWithRouter(<Home />);
      expect(screen.getByAltText('Wondry Logo')).toBeInTheDocument();
      expect(screen.getByText('Home')).toBeInTheDocument();
      expect(screen.getByText('Discover')).toBeInTheDocument();
    });

    test('navigation links have correct styles', () => {
      renderWithRouter(<Home />);
      const homeLink = screen.getByText('Home');
      const discoverLink = screen.getByText('Discover');
      expect(homeLink).toHaveClass('text-[#874c9e]');
      expect(discoverLink).toHaveClass('text-[#2c2c2c]');
    });

    test('profile popup toggles on click', () => {
      renderWithRouter(<Home />);
      const profileButton = screen.getByText('MM');
      fireEvent.click(profileButton);
      expect(screen.getByTestId('profile-popup')).toBeInTheDocument();
      const closeButton = screen.getByText('Close');
      fireEvent.click(closeButton);
      expect(screen.queryByTestId('profile-popup')).not.toBeInTheDocument();
    });

    test('logout functionality', () => {
      renderWithRouter(<Home />);
      const profileButton = screen.getByText('MM');
      fireEvent.click(profileButton);
      const signOutButton = screen.getByText('Sign Out');
      fireEvent.click(signOutButton);
      expect(mockNavigate).toHaveBeenCalledWith('/login');
    });
  });

  // Welcome Section Tests
  describe('Welcome Section', () => {
    test('renders welcome content', () => {
      renderWithRouter(<Home />);
      expect(screen.getByText("Welcome to the Wond'ry Idea Platform")).toBeInTheDocument();
      expect(screen.getByText(/Explore groundbreaking ideas/)).toBeInTheDocument();
    });

    test('welcome section has correct background color', () => {
      renderWithRouter(<Home />);
      const welcomeSection = screen.getByText("Welcome to the Wond'ry Idea Platform").closest('section');
      expect(welcomeSection).toHaveClass('bg-[#2c2c2c]');
    });
  });

  // Challenges Section Tests
  describe('Challenges Section', () => {
    test('renders challenge card', () => {
      renderWithRouter(<Home />);
      expect(screen.getByText('Jump into some Challenges!')).toBeInTheDocument();
      expect(screen.getByText('Idea Innovation Challenge')).toBeInTheDocument();
    });

    test('shows challenge stage', () => {
      renderWithRouter(<Home />);
      expect(screen.getByText('Winners Announcement')).toBeInTheDocument();
      expect(screen.getByText('Winners Announcement')).toHaveClass('bg-[#b49248]');
    });
  });

  // Groups Section Tests
  describe('Groups Section', () => {
    test('renders all idea space cards', () => {
      renderWithRouter(<Home />);
      expect(screen.getByTestId('idea-space-quantum-computing')).toBeInTheDocument();
      expect(screen.getByTestId('idea-space-sustainable-energy')).toBeInTheDocument();
      expect(screen.getByTestId('idea-space-biotech')).toBeInTheDocument();
      expect(screen.getByTestId('idea-space-space-exploration')).toBeInTheDocument();
    });

    test('displays section title', () => {
      renderWithRouter(<Home />);
      expect(screen.getByText('Discover new groups and join in on exciting challenges!')).toBeInTheDocument();
    });
  });

  // Announcements Section Tests
  describe('Announcements Section', () => {
    test('renders announcement content', () => {
      renderWithRouter(<Home />);
      expect(screen.getByText('Announcements')).toBeInTheDocument();
      expect(screen.getByText('Idea Innovation Challenge Winner')).toBeInTheDocument();
    });

    test('displays winner card details', () => {
      renderWithRouter(<Home />);
      expect(screen.getByText('Interactive Dashboards')).toBeInTheDocument();
      expect(screen.getByText('Mothuso Malunga')).toBeInTheDocument();
      expect(screen.getByText('in Commodore Cup 2023 Challenge')).toBeInTheDocument();
    });

    test('shows winner metrics', () => {
      renderWithRouter(<Home />);
      const metrics = screen.getAllByText('34');
      const views = screen.getAllByText('23,696');
      expect(metrics.length).toBeGreaterThan(0);
      expect(views.length).toBeGreaterThan(0);
    });
  });

  // Footer Tests
  describe('Footer', () => {
    test('renders footer content', () => {
      renderWithRouter(<Home />);
      expect(screen.getByText('Wondry © 2024')).toBeInTheDocument();
    });

    test('footer has correct styling', () => {
      renderWithRouter(<Home />);
      const footer = screen.getByText('Wondry © 2024').closest('footer');
      expect(footer).toHaveClass('bg-white');
    });
  });

  // Responsive Tests
  describe('Responsive Behavior', () => {
    test('navigation is hidden on mobile', () => {
      renderWithRouter(<Home />);
      const nav = screen.getByRole('navigation');
      expect(nav).toHaveClass('hidden', 'md:flex');
    });

    test('menu icon is visible on mobile', () => {
      renderWithRouter(<Home />);
      const menuButton = screen.getByLabelText('Menu');
      expect(menuButton).toHaveClass('md:hidden');
    });
  });
});
