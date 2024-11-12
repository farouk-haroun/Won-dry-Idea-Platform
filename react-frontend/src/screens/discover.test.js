import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import Discover from './discover';
import { MemoryRouter } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../utils/constants';

// Mock axios
jest.mock('axios');

// Mock the ChallengeCard component
jest.mock('../components/ChallengeCard', () => {
  return function MockChallengeCard({ challenge }) {
    return (
      <div data-testid="challenge-card">
        <h3>{challenge.title}</h3>
      </div>
    );
  };
});

describe('Discover Component', () => {
  const mockChallenges = [
    { 
      _id: '1', 
      title: 'Idea Innovation Challenge',
      status: 'ACTIVE',
      stages: [
        { submissions: [] },
        { submissions: [] }
      ]
    },
    { 
      _id: '2', 
      title: 'Interactive Dashboards',
      status: 'ACTIVE',
      stages: [
        { submissions: [] }
      ]
    },
    { 
      _id: '3', 
      title: "Wond'ry Quantum Studio",
      status: 'ACTIVE',
      stages: [
        { submissions: [] }
      ]
    }
  ];

  beforeEach(() => {
    axios.get.mockReset();
    axios.get.mockResolvedValue({ data: mockChallenges });
  });

  const renderWithProviders = async () => {
    let result;
    await act(async () => {
      result = render(
        <MemoryRouter>
          <Discover />
        </MemoryRouter>
      );
    });
    return result;
  };

  it('renders navigation links', async () => {
    await renderWithProviders();
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Discover')).toBeInTheDocument();
    expect(screen.getByText('MM')).toBeInTheDocument();
  });

  it('renders filter buttons', async () => {
    await renderWithProviders();
    expect(screen.getByText('Challenges')).toBeInTheDocument();
    expect(screen.getByText('Ideas')).toBeInTheDocument();
    expect(screen.getByText('Idea Spaces')).toBeInTheDocument();
  });

  it('renders search and sort elements', async () => {
    await renderWithProviders();
    expect(screen.getByPlaceholderText('Looking for Something?')).toBeInTheDocument();
    expect(screen.getByText('Sort By:')).toBeInTheDocument();
    expect(screen.getByRole('combobox')).toHaveValue('Relevance');
  });

  it('renders the create challenge button', async () => {
    await renderWithProviders();
    expect(screen.getByText('Create Challenge')).toBeInTheDocument();
  });

  it('renders challenges from API', async () => {
    await renderWithProviders();
    
    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith(`${API_BASE_URL}/challenges/challenges`);
      expect(screen.getAllByTestId('challenge-card')).toHaveLength(3);
      expect(screen.getByText('Idea Innovation Challenge')).toBeInTheDocument();
      expect(screen.getByText('Interactive Dashboards')).toBeInTheDocument();
      expect(screen.getByText("Wond'ry Quantum Studio")).toBeInTheDocument();
    });
  });

  it('toggles filter options correctly', async () => {
    await renderWithProviders();
    
    const challengesButton = screen.getByText('Challenges');
    const ideasButton = screen.getByText('Ideas');
    
    expect(challengesButton).toHaveClass('bg-gray-800', 'text-white');
    expect(ideasButton).not.toHaveClass('bg-gray-800', 'text-white');
    
    await act(async () => {
      fireEvent.click(ideasButton);
    });
    
    expect(ideasButton).toHaveClass('bg-gray-800', 'text-white');
  });

  it('opens and closes filter dialog', async () => {
    await renderWithProviders();
    
    const filterButton = screen.getByText('Filter');
    await act(async () => {
      fireEvent.click(filterButton);
    });
    
    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(screen.getByText('Keywords:')).toBeInTheDocument();
    });
    
    const closeButton = screen.getByRole('button', { name: /search/i });
    await act(async () => {
      fireEvent.click(closeButton);
    });
    
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });

  it('handles API error gracefully', async () => {
    axios.get.mockRejectedValueOnce(new Error('API Error'));
    
    await renderWithProviders();
    
    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith(`${API_BASE_URL}/challenges/challenges`);
      expect(screen.queryAllByTestId('challenge-card')).toHaveLength(0);
    });
  });

  it('renders footer', async () => {
    await renderWithProviders();
    expect(screen.getByText(/Wondry © 2024/)).toBeInTheDocument();
  });

  // Clean up after all tests
  afterEach(() => {
    jest.clearAllMocks();
  });
});