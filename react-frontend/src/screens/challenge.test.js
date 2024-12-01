import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';
import Challenge from '../screens/challenge';

// Mock modules
jest.mock('axios');
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
  useParams: () => ({ id: '123' })
}));

// Mock data
const mockChallenge = {
  title: 'Test Challenge',
  description: 'Test Description',
  format: 'Test Format',
  tracks: ['Track 1', 'Track 2'],
  stages: [
    {
      name: 'Stage 1',
      deadline: new Date(Date.now() + 86400000).toISOString(), // tomorrow
      submissions: [{ id: 1 }]
    },
    {
      name: 'Stage 2',
      deadline: new Date(Date.now() - 86400000).toISOString(), // yesterday
      submissions: []
    }
  ],
  community: {
    name: "Wond'ry Innovation Center",
    avatar: ''
  },
  metrics: {
    views: 100,
    totalIdeas: 50,
    activeUsers: 25
  }
};

// Wrapper component for routing
const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('Challenge Component', () => {
  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
    
    // Setup default axios responses
    axios.get.mockImplementation((url) => {
      if (url.includes('/challenges/123')) {
        return Promise.resolve({ data: mockChallenge });
      }
      return Promise.reject(new Error('not found'));
    });
  });

  describe('Rendering', () => {
    test('renders loading state initially', () => {
      renderWithRouter(<Challenge />);
      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    test('renders challenge data after loading', async () => {
      renderWithRouter(<Challenge />);
      
      await waitFor(() => {
        expect(screen.getByText('Test Challenge')).toBeInTheDocument();
        expect(screen.getByText('Test Description')).toBeInTheDocument();
      });
    });

    test('renders all stages correctly', async () => {
      renderWithRouter(<Challenge />);
      
      await waitFor(() => {
        expect(screen.getByText('Stage 1')).toBeInTheDocument();
        expect(screen.getByText('Stage 2')).toBeInTheDocument();
      });
    });

    test('renders community information', async () => {
      renderWithRouter(<Challenge />);
      
      await waitFor(() => {
        expect(screen.getByText("Wond'ry Innovation Center")).toBeInTheDocument();
      });
    });

    test('renders metrics when available', async () => {
      renderWithRouter(<Challenge />);
      
      await waitFor(() => {
        expect(screen.getByText('100')).toBeInTheDocument(); // views
        expect(screen.getByText('50')).toBeInTheDocument(); // total ideas
        expect(screen.getByText('25')).toBeInTheDocument(); // active users
      });
    });
  });

  describe('User Interactions', () => {
    test('switches between overview and ideas tabs', async () => {
      renderWithRouter(<Challenge />);
      
      await waitFor(() => {
        expect(screen.getByText('Test Challenge')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByText('Ideas'));
      expect(screen.getByText('Solar-Powered Campus Shuttles')).toBeInTheDocument();

      fireEvent.click(screen.getByText('Overview'));
      expect(screen.getByText('Test Description')).toBeInTheDocument();
    });

    test('opens team dialog when clicking Join Challenge', async () => {
      renderWithRouter(<Challenge />);
      
      await waitFor(() => {
        fireEvent.click(screen.getByText('Join Challenge'));
      });

      expect(screen.getByText('Join a Team')).toBeInTheDocument();
    });
  });

  describe('API Interactions', () => {
    test('handles API errors gracefully', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      const alertMock = jest.spyOn(window, 'alert').mockImplementation(() => {});
      
      axios.get.mockRejectedValueOnce({
        response: {
          status: 500,
          data: { message: 'Server Error' }
        }
      });

      renderWithRouter(<Challenge />);
      
      await waitFor(() => {
        expect(alertMock).toHaveBeenCalledWith(expect.stringContaining('Server Error'));
      });

      consoleSpy.mockRestore();
      alertMock.mockRestore();
    });
  });
});