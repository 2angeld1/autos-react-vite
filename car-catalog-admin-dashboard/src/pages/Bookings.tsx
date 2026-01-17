import React, { useState } from 'react';
import {
  CalendarCheck,
  Plus,
  Search,
  Clock,
  User,
  Car,
  CheckCircle,
  XCircle,
  AlertCircle,
  Phone,
  Mail,
  Filter,
  MoreVertical,
  Eye,
  Edit2,
  Calendar
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '@/components/common/Button';
import { fadeIn, slideUp, staggerContainer, scaleIn, cardHover } from '@/animations/variants';

// Mock data for bookings
const mockBookings = [
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
];

const statusConfig = {
  confirmed: { color: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300', icon: CheckCircle },
  pending: { color: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300', icon: AlertCircle },
  completed: { color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300', icon: CheckCircle },
  cancelled: { color: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300', icon: XCircle },
};

const bookingTypes = ['All', 'Test Drive', 'Consultation', 'Service'];

const Bookings: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedStatus] = useState('All');

  const filteredBookings = mockBookings.filter(booking => {
    const matchesSearch = 
      booking.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.car.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'All' || booking.type === selectedType;
    const matchesStatus = selectedStatus === 'All' || booking.status === selectedStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  const todayCount = mockBookings.filter(b => b.date === '2024-01-15').length;
  const pendingCount = mockBookings.filter(b => b.status === 'pending').length;
  const confirmedCount = mockBookings.filter(b => b.status === 'confirmed').length;

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeIn}
      className="min-h-screen bg-gray-50 p-6"
    >
      {/* Header */}
      <motion.div variants={slideUp} className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <motion.div variants={scaleIn} className="p-2 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl text-white">
                <CalendarCheck className="h-7 w-7" />
              </motion.div>
              Bookings
            </h1>
            <p className="text-gray-500 mt-1">Manage test drives, consultations and appointments</p>
          </div>
          <Button
            variant="primary"
            icon={<Plus className="h-5 w-5" />}
          >
            New Booking
          </Button>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div variants={staggerContainer} className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <motion.div variants={scaleIn} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Today's Bookings</p>
              <p className="text-2xl font-bold text-gray-900">{todayCount}</p>
            </div>
            <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
              <Calendar className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
            </div>
          </div>
        </motion.div>

        <motion.div variants={scaleIn} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Pending</p>
              <p className="text-2xl font-bold text-amber-600">{pendingCount}</p>
            </div>
            <div className="p-3 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
              <AlertCircle className="h-6 w-6 text-amber-600 dark:text-amber-400" />
            </div>
          </div>
        </motion.div>

        <motion.div variants={scaleIn} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Confirmed</p>
              <p className="text-2xl font-bold text-green-600">{confirmedCount}</p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </motion.div>

        <motion.div variants={scaleIn} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Bookings</p>
              <p className="text-2xl font-bold text-gray-900">{mockBookings.length}</p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <CalendarCheck className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Filters */}
      <motion.div variants={slideUp} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by customer, car or booking ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>
          <div className="flex gap-4 flex-wrap">
            <div className="flex gap-2 items-center">
              <Filter className="h-5 w-5 text-gray-400" />
              <span className="text-sm text-gray-500">Type:</span>
              {bookingTypes.map(type => (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    selectedType === type
                      ? 'bg-emerald-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Bookings List */}
      <motion.div
        layout
        className="space-y-4"
      >
        <AnimatePresence>
          {filteredBookings.map(booking => {
            const StatusIcon = statusConfig[booking.status as keyof typeof statusConfig].icon;
            const statusColor = statusConfig[booking.status as keyof typeof statusConfig].color;

            return (
              <motion.div
                layout
                initial="hidden"
                animate="visible"
                exit="hidden"
                variants={fadeIn}
                whileHover="hover"
                key={booking.id}
              >
                <motion.div
                  variants={cardHover}
                  className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                    {/* Booking ID & Status */}
                    <div className="flex items-center gap-4 lg:w-48">
                      <div>
                        <p className="text-sm text-gray-500">Booking ID</p>
                        <p className="font-bold text-gray-900">{booking.id}</p>
                      </div>
                      <span className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${statusColor}`}>
                        <StatusIcon className="h-4 w-4" />
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </span>
                    </div>

                    {/* Customer Info */}
                    <div className="flex-1 lg:border-l lg:pl-4 border-gray-100">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
                          <User className="h-5 w-5 text-gray-400" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{booking.customer.name}</p>
                          <div className="flex items-center gap-3 text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                              <Mail className="h-3 w-3" />
                              {booking.customer.email}
                            </span>
                            <span className="flex items-center gap-1">
                              <Phone className="h-3 w-3" />
                              {booking.customer.phone}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Car Info */}
                    <div className="lg:border-l lg:pl-4 border-gray-100 lg:w-56">
                      <div className="flex items-center gap-3">
                        <div className="w-16 h-10 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center">
                          <Car className="h-5 w-5 text-gray-400" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{booking.car.name}</p>
                          <span className="text-xs px-2 py-0.5 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 rounded-full">
                            {booking.type}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Date & Time */}
                    <div className="lg:border-l lg:pl-4 border-gray-100 lg:w-40">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Calendar className="h-4 w-4" />
                        <span className="font-medium">{booking.date}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-500">
                        <Clock className="h-4 w-4" />
                        <span>{booking.time}</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 lg:border-l lg:pl-4 border-gray-100">
                      <Button variant="ghost" size="sm" icon={<Eye className="h-4 w-4" />}>
                        View
                      </Button>
                      <Button variant="ghost" size="sm" icon={<Edit2 className="h-4 w-4" />}>
                        Edit
                      </Button>
                      <button className="p-2 hover:bg-gray-100 rounded-lg">
                        <MoreVertical className="h-5 w-5 text-gray-400" />
                      </button>
                    </div>
                  </div>

                  {booking.notes && (
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <p className="text-sm text-gray-500">
                        <span className="font-medium">Notes:</span> {booking.notes}
                      </p>
                    </div>
                  )}
                </motion.div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>

      {filteredBookings.length === 0 && (
        <motion.div variants={fadeIn} className="text-center py-12">
          <CalendarCheck className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900">No bookings found</h3>
          <p className="text-gray-500">Try adjusting your search or filter criteria</p>
        </motion.div>
      )}
    </motion.div>
  );
};

export default Bookings;
