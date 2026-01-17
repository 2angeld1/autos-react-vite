import React from 'react';
import {
  CalendarCheck,
  Plus,
  Search,
  Filter
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '@/components/common/Button';
import { fadeIn, slideUp, scaleIn } from '@/animations/variants';
import { useBookings } from '@/hooks/pages/useBookings';
import StatsCards from '@/components/bookings/StatsCards';
import BookingCard from '@/components/bookings/BookingCard';

const bookingTypes = ['All', 'Test Drive', 'Consultation', 'Service'];

const Bookings: React.FC = () => {
  const { state, actions } = useBookings();
  const {
    searchTerm,
    selectedType,
    filteredBookings,
    stats
  } = state;

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
      <StatsCards stats={stats} />

      {/* Filters */}
      <motion.div variants={slideUp} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by customer, car or booking ID..."
              value={searchTerm}
              onChange={(e) => actions.setSearchTerm(e.target.value)}
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
                  onClick={() => actions.setSelectedType(type)}
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
          {filteredBookings.map(booking => (
            <BookingCard key={booking.id} booking={booking} />
          ))}
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
