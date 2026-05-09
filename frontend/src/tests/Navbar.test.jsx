import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import Navbar from '../components/Navbar';
import { AuthContext } from '../context/AuthContext';

const renderWithAuth = (authValue) => {
  return render(
    <AuthContext.Provider value={authValue}>
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    </AuthContext.Provider>
  );
};

describe('Navbar', () => {
  it('renders logo', () => {
    renderWithAuth({ isAuthenticated: false, login: vi.fn(), logout: vi.fn() });
    expect(screen.getByText(/Hub/)).toBeInTheDocument();
  });

  it('shows login/signup links when not authenticated', () => {
    renderWithAuth({ isAuthenticated: false, login: vi.fn(), logout: vi.fn() });
    expect(screen.getByText('Login')).toBeInTheDocument();
    expect(screen.getByText('Sign Up')).toBeInTheDocument();
    expect(screen.getByText('Vendor')).toBeInTheDocument();
  });

  it('shows customer links when authenticated as customer', () => {
    renderWithAuth({
      isAuthenticated: true,
      userType: 'customer',
      login: vi.fn(),
      logout: vi.fn()
    });
    expect(screen.getByText('Services')).toBeInTheDocument();
    expect(screen.getByText('My Bookings')).toBeInTheDocument();
    expect(screen.getByText('Logout')).toBeInTheDocument();
  });

  it('shows vendor links when authenticated as vendor', () => {
    renderWithAuth({
      isAuthenticated: true,
      userType: 'vendor',
      login: vi.fn(),
      logout: vi.fn()
    });
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Logout')).toBeInTheDocument();
  });
});
