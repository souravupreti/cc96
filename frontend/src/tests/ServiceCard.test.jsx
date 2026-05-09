import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ServiceCard from '../components/ServiceCard';

const mockService = {
  _id: '1',
  name: 'Home Cleaning',
  description: 'Professional cleaning',
  basePrice: 500,
  icon: '🧹'
};

describe('ServiceCard', () => {
  it('renders service name', () => {
    render(<ServiceCard service={mockService} onClick={vi.fn()} />);
    expect(screen.getByText('Home Cleaning')).toBeInTheDocument();
  });

  it('renders service price', () => {
    render(<ServiceCard service={mockService} onClick={vi.fn()} />);
    expect(screen.getByText('₹500')).toBeInTheDocument();
  });

  it('renders service description', () => {
    render(<ServiceCard service={mockService} onClick={vi.fn()} />);
    expect(screen.getByText('Professional cleaning')).toBeInTheDocument();
  });

  it('renders service icon', () => {
    render(<ServiceCard service={mockService} onClick={vi.fn()} />);
    expect(screen.getByText('🧹')).toBeInTheDocument();
  });

  it('calls onClick when clicked', async () => {
    const handleClick = vi.fn();
    render(<ServiceCard service={mockService} onClick={handleClick} />);
    screen.getByText('Home Cleaning').closest('div').click();
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
