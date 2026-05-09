import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import BookingCard from '../components/BookingCard';

const mockBooking = {
  _id: 'b1',
  serviceId: { name: 'Home Cleaning', icon: '🧹' },
  customerId: { name: 'John Doe' },
  address: '123 Main St',
  date: '2026-06-01',
  time: '10:00',
  status: 'Pending'
};

describe('BookingCard', () => {
  it('renders service name', () => {
    render(<BookingCard booking={mockBooking} isVendor={false} />);
    expect(screen.getByText('Home Cleaning')).toBeInTheDocument();
  });

  it('renders address', () => {
    render(<BookingCard booking={mockBooking} isVendor={false} />);
    expect(screen.getByText('123 Main St')).toBeInTheDocument();
  });

  it('renders date and time', () => {
    render(<BookingCard booking={mockBooking} isVendor={false} />);
    expect(screen.getByText('2026-06-01')).toBeInTheDocument();
    expect(screen.getByText('10:00')).toBeInTheDocument();
  });

  it('renders status badge', () => {
    render(<BookingCard booking={mockBooking} isVendor={false} />);
    expect(screen.getByText(/Pending/)).toBeInTheDocument();
  });

  it('shows Accept button for vendor when Pending', () => {
    render(<BookingCard booking={mockBooking} isVendor={true} onAccept={vi.fn()} onDeliver={vi.fn()} />);
    expect(screen.getByText(/Accept Request/)).toBeInTheDocument();
  });

  it('shows Deliver button for vendor when Accepted', () => {
    const accepted = { ...mockBooking, status: 'Accepted' };
    render(<BookingCard booking={accepted} isVendor={true} onAccept={vi.fn()} onDeliver={vi.fn()} />);
    expect(screen.getByText(/Mark as Delivered/)).toBeInTheDocument();
  });

  it('hides action buttons for customers', () => {
    render(<BookingCard booking={mockBooking} isVendor={false} />);
    expect(screen.queryByText(/Accept/)).not.toBeInTheDocument();
    expect(screen.queryByText(/Mark Delivered/)).not.toBeInTheDocument();
  });

  it('shows customer name for vendor view', () => {
    render(<BookingCard booking={mockBooking} isVendor={true} onAccept={vi.fn()} onDeliver={vi.fn()} />);
    expect(screen.getByText(/John Doe/)).toBeInTheDocument();
  });

  it('handles missing serviceId gracefully', () => {
    const noService = { ...mockBooking, serviceId: null };
    render(<BookingCard booking={noService} isVendor={false} />);
    expect(screen.getByText('Service')).toBeInTheDocument();
  });
});
