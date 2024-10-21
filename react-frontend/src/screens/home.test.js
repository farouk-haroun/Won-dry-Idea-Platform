import React from 'react';
import { render, screen } from '@testing-library/react';
import Home from './home';

describe('Home Component', () => {
  // Test if the header and navigation links render correctly
  it('renders the header and navigation links', () => {
    render(<Home />);

    // Check for the logo
    expect(screen.getByAltText("Wondry Logo")).toBeInTheDocument();

    // Check for the Home, Discover, and Analytics links
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Discover')).toBeInTheDocument();
    expect(screen.getByText('Analytics')).toBeInTheDocument();
  });

  // Test if the welcome section renders correctly
  it('renders the welcome section with the image and text', () => {
    render(<Home />);

    // Check for the welcome section image
    expect(screen.getByAltText('Welcome')).toBeInTheDocument();

    // Use getAllByText to target the specific paragraph in the welcome section
    const welcomeParagraphs = screen.getAllByText(/Lorem ipsum dolor sit amet, consectetur adipiscing elit./i);
    
    // Target the first paragraph (or adjust the index if necessary)
    expect(welcomeParagraphs[0]).toBeInTheDocument();
  });

  // Test if the "Jump into some Challenges" section renders correctly
  it('renders the challenges section', () => {
    render(<Home />);

    // Check for the section title
    expect(screen.getByText(/Jump into some Challenges!/i)).toBeInTheDocument();

    // Check for the challenge image
    expect(screen.getByAltText('Challenge')).toBeInTheDocument();

    // Use getAllByText to target the specific paragraph in the challenges section
    const challengeParagraphs = screen.getAllByText(/Lorem ipsum dolor sit amet, consectetur adipiscing elit./i);
    
    // Target the second paragraph (adjust the index if necessary)
    expect(challengeParagraphs[1]).toBeInTheDocument();
  });

  // Test if the discover groups section renders correctly
  it('renders the discover groups section with group cards', () => {
    render(<Home />);

    // Check for the section title
    expect(screen.getByText(/Discover new groups and join in on exciting challenges!/i)).toBeInTheDocument();

    // Check for group cards
    const groupCards = screen.getAllByText('Wond\'ry Quantum Studio');
    expect(groupCards.length).toBe(4); // Expecting 4 group cards
  });

  // Test if the announcements section renders correctly
  it('renders the announcements section', () => {
    render(<Home />);

    // Check for the section title
    expect(screen.getByText(/Announcements/i)).toBeInTheDocument();

    // Check for the announcement title
    expect(screen.getByText('Idea Innovation Challenge Winner')).toBeInTheDocument();

    // Check for the author and the star rating in the announcement
    expect(screen.getByText('Mothuso Malunga')).toBeInTheDocument();
    expect(screen.getByText('★★★☆☆')).toBeInTheDocument();
  });

  // Test if the footer renders correctly
  it('renders the footer with copyright information', () => {
    render(<Home />);

    // Check for the footer text
    expect(screen.getByText('Wondry © 2024')).toBeInTheDocument();
  });
});
