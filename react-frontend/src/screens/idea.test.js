import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import Idea from './idea';

const mockNavigate = jest.fn();

// Mock the router hooks
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

// Suppress warnings
const originalWarn = console.warn;
const originalError = console.error;
const originalLog = console.log;

beforeAll(() => {
  console.warn = (...args) => {
    if (
      typeof args[0] === 'string' && 
      (args[0].includes('React Router Future Flag Warning') ||
       args[0].includes('babel-preset-react-app') ||
       args[0].includes('@babel/plugin-proposal-private-property-in-object'))
    ) {
      return;
    }
    originalWarn.apply(console, args);
  };

  console.error = (...args) => {
    if (
      typeof args[0] === 'string' && 
      (args[0].includes('Warning: An update to') ||
       args[0].includes('Error: AggregateError') ||
       args[0].includes('Error logging out:'))
    ) {
      return;
    }
    originalError.apply(console, args);
  };

  // Suppress logging
  console.log = jest.fn();
});

afterAll(() => {
  console.warn = originalWarn;
  console.error = originalError;
  console.log = originalLog;
});

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('Idea Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Layout and Structure', () => {
    test('renders main layout elements', () => {
      renderWithRouter(<Idea />);
      
      expect(screen.getByRole('banner')).toBeInTheDocument();
      const mainContent = screen.getByTitle('Embedded Miro Board').parentElement;
      expect(mainContent).toHaveClass('flex-1');
      expect(screen.getByRole('contentinfo')).toBeInTheDocument();
    });

    test('renders logo with correct link', () => {
      renderWithRouter(<Idea />);
      
      const logoLink = screen.getByRole('link', { name: /wondry logo/i });
      const logo = screen.getByAltText('Wondry Logo');
      
      expect(logoLink).toHaveAttribute('href', '/');
      expect(logo).toHaveClass('h-8');
    });

    test('renders navigation links', () => {
      renderWithRouter(<Idea />);
      
      const homeLink = screen.getByRole('link', { name: /home/i });
      const discoverLink = screen.getByRole('link', { name: /discover/i });
      
      expect(homeLink).toHaveAttribute('href', '/');
      expect(discoverLink).toHaveAttribute('href', '/discover');
    });
  });

  describe('Header Icons', () => {
    test('renders search, bell, and menu icons', () => {
      renderWithRouter(<Idea />);
      
      const icons = document.querySelectorAll('.text-gray-500.cursor-pointer');
      expect(icons).toHaveLength(3);
      
      const searchIcon = document.querySelector('svg circle[cx="11"][cy="11"]');
      const bellIcon = document.querySelector('svg path[d*="M6 8"]');
      const menuIcon = document.querySelector('.md\\:hidden');
      
      expect(searchIcon).toBeInTheDocument();
      expect(bellIcon).toBeInTheDocument();
      expect(menuIcon).toBeInTheDocument();
    });

    test('menu icon is hidden on desktop and visible on mobile', () => {
      renderWithRouter(<Idea />);
      
      const menuIcon = document.querySelector('.md\\:hidden');
      expect(menuIcon).toBeInTheDocument();
      expect(menuIcon).toHaveClass('text-gray-500', 'cursor-pointer');
    });
  });

  describe('Profile Section', () => {
    test('renders profile button with correct styling', () => {
      renderWithRouter(<Idea />);
      
      const profileButton = screen.getByRole('button', { name: /profile/i });
      expect(profileButton).toHaveClass(
        'w-8',
        'h-8',
        'bg-gray-800',
        'rounded-full',
        'flex',
        'items-center',
        'justify-center',
        'text-white',
        'cursor-pointer'
      );
      expect(profileButton).toHaveTextContent('MM');
    });

    test('toggles profile menu visibility', async () => {
      renderWithRouter(<Idea />);
      
      const profileButton = screen.getByRole('button', { name: /profile/i });
      
      expect(screen.queryByText('Sign Out')).not.toBeInTheDocument();
      
      await act(async () => {
        fireEvent.click(profileButton);
      });

      expect(screen.getByText('Sign Out')).toBeInTheDocument();
    });
  });

  describe('Miro Board', () => {
    test('renders iframe with correct attributes', () => {
      renderWithRouter(<Idea />);
      
      const iframe = screen.getByTitle('Embedded Miro Board');
      expect(iframe).toBeInTheDocument();
      expect(iframe).toHaveAttribute('src', expect.stringContaining('miro.com'));
      expect(iframe).toHaveAttribute('frameBorder', '0');
      expect(iframe).toHaveAttribute('scrolling', 'no');
      expect(iframe).toHaveAttribute('allow', expect.stringContaining('fullscreen'));
      expect(iframe).toHaveAttribute('allowFullScreen');
      expect(iframe).toHaveClass('w-full', 'h-full');
    });
  });

  describe('Footer', () => {
    test('renders with correct content and styling', () => {
      renderWithRouter(<Idea />);
      
      const footer = screen.getByRole('contentinfo');
      expect(footer).toHaveClass('text-center', 'text-gray-500', 'text-sm', 'py-2');
      expect(footer).toHaveTextContent('Wondry © 2024');
    });
  });

  describe('Responsive Design', () => {
    test('navigation has correct responsive classes', () => {
      renderWithRouter(<Idea />);
      
      const nav = document.querySelector('nav');
      expect(nav).toHaveClass('hidden', 'md:flex');
    });
  });

  describe('Accessibility', () => {
    test('interactive elements have proper attributes', () => {
      renderWithRouter(<Idea />);
      
      const profileButton = screen.getByRole('button', { name: /profile/i });
      expect(profileButton).toHaveAttribute('role', 'button');
      expect(profileButton).toHaveAttribute('aria-label', 'Profile');
      
      const iframe = screen.getByTitle('Embedded Miro Board');
      expect(iframe).toHaveAttribute('title');
    });

    test('navigation is properly structured', () => {
      renderWithRouter(<Idea />);
      
      const nav = screen.getByRole('navigation');
      expect(nav).toBeInTheDocument();
      expect(nav.querySelectorAll('a')).toHaveLength(2);
    });
  });
});