import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import VendorLogin from '../pages/VendorLogin';
import { AuthContext } from '../context/AuthContext';

vi.mock('../utils/api', () => ({
  default: {
    post: vi.fn()
  }
}));

const renderVendorLogin = () => {
  return render(
    <AuthContext.Provider value={{ isAuthenticated: false, login: vi.fn(), logout: vi.fn() }}>
      <MemoryRouter>
        <VendorLogin />
      </MemoryRouter>
    </AuthContext.Provider>
  );
};

describe('VendorLogin', () => {
  it('renders vendor login heading', () => {
    renderVendorLogin();
    expect(screen.getByText('Vendor Portal')).toBeInTheDocument();
  });

  it('renders email and password fields', () => {
    renderVendorLogin();
    expect(screen.getByPlaceholderText('vendor@example.com')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter password')).toBeInTheDocument();
  });

  it('shows test credentials', () => {
    renderVendorLogin();
    expect(screen.getByText(/vendor@test.com/)).toBeInTheDocument();
  });

  it('shows error with empty fields', () => {
    renderVendorLogin();
    fireEvent.click(screen.getByText('Login to Dashboard'));
    expect(screen.getByText('Email and password required')).toBeInTheDocument();
  });

  it('renders customer login link', () => {
    renderVendorLogin();
    expect(screen.getByText(/Back to Customer Login/i)).toBeInTheDocument();
  });
});
