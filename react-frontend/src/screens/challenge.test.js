import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Challenge from './challenge';
import { BrowserRouter as Router } from 'react-router-dom';

describe('Challenge Component', () => {
  // Helper function to render the component with Router context
  const renderWithRouter = (component) => {
    return render(<Router>{component}</Router>);
  };

  // Test to ensure the challenge title (h1) and description are rendered correctly
  it('renders the challenge title and description', () => {
    renderWithRouter(<Challenge />);

    // Checking that the main heading (h1) with the challenge title is present
    expect(screen.getByRole('heading', { level: 1, name: /Commodore Cup 2023 Sustainability Challenge/i })).toBeInTheDocument();

    // Verifying that the description paragraph is displayed
    expect(screen.getByText(/We are thrilled to announce the inaugural Commodore Cup/i)).toBeInTheDocument();
  });

  // Test to verify the navigation links (Home, Discover, Analytics) are displayed
  it('renders navigation links', () => {
    renderWithRouter(<Challenge />);

    // Checking for the presence of navigation links
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Discover')).toBeInTheDocument();
    expect(screen.getByText('Analytics')).toBeInTheDocument();
  });

  // Test to ensure that all challenge stages are rendered correctly
  it('renders challenge stages', () => {
    renderWithRouter(<Challenge />);

    // Checking that each stage of the challenge is present
    expect(screen.getByText('1st Evaluation')).toBeInTheDocument();
    expect(screen.getByText('2nd Round Evaluation')).toBeInTheDocument();
    expect(screen.getByText('Final Showcase')).toBeInTheDocument();
    expect(screen.getByText('Winners Announcement')).toBeInTheDocument();
  });

  // Test to verify that the "Join Challenge", star, and share buttons are rendered
  it('renders join, star, and share buttons', () => {
    renderWithRouter(<Challenge />);

    // Checking for the "Join Challenge" button
    expect(screen.getByText(/Join Challenge/i)).toBeInTheDocument();

    // Checking for the presence of star and share buttons (2nd and 3rd buttons on the page)
    const starButton = screen.getAllByRole('button')[1];
    const shareButton = screen.getAllByRole('button')[2];

    expect(starButton).toBeInTheDocument();
    expect(shareButton).toBeInTheDocument();
  });

  // Test to ensure that all challenge organizers are displayed
  it('renders challenge organizers', () => {
    renderWithRouter(<Challenge />);

    // Verifying that each organizer's name is displayed
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Samantha Pene')).toBeInTheDocument();
    expect(screen.getByText('Michael Sybil')).toBeInTheDocument();
    expect(screen.getByText('Jane Doe')).toBeInTheDocument();
  });

  // Test to verify that the community section is displayed correctly
  it('renders the community section', () => {
    renderWithRouter(<Challenge />);

    // Checking for the community name in the community section
    expect(screen.getByText('Wondry Quantum Studio')).toBeInTheDocument();
  });

  // Test to ensure that key metrics (views, total ideas, active users) are displayed correctly
  it('renders key metrics', () => {
    renderWithRouter(<Challenge />);

    // Fetching all elements with the number "521" and ensuring there are 3 metrics displayed
    const metrics = screen.getAllByText('521');
    expect(metrics.length).toBe(3);

    // Verifying that each metric's label is displayed
    expect(screen.getByText('views')).toBeInTheDocument();
    expect(screen.getByText('total ideas')).toBeInTheDocument();
    expect(screen.getByText('active users')).toBeInTheDocument();
  });

  // Test to verify that the "Join Challenge" button is clickable
  it('triggers events when clicking on buttons', () => {
    renderWithRouter(<Challenge />);

    // Simulating a click event on the "Join Challenge" button
    const joinButton = screen.getByText(/Join Challenge/i);
    fireEvent.click(joinButton);

    // Checking if the button is still in the document after the click
    expect(joinButton).toBeInTheDocument();
  });
});
