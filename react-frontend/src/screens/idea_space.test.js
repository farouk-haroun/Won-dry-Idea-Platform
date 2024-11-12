import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import IdeaSpace from './idea_space';

// Mock animations for Headless UI
Element.prototype.getAnimations = function() { return []; };

// Mock the router hooks
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
  useParams: () => ({ topic: 'sustainability' }),
}));

// Mock components that might not be needed for these tests
jest.mock('../components/ProfilePopup', () => {
  return function MockProfilePopup({ onClose, onLogout }) {
    return (
      <div data-testid="profile-popup">
        <button onClick={onClose}>Close</button>
        <button onClick={onLogout}>Logout</button>
      </div>
    );
  };
});

jest.mock('../components/ChallengeCard', () => {
  return function MockChallengeCard({ challenge }) {
    return <div data-testid="challenge-card">{challenge._id}</div>;
  };
});

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Suppress React Router and Headless UI warnings
const originalConsoleWarn = console.warn;
const originalConsoleError = console.error;

beforeAll(() => {
  console.warn = (...args) => {
    if (
      typeof args[0] === 'string' && 
      (args[0].includes('React Router Future Flag Warning') ||
       args[0].includes('Headless UI') ||
       args[0].includes('inside a test was not wrapped in act'))
    ) {
      return;
    }
    originalConsoleWarn.apply(console, args);
  };

  console.error = (...args) => {
    if (
      typeof args[0] === 'string' && 
      args[0].includes('inside a test was not wrapped in act')
    ) {
      return;
    }
    originalConsoleError.apply(console, args);
  };
});

afterAll(() => {
  console.warn = originalConsoleWarn;
  console.error = originalConsoleError;
});

const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

// Helper function to wait for animations
const waitForAnimations = () => act(async () => {
  await new Promise(resolve => setTimeout(resolve, 0));
});

describe('IdeaSpace Component', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  describe('Header and Navigation', () => {
    test('renders header with logo and navigation links', () => {
      renderWithRouter(<IdeaSpace />);
      
      expect(screen.getByAltText('Wondry Logo')).toBeInTheDocument();
      expect(screen.getByText('Home')).toBeInTheDocument();
      expect(screen.getByText('Discover')).toBeInTheDocument();
    });

    test('toggles profile popup when clicking profile avatar', async () => {
      renderWithRouter(<IdeaSpace />);
      
      const profileButton = screen.getByText('MM');
      await act(async () => {
        fireEvent.click(profileButton);
        await waitForAnimations();
      });
      
      expect(screen.getByTestId('profile-popup')).toBeInTheDocument();
      
      const closeButton = screen.getByText('Close');
      await act(async () => {
        fireEvent.click(closeButton);
        await waitForAnimations();
      });
      
      await waitFor(() => {
        expect(screen.queryByTestId('profile-popup')).not.toBeInTheDocument();
      });
    });
  });

  describe('Tab Navigation', () => {
    test('switches between Overview and Activity tabs', async () => {
      renderWithRouter(<IdeaSpace />);
      
      const overviewTab = screen.getByText('Overview');
      const activityTab = screen.getByText('Activity');
      
      expect(overviewTab.className).toContain('text-[#874c9e]');
      
      await act(async () => {
        fireEvent.click(activityTab);
        await waitForAnimations();
      });
      
      expect(activityTab.className).toContain('text-[#874c9e]');
      expect(overviewTab.className).not.toContain('text-[#874c9e]');
    });
  });

  describe('Overview Content', () => {
    test('renders welcome section with correct content', () => {
      renderWithRouter(<IdeaSpace />);
      
      expect(screen.getByText('Welcome to the Commodore Cup 2023!')).toBeInTheDocument();
      expect(screen.getByText('Transportation')).toBeInTheDocument();
      expect(screen.getByText('Sustainability Dashboard')).toBeInTheDocument();
    });

    test('renders featured challenge section', () => {
      renderWithRouter(<IdeaSpace />);
      
      expect(screen.getByText('Featured Challenge')).toBeInTheDocument();
      expect(screen.getByText('Idea Innovation Challenge')).toBeInTheDocument();
    });

    test('renders announcements section', () => {
      renderWithRouter(<IdeaSpace />);
      
      expect(screen.getByText('Announcements')).toBeInTheDocument();
      expect(screen.getByText('Idea Innovation Challenge Winner')).toBeInTheDocument();
    });
  });

  describe('Activity Content', () => {
    beforeEach(async () => {
      renderWithRouter(<IdeaSpace />);
      await act(async () => {
        fireEvent.click(screen.getByText('Activity'));
        await waitForAnimations();
      });
    });

    test('toggles between Challenges and Ideas views', async () => {
      const challengesButton = screen.getByRole('button', { name: 'Challenges' });
      const ideasButton = screen.getByRole('button', { name: 'Ideas' });
      
      expect(challengesButton.className).toContain('bg-gray-800');
      expect(ideasButton.className).not.toContain('bg-gray-800');
      
      await act(async () => {
        fireEvent.click(ideasButton);
        await waitForAnimations();
      });
      
      expect(ideasButton.className).toContain('bg-gray-800');
      expect(challengesButton.className).not.toContain('bg-gray-800');
    });

    test('opens and closes filter dialog', async () => {
      const filterButton = screen.getByRole('button', { name: /filter/i });
      await act(async () => {
        fireEvent.click(filterButton);
        await waitForAnimations();
      });
      
      // Dialog should be visible
      const dialog = await screen.findByRole('dialog');
      expect(dialog).toBeInTheDocument();
      
      // Close dialog using the search button
      const searchButton = screen.getByRole('button', { name: /search/i });
      await act(async () => {
        fireEvent.click(searchButton);
        await waitForAnimations();
      });
      
      // Dialog should be closed
      await waitFor(() => {
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      });
    });

    test('handles filter changes correctly', async () => {
      const filterButton = screen.getByRole('button', { name: /filter/i });
      await act(async () => {
        fireEvent.click(filterButton);
        await waitForAnimations();
      });
      
      // Test checkbox filters
      const myContentCheckbox = screen.getByLabelText('My Content');
      await act(async () => {
        fireEvent.click(myContentCheckbox);
        await waitForAnimations();
      });
      expect(myContentCheckbox).toBeChecked();
      
      // Test date filters
      const dateFromInput = screen.getByDisplayValue('2024-08-25');
      await act(async () => {
        fireEvent.change(dateFromInput, { target: { value: '2024-09-01' } });
        await waitForAnimations();
      });
      expect(dateFromInput.value).toBe('2024-09-01');
      
      // Test keyword addition
      const keywordInput = screen.getByPlaceholderText('Add keyword');
      await act(async () => {
        fireEvent.keyPress(keywordInput, {
          key: 'Enter',
          code: 'Enter',
          charCode: 13,
          target: { value: 'TEST_KEYWORD' }
        });
        await waitForAnimations();
      });
      
      expect(keywordInput.value).toBe('');
    });
  });

  describe('Search Functionality', () => {
    test('renders search input in activity view', async () => {
      renderWithRouter(<IdeaSpace />);
      await act(async () => {
        fireEvent.click(screen.getByText('Activity'));
        await waitForAnimations();
      });
      
      expect(screen.getByPlaceholderText('Looking for Something?')).toBeInTheDocument();
    });

    test('renders sort dropdown with correct options', async () => {
      renderWithRouter(<IdeaSpace />);
      await act(async () => {
        fireEvent.click(screen.getByText('Activity'));
        await waitForAnimations();
      });
      
      const sortSelect = screen.getByRole('combobox');
      expect(sortSelect).toBeInTheDocument();
      expect(screen.getByText('Relevance')).toBeInTheDocument();
    });
  });

  describe('Responsive Design', () => {
    test('shows menu icon on mobile view', () => {
      renderWithRouter(<IdeaSpace />);
      const menuIcon = document.querySelector('.text-gray-500.md\\:hidden');
      expect(menuIcon).toBeInTheDocument();
    });
  });
});