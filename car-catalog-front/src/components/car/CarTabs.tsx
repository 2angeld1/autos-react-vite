import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CarSpecs from './CarSpecs';
import CarFeatures from './CarFeatures';
import CarReviews from './CarReviews';
import type { Car } from '@/types';

interface CarTabsProps {
    car: Car;
}

const CarTabs: React.FC<CarTabsProps> = ({ car }) => {
    const [activeTab, setActiveTab] = useState<string>('specs');

    const tabVariants = {
        hidden: { opacity: 0, x: -10 },
        visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
        exit: { opacity: 0, x: 10, transition: { duration: 0.2 } }
    };

    return (
        <div className="detail-tabs mt-4">
            <div className="tabs">
                <ul>
                    <li className={activeTab === 'specs' ? 'is-active' : ''}>
                        <a onClick={() => setActiveTab('specs')}>
                            <span className="icon is-small"><i className="fas fa-cogs"></i></span>
                            <span>Especificaciones</span>
                        </a>
                    </li>
                    <li className={activeTab === 'features' ? 'is-active' : ''}>
                        <a onClick={() => setActiveTab('features')}>
                            <span className="icon is-small"><i className="fas fa-list"></i></span>
                            <span>Características</span>
                        </a>
                    </li>
                    <li className={activeTab === 'reviews' ? 'is-active' : ''}>
                        <a onClick={() => setActiveTab('reviews')}>
                            <span className="icon is-small"><i className="fas fa-star"></i></span>
                            <span>Opiniones</span>
                        </a>
                    </li>
                </ul>
            </div>
            
            <div className="tab-content">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        variants={tabVariants}
                        className="p-4"
                    >
                        {activeTab === 'specs' && <CarSpecs car={car} />}
                        {activeTab === 'features' && <CarFeatures />}
                        {activeTab === 'reviews' && <CarReviews />}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
};

export default CarTabs;