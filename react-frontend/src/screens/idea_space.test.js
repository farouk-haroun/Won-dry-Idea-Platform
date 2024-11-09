import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import IdeaSpace from './idea_space';

// Mock navigate function from react-router
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(() => jest.fn()),
}));

describe('IdeaSpace Component', () => {
  beforeEach(() => {
    render(<IdeaSpace />, { wrapper: MemoryRouter });
  });

  test('renders header, tabs, and footer correctly', () => {
    expect(screen.getByAltText('Wondry Logo')).toBeInTheDocument();
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Discover')).toBeInTheDocument();
    expect(screen.getByText('Overview')).toBeInTheDocument();
    expect(screen.getByText('Activity')).toBeInTheDocument();
    expect(screen.getByText('Wondry © 2024')).toBeInTheDocument();
  });

  test('toggles profile popup visibility', async () => {
    fireEvent.click(screen.getByText('MM'));
    expect(await screen.findByText('Logout')).toBeInTheDocument();
    fireEvent.click(screen.getByText('MM'));
    expect(screen.queryByText('Logout')).not.toBeInTheDocument();
  });

  test('logs out and navigates to login', () => {
    const navigate = require('react-router-dom').useNavigate();
    fireEvent.click(screen.getByText('MM'));
    fireEvent.click(screen.getByText('Logout'));
    expect(navigate).toHaveBeenCalledWith('/login');
  });

  test('opens and closes filter modal', async () => {
    await act(async () => {
      fireEvent.click(screen.getByText('Filter'));
    });
    expect(await screen.findByText('Apply Filters')).toBeInTheDocument();
    await act(async () => {
      fireEvent.click(screen.getByText('Filter'));
    });
    expect(screen.queryByText('Apply Filters')).not.toBeInTheDocument();
  });

  test('updates filter state correctly', async () => {
    fireEvent.click(screen.getByText('Filter'));
    const categorySelect = await screen.findByLabelText('Category');
    fireEvent.change(categorySelect, { target: { value: 'TECHNOLOGY' } });
    expect(categorySelect.value).toBe('TECHNOLOGY');
    const statusSelect = await screen.findByLabelText('Status');
    fireEvent.change(statusSelect, { target: { value: 'OPEN' } });
    expect(statusSelect.value).toBe('OPEN');
  });

  test('handles keyword addition and removal', async () => {
    fireEvent.click(screen.getByText('Filter'));
    const keywordInput = screen.getByPlaceholderText('Add keyword');
    fireEvent.change(keywordInput, { target: { value: 'AI' } });
    fireEvent.keyPress(keywordInput, { key: 'Enter', code: 'Enter' });
    expect(screen.getByText('AI')).toBeInTheDocument();
    fireEvent.click(screen.getByLabelText('Remove AI'));
    expect(screen.queryByText('AI')).not.toBeInTheDocument();
  });

  test('navigates correctly when tabs are clicked', async () => {
    expect(screen.getByText('Overview')).toHaveClass('active');
    fireEvent.click(screen.getByText('Activity'));
    expect(screen.getByText('Activity')).toHaveClass('active');
    expect(screen.getByText('Overview')).not.toHaveClass('active');
  });

  test('displays and updates ChallengeCard components', () => {
    const mockChallenges = [
      { id: 1, title: 'Challenge 1' },
      { id: 2, title: 'Challenge 2' },
    ];
    render(<IdeaSpace challenges={mockChallenges} />, { wrapper: MemoryRouter });
    mockChallenges.forEach((challenge) => {
      expect(screen.getByText(challenge.title)).toBeInTheDocument();
    });
  });

  test('handles Search button click in filter modal', async () => {
    fireEvent.click(screen.getByText('Filter'));
    const categorySelect = await screen.findByLabelText('Category');
    fireEvent.change(categorySelect, { target: { value: 'TECHNOLOGY' } });
    fireEvent.click(screen.getByText('Search'));
    expect(screen.queryByText('Apply Filters')).not.toBeInTheDocument();
  });

  test('shows no challenges found if filter yields no results', async () => {
    render(<IdeaSpace challenges={[]} />, { wrapper: MemoryRouter });
    fireEvent.click(screen.getByText('Filter'));
    fireEvent.click(screen.getByText('Search'));
    expect(await screen.findByText('No challenges found')).toBeInTheDocument();
  });

  test('validates date range in filter modal', async () => {
    fireEvent.click(screen.getByText('Filter'));
    const startDate = await screen.findByLabelText('Start Date');
    fireEvent.change(startDate, { target: { value: '2024-11-01' } });
    const endDate = await screen.findByLabelText('End Date');
    fireEvent.change(endDate, { target: { value: '2024-10-01' } });
    expect(await screen.findByText('End date cannot be before start date')).toBeInTheDocument();
  });
});
