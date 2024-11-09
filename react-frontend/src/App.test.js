import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import store from './store';
import App from './App';

// Mock the components to isolate routing logic
jest.mock('./screens/home', () => () => <div>Home Component</div>);
jest.mock('./screens/discover', () => () => <div>Discover Component</div>);
jest.mock('./screens/login', () => () => <div>Login Component</div>);
jest.mock('./screens/signup', () => () => <div>Signup Component</div>);
jest.mock('./screens/challenge', () => () => <div>Challenge Component</div>);
jest.mock('./screens/idea', () => () => <div>Idea Component</div>);
jest.mock('./screens/challenge_idea', () => () => <div>ChallengeIdea Component</div>);
jest.mock('./screens/profile', () => () => <div>Profile Component</div>);
jest.mock('./screens/idea_space', () => () => <div>IdeaSpace Component</div>);

describe('App Component', () => {
  const renderApp = (initialRoute = '/') => {
    // Set the initial route
    window.history.pushState({}, 'Test page', initialRoute);

    return render(
      <Provider store={store}>
        <App />
      </Provider>
    );
  };

  test('renders Home component on default route "/"', () => {
    renderApp('/');
    expect(screen.getByText('Home Component')).toBeInTheDocument();
  });

  test('renders Discover component on route "/discover"', () => {
    renderApp('/discover');
    expect(screen.getByText('Discover Component')).toBeInTheDocument();
  });

  test('renders Login component on route "/login"', () => {
    renderApp('/login');
    expect(screen.getByText('Login Component')).toBeInTheDocument();
  });

  test('renders Signup component on route "/signup"', () => {
    renderApp('/signup');
    expect(screen.getByText('Signup Component')).toBeInTheDocument();
  });

  test('renders Challenge component on route "/challenge/:id"', () => {
    renderApp('/challenge/1');
    expect(screen.getByText('Challenge Component')).toBeInTheDocument();
  });

  test('renders Idea component on route "/idea"', () => {
    renderApp('/idea');
    expect(screen.getByText('Idea Component')).toBeInTheDocument();
  });

  test('renders ChallengeIdea component on route "/challenge_idea"', () => {
    renderApp('/challenge_idea');
    expect(screen.getByText('ChallengeIdea Component')).toBeInTheDocument();
  });

  test('renders Profile component on route "/profile"', () => {
    renderApp('/profile');
    expect(screen.getByText('Profile Component')).toBeInTheDocument();
  });

  test('renders IdeaSpace component on route "/idea-space/:topic"', () => {
    renderApp('/idea-space/some-topic');
    expect(screen.getByText('IdeaSpace Component')).toBeInTheDocument();
  });

  test('renders Home component on unknown route (default case)', () => {
    renderApp('/unknown-route');
    // Adjust this test if you have a 404 component or redirect behavior
    expect(screen.getByText('Home Component')).toBeInTheDocument();
  });
});
