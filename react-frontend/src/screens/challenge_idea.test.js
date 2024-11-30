import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ChallengeIdea from './challenge_idea';
import '@testing-library/jest-dom';

// Mock navigate function
const mockNavigate = jest.fn();

// Mock react-router-dom
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  useLocation: () => ({
    state: { idea: null }
  }),
  Link: ({children, to}) => <a href={to}>{children}</a>
}));

// Mock ProfilePopup
jest.mock('../components/ProfilePopup', () => {
  return function MockProfilePopup({ onClose, onLogout }) {
    return (
      <div>
        <button onClick={onLogout}>Sign Out</button>
        <button onClick={onClose}>Close</button>
      </div>
    );
  };
});

// Mock test data
const mockIdea = {
  id: '1',
  title: "Test Idea Title",
  content: "Test idea content describing sustainability priorities",
  author: "John Doe",
  timestamp: "2024-03-15",
  likes: 42,
  team: [
    { name: "John Doe", avatar: "/avatar1.jpg" },
    { name: "Jane Smith", avatar: "/avatar2.jpg" }
  ],
  challenge: {
    title: "Test Challenge",
    category: "Sustainability"
  },
  metrics: {
    status: "Not Selected",
    rate: 4
  },
  feedback: {
    scalability: 3,
    sustainability: 4,
    innovation: 5,
    impact: 4
  }
};

describe('ChallengeIdea Component', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  test('renders header elements', () => {
    render(
      <BrowserRouter>
        <ChallengeIdea />
      </BrowserRouter>
    );

    expect(screen.getByAltText('Wondry Logo')).toBeInTheDocument();
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Discover')).toBeInTheDocument();
  });

  test('renders idea board button', () => {
    render(
      <BrowserRouter>
        <ChallengeIdea />
      </BrowserRouter>
    );

    const ideaBoardButton = screen.getByText('Open Idea Board');
    expect(ideaBoardButton).toBeInTheDocument();
    
    fireEvent.click(ideaBoardButton);
    expect(mockNavigate).toHaveBeenCalledWith('/idea');
  });

  test('shows and hides profile popup', () => {
    render(
      <BrowserRouter>
        <ChallengeIdea />
      </BrowserRouter>
    );

    // Click on profile button (MM initials)
    const profileButton = screen.getByText('MM');
    fireEvent.click(profileButton);

    // Check if Sign Out button is visible
    const signOutButton = screen.getByText('Sign Out');
    expect(signOutButton).toBeInTheDocument();

    // Click Sign Out
    fireEvent.click(signOutButton);
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });

  test('renders admin feedback form when isAdmin is true', () => {
    render(
      <BrowserRouter>
        <ChallengeIdea idea={mockIdea} isAdmin={true} />
      </BrowserRouter>
    );

    expect(screen.getByText('Provide Feedback')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Add Feedback')).toBeInTheDocument();
  });

  test('does not render admin feedback form when isAdmin is false', () => {
    render(
      <BrowserRouter>
        <ChallengeIdea idea={mockIdea} isAdmin={false} />
      </BrowserRouter>
    );

    expect(screen.queryByText('Provide Feedback')).not.toBeInTheDocument();
  });

  test('displays idea content when idea prop is provided', () => {
    render(
      <BrowserRouter>
        <ChallengeIdea idea={mockIdea} />
      </BrowserRouter>
    );

    expect(screen.getByText(/sustainability priorities/)).toBeInTheDocument();
    expect(screen.getByText('Team')).toBeInTheDocument();
    expect(screen.getByText('Challenge')).toBeInTheDocument();
  });
});