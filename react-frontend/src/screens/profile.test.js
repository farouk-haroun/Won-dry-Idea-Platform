import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { act } from 'react-dom/test-utils';
import axios from 'axios';
import Profile from './profile';

// Mock modules
jest.mock('axios');
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn()
}));

// Mock data
const mockUserProfile = {
  name: 'Test User',
  email: 'test@example.com',
  role: 'user',
  department: 'Engineering',
  points: 100,
  createdAt: '2024-01-01T00:00:00.000Z',
  interests: ['AI', 'Web Development'],
  skills: ['React', 'JavaScript']
};

const mockChallenges = [
  {
    _id: '1',
    title: 'Test Challenge',
    description: 'Test Description',
    status: 'active'
  }
];

describe('Profile Component', () => {
  beforeEach(() => {
    localStorage.clear();
    localStorage.setItem('token', 'mock-token');
    axios.get.mockReset();
  });

  test('renders profile component with loading state', () => {
    render(
      <BrowserRouter>
        <Profile />
      </BrowserRouter>
    );
    
    expect(screen.getByAltText('Wondry Logo')).toBeInTheDocument();
    expect(screen.getByTestId('profile-avatar')).toBeInTheDocument();
  });

  test('fetches and displays user profile data', async () => {
    axios.get.mockImplementation((url) => {
      if (url.includes('/users/profile')) {
        return Promise.resolve({ data: mockUserProfile });
      }
      return Promise.reject(new Error('not found'));
    });

    render(
      <BrowserRouter>
        <Profile />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(mockUserProfile.name)).toBeInTheDocument();
      expect(screen.getByText(mockUserProfile.email)).toBeInTheDocument();
      expect(screen.getByText(mockUserProfile.department)).toBeInTheDocument();
    });
  });

  test('handles profile popup toggle', () => {
    render(
      <BrowserRouter>
        <Profile />
      </BrowserRouter>
    );

    const avatar = screen.getByTestId('profile-avatar');
    fireEvent.click(avatar);
    
    // Profile popup should be visible with My Profile link
    expect(screen.getByText('My Profile')).toBeInTheDocument();
    
    // Click again to close
    fireEvent.click(avatar);
    expect(screen.queryByText('My Profile')).not.toBeInTheDocument();
  });

  test('handles tab switching', () => {
    render(
      <BrowserRouter>
        <Profile />
      </BrowserRouter>
    );

    // Click on different tabs
    fireEvent.click(screen.getByText('My Ideas'));
    expect(screen.getByText('My Ideas')).toHaveClass('text-[#874c9e]');

    fireEvent.click(screen.getByText('Drafts'));
    expect(screen.getByText('Drafts')).toHaveClass('text-[#874c9e]');
  });

  test('displays no challenges message when challenges array is empty', async () => {
    axios.get.mockImplementation((url) => {
      if (url.includes('/users/profile')) {
        return Promise.resolve({ data: mockUserProfile });
      }
      if (url.includes('/challenges/user-challenges')) {
        return Promise.resolve({ data: [] });
      }
      return Promise.reject(new Error('not found'));
    });

    render(
      <BrowserRouter>
        <Profile />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId('no-challenges-message')).toBeInTheDocument();
    });
  });

  test('handles profile settings popup', async () => {
    render(
      <BrowserRouter>
        <Profile />
      </BrowserRouter>
    );

    // Click edit profile button
    fireEvent.click(screen.getByText('Edit Profile'));
    
    // Profile settings popup should be visible with the title
    expect(screen.getByText(/edit profile/i)).toBeInTheDocument();
  });

  test('handles sorting selection', () => {
    render(
      <BrowserRouter>
        <Profile />
      </BrowserRouter>
    );

    const sortSelect = screen.getByTestId('sort-select');
    fireEvent.change(sortSelect, { target: { value: 'Sort by: Popular' } });
    
    expect(sortSelect.value).toBe('Sort by: Popular');
  });

  test('redirects to login when token is missing', async () => {
    localStorage.clear(); // Remove token
    const navigate = jest.fn();
    jest.spyOn(require('react-router-dom'), 'useNavigate').mockImplementation(() => navigate);

    render(
      <BrowserRouter>
        <Profile />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(navigate).toHaveBeenCalledWith('/login');
    });
  });

  test('handles network errors gracefully', async () => {
    axios.get.mockRejectedValue(new Error('Network error'));
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <BrowserRouter>
        <Profile />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalled();
    });

    consoleSpy.mockRestore();
  });
});