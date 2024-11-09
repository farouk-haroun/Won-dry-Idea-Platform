// src/screens/challenge_idea.test.js

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter, useNavigate } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import ChallengeIdea from './challenge_idea';
import axios from 'axios';

jest.mock('axios');

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
  useParams: jest.fn(),
}));

const navigateMock = jest.fn();
useNavigate.mockReturnValue(navigateMock);

const mockStore = configureStore([thunk]);

describe('ChallengeIdea Component', () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      auth: { isAuthenticated: true, user: { id: 1, name: 'Test User', role: 'user' } },
    });

    jest.clearAllMocks();

    const { useParams } = require('react-router-dom');
    useParams.mockReturnValue({ id: '1' });
  });

  const idea = {
    title: 'United by Better Coffee',
    author: 'John Doe',
    timestamp: '2024/09/20 08:36',
    content: 'My main concern is...',
    likes: 50,
    team: [
      { name: 'John Doe', avatar: 'https://randomuser.me/api/portraits/men/1.jpg' },
      { name: 'Samantha Pene', avatar: 'https://randomuser.me/api/portraits/women/2.jpg' },
    ],
    challenge: {
      title: 'Commodore Cup 2023 Sustainability Challenge',
      category: 'Social Innovation',
    },
    metrics: {
      status: 'Rejected',
      rate: 3.5,
    },
    feedback: {
      scalability: 3.5,
      sustainability: 3.5,
      innovation: 3.5,
      impact: 3.5,
    },
  };

  test('renders the ChallengeIdea component', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <ChallengeIdea idea={idea} isAdmin={true} isLoading={false} />
        </MemoryRouter>
      </Provider>
    );
    expect(screen.getByTestId('challenge-idea-component')).toBeInTheDocument();
  });

  test('displays organizer feedback when provided', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <ChallengeIdea idea={idea} isAdmin={false} isLoading={false} />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText('Scalability')).toBeInTheDocument();
    expect(screen.getByText('Sustainability')).toBeInTheDocument();
  });

  test('handles hover animation on card', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <ChallengeIdea idea={idea} isAdmin={false} isLoading={false} />
        </MemoryRouter>
      </Provider>
    );

    const card = screen.getByTestId('challenge-card');
    fireEvent.mouseOver(card);

    // Ensure the hover class is added (you need to implement this in your component)
    expect(card).toHaveClass('hover-animation');
  });

  test('displays unauthorized message if user lacks permission', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <ChallengeIdea idea={null} isAdmin={false} isLoading={false} />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText(/you are not authorized to view this challenge/i)).toBeInTheDocument();
  });

  test('shows feedback input for admin users', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <ChallengeIdea idea={idea} isAdmin={true} isLoading={false} />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByPlaceholderText(/add feedback/i)).toBeInTheDocument();
  });

  test('displays loading spinner when data is loading', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <ChallengeIdea idea={null} isAdmin={false} isLoading={true} />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });

  test('renders list of ideas associated with the challenge', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <ChallengeIdea idea={idea} isAdmin={false} isLoading={false} />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText('United by Better Coffee')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });
});
