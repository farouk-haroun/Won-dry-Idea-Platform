import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Profile from './profile';
import { MemoryRouter } from 'react-router-dom';
import axios from 'axios';

jest.mock('axios');

describe('Profile Component', () => {
  const mockChallenges = [
    { _id: '1', title: 'Challenge 1' },
    { _id: '2', title: 'Challenge 2' },
  ];

  beforeEach(() => {
    axios.get.mockResolvedValue({ data: mockChallenges });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders user profile information', () => {
    render(<Profile />, { wrapper: MemoryRouter });

    expect(screen.getByText('Mothuso Malunga')).toBeInTheDocument();
    expect(screen.getByText('mothuso.malunga@vanderbilt.edu')).toBeInTheDocument();
    expect(screen.getByText('Student')).toBeInTheDocument();
    expect(screen.getByText('Computer Science')).toBeInTheDocument();
    expect(screen.getByText('January 2024')).toBeInTheDocument();
  });

  test('fetches and displays challenges on mount', async () => {
    render(<Profile />, { wrapper: MemoryRouter });

    await waitFor(() => expect(axios.get).toHaveBeenCalledWith(`${API_BASE_URL}/challenges/user-challenges`));
    expect(screen.getByText('Challenge 1')).toBeInTheDocument();
    expect(screen.getByText('Challenge 2')).toBeInTheDocument();
  });

  test('navigates to login on logout', () => {
    const navigate = jest.fn();
    jest.spyOn(require('react-router-dom'), 'useNavigate').mockReturnValue(navigate);

    render(<Profile />, { wrapper: MemoryRouter });

    fireEvent.click(screen.getByText('MM'));
    fireEvent.click(screen.getByText('Logout'));

    expect(navigate).toHaveBeenCalledWith('/login');
  });

  test('shows profile popup on avatar click', () => {
    render(<Profile />, { wrapper: MemoryRouter });

    const avatar = screen.getByText('MM');
    fireEvent.click(avatar);

    expect(screen.getByText('Logout')).toBeInTheDocument();
  });

  test('switches active tab correctly', () => {
    render(<Profile />, { wrapper: MemoryRouter });

    const ideasTab = screen.getByText('My Ideas');
    fireEvent.click(ideasTab);

    expect(ideasTab).toHaveClass('border-b-2', 'border-[#874c9e]', 'text-[#874c9e]');
  });

  test('opens profile settings popup when Edit Profile is clicked', () => {
    render(<Profile />, { wrapper: MemoryRouter });

    fireEvent.click(screen.getByText('Edit Profile'));
    expect(screen.getByText('Update Profile')).toBeInTheDocument();
  });

  test('filters and sorts challenges', () => {
    render(<Profile />, { wrapper: MemoryRouter });

    const searchInput = screen.getByPlaceholderText('Search your content...');
    fireEvent.change(searchInput, { target: { value: 'Challenge' } });

    expect(screen.getByText('Challenge 1')).toBeInTheDocument();
    expect(screen.getByText('Challenge 2')).toBeInTheDocument();

    const sortSelect = screen.getByDisplayValue('Sort by: Recent');
    fireEvent.change(sortSelect, { target: { value: 'Sort by: Popular' } });

    expect(sortSelect.value).toBe('Sort by: Popular');
  });

  test('displays fallback message when no challenges are found', async () => {
    axios.get.mockResolvedValueOnce({ data: [] });

    render(<Profile />, { wrapper: MemoryRouter });

    await waitFor(() => expect(screen.getByText('No challenges found')).toBeInTheDocument());
  });
});