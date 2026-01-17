import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';
import Button from '@/components/common/Button';
import { motion } from 'framer-motion';
import { fadeIn, slideUp, scaleIn } from '@/animations/variants';

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          className="text-center"
        >
          {/* 404 Animation */}
          <motion.div variants={scaleIn} className="mx-auto h-32 w-32 text-primary-600 mb-8">
            <svg
              className="w-full h-full"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 0h6m-6 0h6M7 12h10M5 12h14M3 12h18"
              />
            </svg>
          </motion.div>

          {/* Error Message */}
          <motion.h1 variants={slideUp} className="text-9xl font-bold text-gray-300 mb-4">404</motion.h1>
          <motion.h2 variants={slideUp} className="text-3xl font-bold text-gray-900 mb-2">
            Page not found
          </motion.h2>
          <motion.p variants={slideUp} className="text-gray-600 mb-8">
            Sorry, we couldn't find the page you're looking for.
          </motion.p>

          {/* Action Buttons */}
          <motion.div variants={slideUp} className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => window.history.back()}
              variant="outline"
              icon={<ArrowLeft className="h-4 w-4" />}
            >
              Go Back
            </Button>
            <Link to="/dashboard">
              <Button icon={<Home className="h-4 w-4" />}>
                Go to Dashboard
              </Button>
            </Link>
          </motion.div>

          {/* Additional Help */}
          <motion.div variants={slideUp} className="mt-12 text-center">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              What you can do:
            </h3>
            <ul className="text-gray-600 space-y-2">
              <li>• Check the URL for typos</li>
              <li>• Go back to the previous page</li>
              <li>• Visit our dashboard to find what you need</li>
              <li>• Contact support if you think this is a mistake</li>
            </ul>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFound;