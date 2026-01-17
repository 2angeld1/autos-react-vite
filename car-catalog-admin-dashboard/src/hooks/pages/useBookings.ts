import { useState, useMemo } from 'react';
import { Booking } from '@/services/bookings';

// Mock data integration option - we can switch to real API when ready
export const useBookings = () => {
  // In a real app, this would be fetched from API
  const [bookings, _setBookings] = useState<Booking[]>([
  {
    id: 'BK001',
    customer: {
      name: 'John Smith',
      email: 'john.smith@email.com',
      phone: '+1 555-0123',
    },
    car: {
      name: '2024 Toyota Camry',
      image: '/api/placeholder/100/60',
    },
    date: '2024-01-15',
    time: '10:00 AM',
    type: 'Test Drive',
    status: 'confirmed',
    notes: 'Customer interested in hybrid version',
  },
  {
    id: 'BK002',
    customer: {
      name: 'Sarah Johnson',
      email: 'sarah.j@email.com',
      phone: '+1 555-0456',
    },
    car: {
      name: '2024 BMW X5',
      image: '/api/placeholder/100/60',
    },
    date: '2024-01-15',
    time: '2:30 PM',
    type: 'Consultation',
    status: 'pending',
    notes: 'Looking for financing options',
  },
  {
    id: 'BK003',
    customer: {
      name: 'Michael Brown',
      email: 'm.brown@email.com',
      phone: '+1 555-0789',
    },
    car: {
      name: '2024 Tesla Model 3',
      image: '/api/placeholder/100/60',
    },
    date: '2024-01-16',
    time: '11:00 AM',
    type: 'Test Drive',
    status: 'completed',
    notes: 'Second visit, ready to purchase',
  },
  {
    id: 'BK004',
    customer: {
      name: 'Emily Davis',
      email: 'emily.d@email.com',
      phone: '+1 555-0321',
    },
    car: {
      name: '2024 Mercedes GLC',
      image: '/api/placeholder/100/60',
    },
    date: '2024-01-14',
    time: '4:00 PM',
    type: 'Service',
    status: 'cancelled',
    notes: 'Customer rescheduled',
  },
  {
    id: 'BK005',
    customer: {
      name: 'David Wilson',
      email: 'd.wilson@email.com',
      phone: '+1 555-0654',
    },
    car: {
      name: '2024 Audi Q7',
      image: '/api/placeholder/100/60',
    },
    date: '2024-01-17',
    time: '9:00 AM',
    type: 'Test Drive',
    status: 'confirmed',
    notes: 'VIP customer',
  },
  ]);
  
  const [loading, _setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');

  const filteredBookings = useMemo(() => bookings.filter(booking => {
    const matchesSearch = 
      booking.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.car.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'All' || booking.type === selectedType;
    const matchesStatus = selectedStatus === 'All' || booking.status === selectedStatus;
    return matchesSearch && matchesType && matchesStatus;
  }), [bookings, searchTerm, selectedType, selectedStatus]);

  const stats = useMemo(() => {
    return {
      todayCount: bookings.filter(b => b.date === '2024-01-15').length, // Hardcoded date for mock
      pendingCount: bookings.filter(b => b.status === 'pending').length,
      confirmedCount: bookings.filter(b => b.status === 'confirmed').length,
      totalCount: bookings.length
    }
  }, [bookings]);

  return {
    state: {
      bookings,
      loading,
      searchTerm,
      selectedType,
      selectedStatus,
      filteredBookings,
      stats
    },
    actions: {
      setSearchTerm,
      setSelectedType,
      setSelectedStatus,
    }
  };
};
