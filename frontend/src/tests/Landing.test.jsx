import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import Landing from '../pages/Landing';
import { AuthContext } from '../context/AuthContext';

// Mock the api module
vi.mock('../utils/api', () => ({
  default: {
    get: vi.fn().mockResolvedValue({
      data: {
        services: [
          { _id: '1', name: 'Home Cleaning', description: 'Cleaning service', basePrice: 500, icon: '🧹' },
          { _id: '2', name: 'Plumbing', description: 'Plumbing service', basePrice: 700, icon: '🔧' }
        ]
      }
    })
  }
}));

const renderLanding = (authValue) => {
  return render(
    <AuthContext.Provider value={authValue}>
      <MemoryRouter>
        <Landing />
      </MemoryRouter>
    </AuthContext.Provider>
  );
};

describe('Landing', () => {
  it('renders hero heading', () => {
    renderLanding({ isAuthenticated: false, login: vi.fn(), logout: vi.fn() });
    expect(screen.getByText(/Book Home Services/)).toBeInTheDocument();
  });

  it('renders Get Started button when not logged in', () => {
    renderLanding({ isAuthenticated: false, login: vi.fn(), logout: vi.fn() });
    expect(screen.getByText(/Get Started Free/)).toBeInTheDocument();
  });

  it('renders Browse Services button when customer logged in', () => {
    renderLanding({
      isAuthenticated: true,
      userType: 'customer',
      login: vi.fn(),
      logout: vi.fn()
    });
    const buttons = screen.getAllByText('Browse Services →');
    expect(buttons.length).toBeGreaterThan(0);
  });

  it('renders How It Works section', () => {
    renderLanding({ isAuthenticated: false, login: vi.fn(), logout: vi.fn() });
    expect(screen.getByText('How It Works')).toBeInTheDocument();
  });

  it('renders Popular Services section', () => {
    renderLanding({ isAuthenticated: false, login: vi.fn(), logout: vi.fn() });
    expect(screen.getByText('Popular Services')).toBeInTheDocument();
  });

  it('renders stats section', () => {
    renderLanding({ isAuthenticated: false, login: vi.fn(), logout: vi.fn() });
    expect(screen.getByText('10K+')).toBeInTheDocument();
    expect(screen.getByText('500+')).toBeInTheDocument();
  });

  it('renders footer', () => {
    renderLanding({ isAuthenticated: false, login: vi.fn(), logout: vi.fn() });
    expect(screen.getByText(/© 2026 ServiceHub/)).toBeInTheDocument();
  });
});
