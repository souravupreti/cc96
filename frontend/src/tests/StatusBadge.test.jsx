import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import StatusBadge from '../components/StatusBadge';

describe('StatusBadge', () => {
  it('renders Pending status with correct text', () => {
    render(<StatusBadge status="Pending" />);
    expect(screen.getByText(/Pending/)).toBeInTheDocument();
  });

  it('renders Accepted status with correct text', () => {
    render(<StatusBadge status="Accepted" />);
    expect(screen.getByText(/Accepted/)).toBeInTheDocument();
  });

  it('renders Delivered status with correct text', () => {
    render(<StatusBadge status="Delivered" />);
    expect(screen.getByText(/Delivered/)).toBeInTheDocument();
  });

  it('applies pending styling for Pending', () => {
    const { container } = render(<StatusBadge status="Pending" />);
    const badge = container.querySelector('span');
    expect(badge.className).toContain('badge-pending');
  });

  it('applies accepted styling for Accepted', () => {
    const { container } = render(<StatusBadge status="Accepted" />);
    const badge = container.querySelector('span');
    expect(badge.className).toContain('badge-accepted');
  });

  it('applies delivered styling for Delivered', () => {
    const { container } = render(<StatusBadge status="Delivered" />);
    const badge = container.querySelector('span');
    expect(badge.className).toContain('badge-delivered');
  });

  it('handles unknown status gracefully', () => {
    render(<StatusBadge status="Unknown" />);
    expect(screen.getByText(/Unknown/)).toBeInTheDocument();
  });
});
