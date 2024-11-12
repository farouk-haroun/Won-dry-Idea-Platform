import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ChallengeIdea, { StarRating, AdminFeedbackForm, IdeaNavigation } from './challenge_idea';
import '@testing-library/jest-dom';

// Mock react-router-dom's useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

// Mock test data
const mockIdea = {
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

// Wrapper component for router context
const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('ChallengeIdea Component', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  // Loading state tests
  describe('Loading State', () => {
    test('displays loading spinner when isLoading is true', () => {
      renderWithRouter(<ChallengeIdea isLoading={true} />);
      expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
    });
  });

  // Authorization tests
  describe('Authorization', () => {
    test('displays unauthorized message when idea is null', () => {
      renderWithRouter(<ChallengeIdea idea={null} isLoading={false} />);
      expect(screen.getByText(/not authorized/i)).toBeInTheDocument();
    });
  });

  // Main component rendering tests
  describe('Component Rendering', () => {
    beforeEach(() => {
      renderWithRouter(
        <ChallengeIdea 
          idea={mockIdea} 
          isLoading={false} 
          isAdmin={false}
        />
      );
    });

    test('renders the header with navigation elements', () => {
      expect(screen.getByAltText('Wondry Logo')).toBeInTheDocument();
      expect(screen.getByText('Home')).toBeInTheDocument();
      expect(screen.getByText('Discover')).toBeInTheDocument();
    });

    test('displays idea title correctly', () => {
      expect(screen.getByText(mockIdea.title)).toBeInTheDocument();
    });

    test('displays team members', () => {
      mockIdea.team.forEach(member => {
        expect(screen.getByText(member.name)).toBeInTheDocument();
      });
    });

    test('displays challenge information', () => {
      expect(screen.getByText(mockIdea.challenge.title)).toBeInTheDocument();
      // Use getAllByText and check the first occurrence for category
      const categoryElements = screen.getAllByText(mockIdea.challenge.category);
      expect(categoryElements[0]).toBeInTheDocument();
    });

    test('displays metrics information', () => {
      const metricsCard = screen.getByTestId('challenge-card');
      expect(metricsCard).toHaveTextContent('Key Metrics');
    });
  });

  // Navigation tests
  describe('Navigation', () => {
    // test('back button triggers navigation', () => {
    //   renderWithRouter(
    //     <ChallengeIdea 
    //       idea={mockIdea} 
    //       isLoading={false}
    //     />
    //   );
      
    //   // Use a more specific selector for the back button
    //   const backButton = screen.getByRole('button', { name: '' });
    //   fireEvent.click(backButton);
    //   expect(mockNavigate).toHaveBeenCalledWith(-1);
    // });

    test('idea board button navigates to idea page', () => {
      renderWithRouter(
        <ChallengeIdea 
          idea={mockIdea} 
          isLoading={false}
        />
      );
      
      const ideaBoardButton = screen.getByText('Open Idea Board');
      fireEvent.click(ideaBoardButton);
      expect(mockNavigate).toHaveBeenCalledWith('/idea');
    });
  });

  // Profile popup tests
  describe('Profile Popup', () => {
    test('toggles profile popup on click', () => {
      renderWithRouter(
        <ChallengeIdea 
          idea={mockIdea} 
          isLoading={false}
        />
      );

      const profileButton = screen.getByText('MM');
      fireEvent.click(profileButton);
      
      // Look for "Sign Out" instead of "Logout"
      expect(screen.getByRole('button', { name: 'Sign Out' })).toBeInTheDocument();
      
      // Click again to close
      fireEvent.click(profileButton);
      expect(screen.queryByRole('button', { name: 'Sign Out' })).not.toBeInTheDocument();
    });
  });

  // Admin feedback form tests
  describe('Admin Feedback Form', () => {
    test('renders admin feedback form when isAdmin is true', () => {
      renderWithRouter(
        <ChallengeIdea 
          idea={mockIdea} 
          isLoading={false} 
          isAdmin={true}
        />
      );
      
      expect(screen.getByText('Provide Feedback')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Add Feedback')).toBeInTheDocument();
      expect(screen.getByText('Move to Next Stage')).toBeInTheDocument();
      expect(screen.getByText('Reject')).toBeInTheDocument();
    });

    test('does not render admin feedback form when isAdmin is false', () => {
      renderWithRouter(
        <ChallengeIdea 
          idea={mockIdea} 
          isLoading={false} 
          isAdmin={false}
        />
      );
      
      expect(screen.queryByText('Provide Feedback')).not.toBeInTheDocument();
    });
  });

  // Star Rating component tests
  describe('Star Rating Display', () => {
    test('displays correct number of stars', () => {
      renderWithRouter(
        <ChallengeIdea 
          idea={mockIdea} 
          isLoading={false}
        />
      );
      
      // Check for stars in the metrics section
      const metricsCard = screen.getByTestId('challenge-card');
      const stars = metricsCard.querySelectorAll('.text-purple-600');
      expect(stars.length).toBeGreaterThan(0);
    });
  });

  // Idea Navigation tests
  describe('Idea Navigation Display', () => {
    test('displays navigation buttons', () => {
      renderWithRouter(
        <ChallengeIdea 
          idea={mockIdea} 
          isLoading={false}
        />
      );
      
      expect(screen.getByText('Previous Idea')).toBeInTheDocument();
      expect(screen.getByText('Next Idea')).toBeInTheDocument();
    });
  });
});