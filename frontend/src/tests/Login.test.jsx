import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import Login from '../pages/Login';
import { AuthContext } from '../context/AuthContext';

vi.mock('../utils/api', () => ({
  default: {
    post: vi.fn()
  }
}));

const renderLogin = () => {
  return render(
    <AuthContext.Provider value={{ isAuthenticated: false, login: vi.fn(), logout: vi.fn() }}>
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    </AuthContext.Provider>
  );
};

describe('Login', () => {
  it('renders login heading', () => {
    renderLogin();
    expect(screen.getByText('Welcome Back')).toBeInTheDocument();
  });

  it('renders mobile and password fields', () => {
    renderLogin();
    expect(screen.getByPlaceholderText('10-digit mobile')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter password')).toBeInTheDocument();
  });

  it('renders login button', () => {
    renderLogin();
    expect(screen.getByText('Login Now')).toBeInTheDocument();
  });

  it('shows error with empty fields', async () => {
    renderLogin();
    fireEvent.click(screen.getByText('Login Now'));
    expect(screen.getByText('Mobile and password required')).toBeInTheDocument();
  });

  it('renders signup link', () => {
    renderLogin();
    expect(screen.getByText('Sign Up')).toBeInTheDocument();
  });

  it('renders vendor login link', () => {
    renderLogin();
    expect(screen.getByText(/Are you a Vendor/)).toBeInTheDocument();
  });
});
