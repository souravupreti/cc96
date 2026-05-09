import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import OTPInput from '../components/OTPInput';

describe('OTPInput', () => {
  it('renders 6 input fields', () => {
    render(<OTPInput onChange={vi.fn()} />);
    const inputs = screen.getAllByPlaceholderText('-');
    expect(inputs).toHaveLength(6);
  });

  it('accepts numeric input', () => {
    const handleChange = vi.fn();
    render(<OTPInput onChange={handleChange} />);
    const inputs = screen.getAllByPlaceholderText('-');
    fireEvent.change(inputs[0], { target: { value: '1' } });
    expect(handleChange).toHaveBeenCalled();
  });

  it('rejects non-numeric input', () => {
    const handleChange = vi.fn();
    render(<OTPInput onChange={handleChange} />);
    const inputs = screen.getAllByPlaceholderText('-');
    fireEvent.change(inputs[0], { target: { value: 'a' } });
    expect(inputs[0].value).toBe('');
  });

  it('auto-focuses next input on entry', () => {
    render(<OTPInput onChange={vi.fn()} />);
    const inputs = screen.getAllByPlaceholderText('-');
    fireEvent.change(inputs[0], { target: { value: '1' } });
    // After entering first digit, the second input should be focused
    expect(document.activeElement).toBe(inputs[1]);
  });

  it('returns combined OTP string', () => {
    const handleChange = vi.fn();
    render(<OTPInput onChange={handleChange} />);
    const inputs = screen.getAllByPlaceholderText('-');
    fireEvent.change(inputs[0], { target: { value: '1' } });
    // The onChange should be called with partial OTP
    const lastCall = handleChange.mock.calls[handleChange.mock.calls.length - 1][0];
    expect(lastCall).toContain('1');
  });
});
