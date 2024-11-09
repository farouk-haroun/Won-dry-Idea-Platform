import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Discover from './discover';
import { MemoryRouter } from 'react-router-dom';

import axios from 'axios';

jest.mock('axios');

describe('Discover Component', () => {
  // Helper function to render the component with necessary providers
  const renderWithProviders = (component) => {
    return render(
      <MemoryRouter>{component}</MemoryRouter>
    );
  };


  beforeEach(() => {
    axios.get.mockClear();
  });

  // Test to check if navigation links are rendered
  it('renders the navigation links', () => {
    renderWithProviders(<Discover />);
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Discover')).toBeInTheDocument();
    expect(screen.getByText('Analytics')).toBeInTheDocument();

    // Since 'Profile' is now represented by 'MM' (user initials), we check for 'MM'
    expect(screen.getByText('MM')).toBeInTheDocument();
  });

  // Test to check if filter buttons are rendered
  it('renders the filter buttons', () => {
    renderWithProviders(<Discover />);
    expect(screen.getByText('Challenges')).toBeInTheDocument();
    expect(screen.getByText('Ideas')).toBeInTheDocument();
    expect(screen.getByText('Idea Spaces')).toBeInTheDocument();
  });

  // Test to check if clicking 'Challenges' button toggles its active state
  it('toggles the Challenges button selection', () => {
    renderWithProviders(<Discover />);
    const challengesButton = screen.getByText('Challenges');

    // Assuming the active button has 'bg-gray-800 text-white' classes
    expect(challengesButton).toHaveClass('bg-gray-800', 'text-white');

    // Click the button to toggle its state
    fireEvent.click(challengesButton);

    // After clicking, check if the classes have changed
    expect(challengesButton).toHaveClass('bg-gray-800', 'text-white');
  });

  // Test to check if clicking 'Ideas' button toggles its active state
  it('toggles the Ideas button selection', () => {
    renderWithProviders(<Discover />);
    const ideasButton = screen.getByText('Ideas');

    // Initially, the 'Ideas' button should not have 'bg-gray-800 text-white' classes
    expect(ideasButton).not.toHaveClass('bg-gray-800', 'text-white');

    // Click the button to toggle its state
    fireEvent.click(ideasButton);

    // After clicking, check if the classes have changed
    expect(ideasButton).toHaveClass('bg-gray-800', 'text-white');
  });

  // Test to check if the search input is rendered with correct placeholder
  it('renders the search input', () => {
    renderWithProviders(<Discover />);
    expect(screen.getByPlaceholderText('Looking for Something?')).toBeInTheDocument();
  });

  // Test to check if the 'Sort By' dropdown is rendered
  it('renders the Sort By dropdown', () => {
    renderWithProviders(<Discover />);
    expect(screen.getByText('Sort By:')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Relevance')).toBeInTheDocument();
  });

  // Mock data for challenges
  const mockChallenges = [
    { id: 1, title: 'Idea Innovation Challenge' },
    { id: 2, title: 'Interactive Dashboards' },
    { id: 3, title: "Wond'ry Quantum Studio" },
  ];

  // Test to check if IdeaCards are rendered when data is provided
  it('renders the IdeaCards', () => {
    // Modify the Discover component to accept 'challenges' as a prop for testing purposes
    renderWithProviders(<Discover challenges={mockChallenges} />);

    expect(screen.getByText('Idea Innovation Challenge')).toBeInTheDocument();
    expect(screen.getByText('Interactive Dashboards')).toBeInTheDocument();
    expect(screen.getByText("Wond'ry Quantum Studio")).toBeInTheDocument();
  });

  // Test to check if the footer is rendered
  it('renders the footer', () => {
    renderWithProviders(<Discover />);
    expect(screen.getByText('Wondry © 2024')).toBeInTheDocument();
  });
});
