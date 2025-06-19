import React, { useState } from 'react';
import CarSpecs from './CarSpecs';
import CarFeatures from './CarFeatures';
import CarFinance from './CarFinance';
import type { Car } from '@/types';

interface CarTabsProps {
    car: Car;
}

const CarTabs: React.FC<CarTabsProps> = ({ car }) => {
    const [activeTab, setActiveTab] = useState<string>('specs');

    return (
        <div className="detail-tabs">
            <div className="tabs is-boxed is-fullwidth">
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
                    <li className={activeTab === 'finance' ? 'is-active' : ''}>
                        <a onClick={() => setActiveTab('finance')}>
                            <span className="icon is-small"><i className="fas fa-calculator"></i></span>
                            <span>Financiamiento</span>
                        </a>
                    </li>
                </ul>
            </div>
            
            <div className="tab-content p-4">
                {activeTab === 'specs' && <CarSpecs car={car} />}
                {activeTab === 'features' && <CarFeatures />}
                {activeTab === 'finance' && <CarFinance car={car} />}
            </div>
        </div>
    );
};

export default CarTabs;