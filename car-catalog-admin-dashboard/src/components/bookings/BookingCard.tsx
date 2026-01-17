import React from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, Car, Calendar, Clock, Eye, Edit2, MoreVertical, CheckCircle, AlertCircle, XCircle } from 'lucide-react';
import Button from '@/components/common/Button';
import { cardHover, fadeIn } from '@/animations/variants';
import { Booking } from '@/services/bookings';

interface BookingCardProps {
  booking: Booking;
}

const statusConfig = {
  confirmed: { color: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300', icon: CheckCircle },
  pending: { color: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300', icon: AlertCircle },
  completed: { color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300', icon: CheckCircle },
  cancelled: { color: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300', icon: XCircle },
};

const BookingCard: React.FC<BookingCardProps> = ({ booking }) => {
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
};

export default BookingCard;
