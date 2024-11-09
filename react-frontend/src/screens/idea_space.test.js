import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import IdeaSpace from './IdeaSpace';

// Mock navigate function from react-router
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
}));

describe('IdeaSpace Component', () => {
  beforeEach(() => {
    render(<IdeaSpace />, { wrapper: MemoryRouter });
  });

  test('renders header, tabs, and footer correctly', () => {
    // Header elements
    expect(screen.getByAltText('Wondry Logo')).toBeInTheDocument();
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Discover')).toBeInTheDocument();

    // Tabs
    expect(screen.getByText('Overview')).toBeInTheDocument();
    expect(screen.getByText('Activity')).toBeInTheDocument();

    // Footer
    expect(screen.getByText('Wondry © 2024')).toBeInTheDocument();
  });

  test('toggles profile popup visibility', () => {
    // Open profile popup
    fireEvent.click(screen.getByText('MM'));
    expect(screen.getByText('Logout')).toBeInTheDocument();

    // Close profile popup
    fireEvent.click(screen.getByText('MM'));
    expect(screen.queryByText('Logout')).not.toBeInTheDocument();
  });

  test('logs out and navigates to login', () => {
    // Open profile popup and click logout
    fireEvent.click(screen.getByText('MM'));
    fireEvent.click(screen.getByText('Logout'));

    // Expect navigate to have been called with /login
    const navigate = require('react-router-dom').useNavigate();
    expect(navigate).toHaveBeenCalledWith('/login');
  });

  test('opens and closes filter modal', () => {
    // Open filter modal
    fireEvent.click(screen.getByText('Filter'));
    expect(screen.getByText('Apply Filters')).toBeInTheDocument();

    // Close filter modal
    fireEvent.click(screen.getByText('Filter'));
    expect(screen.queryByText('Apply Filters')).not.toBeInTheDocument();
  });

  test('updates filter state correctly', () => {
    fireEvent.click(screen.getByText('Filter'));

    // Change category selection
    const categorySelect = screen.getByLabelText('Category');
    fireEvent.change(categorySelect, { target: { value: 'TECHNOLOGY' } });
    expect(categorySelect.value).toBe('TECHNOLOGY');

    // Change status selection
    const statusSelect = screen.getByLabelText('Status');
    fireEvent.change(statusSelect, { target: { value: 'OPEN' } });
    expect(statusSelect.value).toBe('OPEN');
  });

  test('handles keyword addition and removal', () => {
    fireEvent.click(screen.getByText('Filter'));

    // Add a keyword
    const keywordInput = screen.getByPlaceholderText('Add keyword');
    fireEvent.change(keywordInput, { target: { value: 'AI' } });
    fireEvent.keyPress(keywordInput, { key: 'Enter', code: 'Enter' });
    expect(screen.getByText('AI')).toBeInTheDocument();

    // Remove keyword
    fireEvent.click(screen.getByLabelText('Remove AI'));
    expect(screen.queryByText('AI')).not.toBeInTheDocument();
  });

  test('navigates correctly when tabs are clicked', () => {
    // Check initial state
    expect(screen.getByText('Overview')).toHaveClass('active');

    // Switch to Activity tab
    fireEvent.click(screen.getByText('Activity'));
    expect(screen.getByText('Activity')).toHaveClass('active');
    expect(screen.getByText('Overview')).not.toHaveClass('active');
  });

  test('displays and updates ChallengeCard components', () => {
    // Mock challenges data and render
    const mockChallenges = [
      { id: 1, title: 'Challenge 1' },
      { id: 2, title: 'Challenge 2' },
    ];
    render(<IdeaSpace challenges={mockChallenges} />, { wrapper: MemoryRouter });

    // Verify challenges render correctly
    mockChallenges.forEach((challenge) => {
      expect(screen.getByText(challenge.title)).toBeInTheDocument();
    });
  });

  test('handles Search button click in filter modal', () => {
    fireEvent.click(screen.getByText('Filter'));

    // Set some filter options
    const categorySelect = screen.getByLabelText('Category');
    fireEvent.change(categorySelect, { target: { value: 'TECHNOLOGY' } });

    // Click Search button
    fireEvent.click(screen.getByText('Search'));

    // Verify modal closes
    expect(screen.queryByText('Apply Filters')).not.toBeInTheDocument();
  });

  test('shows no challenges found if filter yields no results', () => {
    // Assuming no challenges match the filters set
    render(<IdeaSpace challenges={[]} />, { wrapper: MemoryRouter });

    // Apply a filter that results in no data
    fireEvent.click(screen.getByText('Filter'));
    fireEvent.click(screen.getByText('Search'));

    // Verify empty state message appears
    expect(screen.getByText('No challenges found')).toBeInTheDocument();
  });

  test('validates date range in filter modal', () => {
    fireEvent.click(screen.getByText('Filter'));

    // Select a start date
    const startDate = screen.getByLabelText('Start Date');
    fireEvent.change(startDate, { target: { value: '2024-11-01' } });

    // Select an end date earlier than the start date
    const endDate = screen.getByLabelText('End Date');
    fireEvent.change(endDate, { target: { value: '2024-10-01' } });

    // Expect validation message or incorrect date behavior handling
    expect(screen.getByText('End date cannot be before start date')).toBeInTheDocument();
  });
});