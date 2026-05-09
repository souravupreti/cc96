import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import Signup from '../pages/Signup';
import { AuthContext } from '../context/AuthContext';

vi.mock('../utils/api', () => ({
  default: {
    post: vi.fn()
  }
}));

const renderSignup = () => {
  return render(
    <AuthContext.Provider value={{ isAuthenticated: false, login: vi.fn(), logout: vi.fn() }}>
      <MemoryRouter>
        <Signup />
      </MemoryRouter>
    </AuthContext.Provider>
  );
};

describe('Signup', () => {
  it('renders signup heading', () => {
    renderSignup();
    expect(screen.getByText('Create Account')).toBeInTheDocument();
  });

  it('renders step 1 - mobile input', () => {
    renderSignup();
    expect(screen.getByPlaceholderText(/10-digit mobile/)).toBeInTheDocument();
    expect(screen.getByText('Send OTP')).toBeInTheDocument();
  });

  it('validates mobile number format', async () => {
    renderSignup();
    const input = screen.getByPlaceholderText(/10-digit mobile/);
    fireEvent.change(input, { target: { value: '123' } });
    fireEvent.click(screen.getByText('Send OTP'));
    expect(screen.getByText('Mobile must be 10 digits')).toBeInTheDocument();
  });

  it('renders step indicator', () => {
    renderSignup();
    // Step 1 should be active
    expect(screen.getByText('1')).toBeInTheDocument();
  });

  it('renders login link', () => {
    renderSignup();
    expect(screen.getByText('Login')).toBeInTheDocument();
  });
});
