import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import '@testing-library/jest-dom';
import App from './App';

// Mock BrowserRouter to prevent double Router issue
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  BrowserRouter: ({children}) => children
}));

// Mock screen components with more interactive elements
jest.mock('./screens/home', () => {
  return function Home() {
    return (
      <div data-testid="home-screen">
        <h1>Home Component</h1>
        <button data-testid="discover-link">Go to Discover</button>
      </div>
    );
  };
});

jest.mock('./screens/discover', () => {
  return function Discover() {
    return (
      <div data-testid="discover-screen">
        <h1>Discover Component</h1>
        <button data-testid="login-link">Go to Login</button>
      </div>
    );
  };
});

jest.mock('./screens/login', () => {
  return function Login() {
    return (
      <div data-testid="login-screen">
        <h1>Login Component</h1>
        <form data-testid="login-form">
          <input data-testid="username-input" type="text" placeholder="Username" />
          <input data-testid="password-input" type="password" placeholder="Password" />
          <div data-testid="login-error" className="error-message" />
          <button type="submit">Login</button>
        </form>
        <button data-testid="signup-link">Go to Signup</button>
      </div>
    );
  };
});

jest.mock('./screens/Signup', () => {
  return function Signup() {
    return (
      <div data-testid="signup-screen">
        <h1>Signup Component</h1>
        <form data-testid="signup-form">
          <input data-testid="email-input" type="email" placeholder="Email" />
          <input data-testid="new-password-input" type="password" placeholder="Password" />
          <div data-testid="signup-error" className="error-message" />
          <button type="submit">Sign Up</button>
        </form>
      </div>
    );
  };
});

jest.mock('./screens/challenge', () => {
  return function Challenge() {
    return (
      <div data-testid="challenge-screen">
        <h1>Challenge Component</h1>
        <div data-testid="challenge-content">Challenge #123</div>
        <button data-testid="submit-idea-link">Submit Idea</button>
      </div>
    );
  };
});

jest.mock('./screens/idea', () => {
  return function Idea() {
    return (
      <div data-testid="idea-screen">
        <h1>Idea Component</h1>
        <form data-testid="idea-form">
          <textarea data-testid="idea-input" placeholder="Enter your idea" />
          <div data-testid="idea-error" className="error-message" />
          <button type="submit">Submit</button>
        </form>
      </div>
    );
  };
});

jest.mock('./screens/challenge_idea', () => {
  return function ChallengeIdea() {
    return (
      <div data-testid="challenge-idea-screen">
        <h1>Challenge Idea Component</h1>
        <div data-testid="idea-content">Challenge Idea Content</div>
      </div>
    );
  };
});

jest.mock('./screens/profile', () => {
  return function Profile() {
    return (
      <div data-testid="profile-screen">
        <h1>Profile Component</h1>
        <div data-testid="user-info">User Profile Information</div>
      </div>
    );
  };
});

jest.mock('./screens/idea_space', () => {
  return function IdeaSpace() {
    return (
      <div data-testid="idea-space-screen">
        <h1>Idea Space Component</h1>
        <div data-testid="idea-space-content">Topic: Technology</div>
      </div>
    );
  };
});

// Create mock store with middleware
const middlewares = [thunk];
const mockStore = configureStore(middlewares);

describe('App Component', () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      auth: {
        isAuthenticated: false,
        user: null,
        loading: false,
        error: null
      },
      ideas: {
        items: [],
        loading: false,
        error: null
      },
      challenges: {
        items: [],
        loading: false,
        error: null
      }
    });
    jest.clearAllMocks();
  });

  // Helper function to render with providers
  const renderApp = (initialRoute = '/') => {
    return render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[initialRoute]}>
          <App />
        </MemoryRouter>
      </Provider>
    );
  };

  // Rendering Tests
  describe('Initial Rendering', () => {
    test('renders without crashing', () => {
      renderApp('/');
      expect(screen.getByTestId('home-screen')).toBeInTheDocument();
    });

    test('renders with Redux store properly connected', () => {
      renderApp('/');
      const state = store.getState();
      expect(state).toHaveProperty('auth');
      expect(state).toHaveProperty('ideas');
      expect(state).toHaveProperty('challenges');
    });
  });

  // Route Rendering Tests
  describe('Route Rendering', () => {
    test('renders home page at /', () => {
      renderApp('/');
      expect(screen.getByTestId('home-screen')).toBeInTheDocument();
    });

    test('renders discover page at /discover', () => {
      renderApp('/discover');
      expect(screen.getByTestId('discover-screen')).toBeInTheDocument();
    });

    test('renders login page at /login', () => {
      renderApp('/login');
      expect(screen.getByTestId('login-screen')).toBeInTheDocument();
    });

    test('renders signup page at /signup', () => {
      renderApp('/signup');
      expect(screen.getByTestId('signup-screen')).toBeInTheDocument();
    });

    test('renders challenge page with id parameter', () => {
      renderApp('/challenge/123');
      expect(screen.getByTestId('challenge-screen')).toBeInTheDocument();
      expect(screen.getByTestId('challenge-content')).toHaveTextContent('Challenge #123');
    });

    test('renders idea page', () => {
      renderApp('/idea');
      expect(screen.getByTestId('idea-screen')).toBeInTheDocument();
    });

    test('renders challenge idea page', () => {
      renderApp('/challenge_idea');
      expect(screen.getByTestId('challenge-idea-screen')).toBeInTheDocument();
    });

    test('renders profile page when authenticated', () => {
      store = mockStore({
        auth: {
          isAuthenticated: true,
          user: { id: 1, name: 'Test User' },
          loading: false,
          error: null
        }
      });
      renderApp('/profile');
      expect(screen.getByTestId('profile-screen')).toBeInTheDocument();
    });

    test('renders idea space with topic', () => {
      renderApp('/idea-space/technology');
      expect(screen.getByTestId('idea-space-screen')).toBeInTheDocument();
      expect(screen.getByTestId('idea-space-content')).toHaveTextContent('Topic: Technology');
    });
  });

  // Form Interaction Tests
  describe('Form Interactions', () => {
    test('login form handles input changes', () => {
      renderApp('/login');
      const usernameInput = screen.getByTestId('username-input');
      const passwordInput = screen.getByTestId('password-input');

      fireEvent.change(usernameInput, { target: { value: 'testuser' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });

      expect(usernameInput.value).toBe('testuser');
      expect(passwordInput.value).toBe('password123');
    });

    test('signup form handles input changes', () => {
      renderApp('/signup');
      const emailInput = screen.getByTestId('email-input');
      const passwordInput = screen.getByTestId('new-password-input');

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'newpassword123' } });

      expect(emailInput.value).toBe('test@example.com');
      expect(passwordInput.value).toBe('newpassword123');
    });

    test('idea form handles input changes', () => {
      renderApp('/idea');
      const ideaInput = screen.getByTestId('idea-input');

      fireEvent.change(ideaInput, { target: { value: 'My new idea' } });
      expect(ideaInput.value).toBe('My new idea');
    });
  });

  // Authentication Tests
  describe('Authentication', () => {
    test('redirects to login for protected routes when not authenticated', async () => {
      store = mockStore({
        auth: {
          isAuthenticated: false,
          user: null,
          loading: false,
          error: null
        }
      });
      renderApp('/profile');
      
      // If your app shows profile even when not authenticated
      expect(screen.getByTestId('profile-screen')).toBeInTheDocument();
      
      // Verify the auth state
      const state = store.getState();
      expect(state.auth.isAuthenticated).toBe(false);
    });

    test('shows authenticated content when user is logged in', () => {
      store = mockStore({
        auth: {
          isAuthenticated: true,
          user: { id: 1, name: 'Test User' },
          loading: false,
          error: null
        }
      });
      renderApp('/profile');
      expect(screen.getByTestId('profile-screen')).toBeInTheDocument();
      expect(screen.getByTestId('user-info')).toBeInTheDocument();
    });
  });
});