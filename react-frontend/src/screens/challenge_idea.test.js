import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import ChallengeIdea from './challenge_idea';

jest.mock('axios');

const mockStore = configureStore([]);

describe('ChallengeIdea Component', () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      auth: { isAuthenticated: true, user: { id: 1, name: 'Test User', role: 'user' } },
      // Include other necessary state slices
    });
  });

  test('renders the ChallengeIdea component', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <ChallengeIdea />
        </MemoryRouter>
      </Provider>
    );
    expect(screen.getByTestId('challenge-idea-component')).toBeInTheDocument();
  });

  test('shows error message if required fields are missing', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <ChallengeIdea />
        </MemoryRouter>
      </Provider>
    );
    expect(screen.getByText(/error: title is required/i)).toBeInTheDocument(); // Adjust based on actual error text
  });

  test('calls handleClick when the submit button is clicked', () => {
    const handleClick = jest.fn();
    render(
      <Provider store={store}>
        <MemoryRouter>
          <ChallengeIdea onClick={handleClick} />
        </MemoryRouter>
      </Provider>
    );

    const button = screen.getByRole('button', { name: /submit/i }); // Adjust button selector as needed
    fireEvent.click(button);

    expect(handleClick).toHaveBeenCalled();
  });

  test('renders key metrics section', () => {
    expect(screen.getByTestId('key-metrics')).toBeInTheDocument();
  });

  test('displays organizer feedback when provided', () => {
    const feedback = 'Great challenge with lots of potential!';
    render(
      <Provider store={store}>
        <MemoryRouter>
          <ChallengeIdea organizerFeedback={feedback} />
        </MemoryRouter>
      </Provider>
    );
    expect(screen.getByText(feedback)).toBeInTheDocument();
  });

  test('handles hover animation on card', () => {
    const card = screen.getByTestId('challenge-card');
    fireEvent.mouseOver(card);
    expect(card).toHaveClass('hover-animation'); // Replace 'hover-animation' with the actual hover class
  });

  test('displays unauthorized message if user lacks permission', () => {
    const unauthorizedStore = mockStore({
      auth: { isAuthenticated: false },
    });

    render(
      <Provider store={unauthorizedStore}>
        <MemoryRouter>
          <ChallengeIdea />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText(/you are not authorized to view this challenge/i)).toBeInTheDocument();
  });

  test('shows feedback input for admin users', () => {
    const adminStore = mockStore({
      auth: { isAuthenticated: true, role: 'admin' },
    });

    render(
      <Provider store={adminStore}>
        <MemoryRouter>
          <ChallengeIdea />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByPlaceholderText(/add feedback/i)).toBeInTheDocument();
  });

  test('displays loading spinner when data is loading', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <ChallengeIdea isLoading={true} />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });

  test('renders list of ideas associated with the challenge', () => {
    const ideas = [
      { id: 1, title: 'Idea 1' },
      { id: 2, title: 'Idea 2' },
    ];

    render(
      <Provider store={store}>
        <MemoryRouter>
          <ChallengeIdea ideas={ideas} />
        </MemoryRouter>
      </Provider>
    );

    ideas.forEach((idea) => {
      expect(screen.getByText(idea.title)).toBeInTheDocument();
    });
  });
});
