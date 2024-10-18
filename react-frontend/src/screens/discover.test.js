import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Discover from './discover';

describe('Discover Component', () => {
  
  // Test to check if the Discover component renders correctly
  it('renders without crashing', () => {
    render(<Discover />);
    expect(screen.getByText(/Wondry © 2024/i)).toBeInTheDocument();
  });

  // Test to check if header and navigation links are rendered
  it('renders the navigation links', () => {
    render(<Discover />);
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Discover')).toBeInTheDocument();
    expect(screen.getByText('Analytics')).toBeInTheDocument();
  });

  // Test if the filter buttons are rendered correctly
  it('renders the filter buttons', () => {
    render(<Discover />);
    expect(screen.getByText('Challenges')).toBeInTheDocument();
    expect(screen.getByText('Ideas')).toBeInTheDocument();
    expect(screen.getByText('Idea Spaces')).toBeInTheDocument();
  });

  // Test if clicking filter button toggles selection
  it('toggles the Challenges button selection', () => {
    render(<Discover />);
    const challengesButton = screen.getByText('Challenges');

    // Initially selected, so it should have the selected class
    expect(challengesButton).toHaveClass('bg-gray-800 text-white');

    // Click to deselect
    fireEvent.click(challengesButton);
    expect(challengesButton).toHaveClass('bg-gray-800 text-white'); // Should remain selected since it's the only option
  });

  it('toggles the Ideas button selection', () => {
    render(<Discover />);
    const ideasButton = screen.getByText('Ideas');

    // Initially not selected
    expect(ideasButton).toHaveClass('bg-white text-gray-700');

    // Click to select
    fireEvent.click(ideasButton);
    expect(ideasButton).toHaveClass('bg-gray-800 text-white');

    // Click again to deselect
    fireEvent.click(ideasButton);
    expect(ideasButton).toHaveClass('bg-white text-gray-700');
  });

  // Test if the search input is rendered
  it('renders the search input', () => {
    render(<Discover />);
    expect(screen.getByPlaceholderText('Looking for Something?')).toBeInTheDocument();
  });

  // Test if the dropdown is rendered
  it('renders the Sort By dropdown', () => {
    render(<Discover />);
    expect(screen.getByText('Sort By:')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Relevance')).toBeInTheDocument();
  });

  // Test if IdeaCards are rendered
  it('renders the IdeaCards', () => {
    render(<Discover />);
    expect(screen.getByText('Idea Innovation Challenge')).toBeInTheDocument();
    expect(screen.getByText('Interactive Dashboards')).toBeInTheDocument();
    expect(screen.getByText("Wond'ry Quantum Studio")).toBeInTheDocument();
  });

  // Test if footer is rendered
  it('renders the footer', () => {
    render(<Discover />);
    expect(screen.getByText('Wondry © 2024')).toBeInTheDocument();
  });
});
