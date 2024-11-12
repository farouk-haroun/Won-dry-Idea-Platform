import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Home from './home';

beforeAll(() => {
  jest.spyOn(console, 'warn').mockImplementation((message) => {
    if (!message.includes('React Router Future Flag Warning')) {
      console.warn(message);
    }
  });
});

afterAll(() => {
  console.warn.mockRestore();
});

describe('Home Component', () => {
  // Helper function to render the component with Router context
  const renderWithRouter = (component) => {
    return render(<MemoryRouter>{component}</MemoryRouter>);
  };

  // Test if the header and navigation links render correctly
  it('renders the header and navigation links', () => {
    renderWithRouter(<Home />);

    // Check for the logo
    expect(screen.getByAltText('Wondry Logo')).toBeInTheDocument();

    // Check for the Home, Discover, and Analytics links
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Discover')).toBeInTheDocument();
    expect(screen.getByText('Analytics')).toBeInTheDocument();
  });

  // Test if the welcome section renders correctly
  it('renders the welcome section with the image and text', () => {
    renderWithRouter(<Home />);

    // Check for the welcome section image
    expect(screen.getByAltText('Welcome')).toBeInTheDocument();

    // Use getByText with a function matcher to find the paragraph
    const welcomeParagraph = screen.getByText((content) =>
      content.includes('Explore groundbreaking ideas')
    );

    expect(welcomeParagraph).toBeInTheDocument();
  });

  // Test if the "Jump into some Challenges" section renders correctly
  it('renders the challenges section', () => {
    renderWithRouter(<Home />);

    // Check for the section title
    expect(
      screen.getByText(/Jump into some Challenges!/i)
    ).toBeInTheDocument();

    // Check for the challenge image
    expect(screen.getByAltText('Challenge')).toBeInTheDocument();

    // Use getByText with a function matcher to find the paragraph
    const challengeParagraph = screen.getByText((content) =>
      content.includes('Embark on new challenges')
    );

    expect(challengeParagraph).toBeInTheDocument();
  });

  // Test if the discover groups section renders correctly
  it('renders the discover groups section with group cards', () => {
    renderWithRouter(<Home />);

    // Check for the section title
    expect(
      screen.getByText(
        /Discover new groups and join in on exciting challenges!/i
      )
    ).toBeInTheDocument();

    // Check for group cards
    const groupCards = screen.getAllByText((content) =>
      content.includes("Wond'ry Quantum Studio")
    );
    expect(groupCards.length).toBeGreaterThan(0); // Expecting at least one group card
  });

  // Test if the announcements section renders correctly
  it('renders the announcements section', () => {
    renderWithRouter(<Home />);

    // Check for the section title
    expect(screen.getByText(/Announcements/i)).toBeInTheDocument();

    // Check for the announcement title
    expect(
      screen.getByText('Idea Innovation Challenge Winner')
    ).toBeInTheDocument();

    // Check for the author and the star rating in the announcement
    expect(screen.getByText('Mothuso Malunga')).toBeInTheDocument();
    expect(screen.getByText('★★★☆☆')).toBeInTheDocument();
  });

  // Test if the footer renders correctly
  it('renders the footer with copyright information', () => {
    renderWithRouter(<Home />);

    // Check for the footer text
    expect(screen.getByText('Wondry © 2024')).toBeInTheDocument();
  });
});
