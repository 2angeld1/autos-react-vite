import React from 'react';
import { motion } from 'framer-motion';
import type { Car } from '@/types';
import { slideUp, staggerContainer } from '../../animations/variants';

interface CarSpecsProps {
    car: Car;
}

const CarSpecs: React.FC<CarSpecsProps> = ({ car }) => {
    return (
        <motion.div
            id="especificaciones"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="specs-container-pro"
        >
            <motion.h4 variants={slideUp} className="title is-4 mb-5 has-text-white border-bottom-simple pb-3">
                Especificaciones Técnicas
            </motion.h4>

            <div className="columns is-multiline">
                {/* Motor Section */}
                <motion.div variants={slideUp} className="column is-6">
                    <div className="spec-group">
                        <div className="group-header">
                            <i className="fas fa-microchip mr-2"></i>
                            <span>Motor</span>
                        </div>
                        <div className="spec-items-grid">
                            <div className="spec-item-pro">
                                <span className="label-pro">Combustible</span>
                                <span className="value-pro">{car.fuel_type || 'N/A'}</span>
                            </div>
                            <div className="spec-item-pro">
                                <span className="label-pro">Cilindros</span>
                                <span className="value-pro">{car.cylinders || 'N/A'}</span>
                            </div>
                            {car.displacement && (
                                <div className="spec-item-pro">
                                    <span className="label-pro">Desplazamiento</span>
                                    <span className="value-pro">{car.displacement} L</span>
                                </div>
                            )}
                        </div>
                    </div>
                </motion.div>

                {/* Transmisión Section */}
                <motion.div variants={slideUp} className="column is-6">
                    <div className="spec-group">
                        <div className="group-header">
                            <i className="fas fa-exchange-alt mr-2"></i>
                            <span>Transmisión y Tracción</span>
                        </div>
                        <div className="spec-items-grid">
                            <div className="spec-item-pro">
                                <span className="label-pro">Transmisión</span>
                                <span className="value-pro">{car.transmission === 'a' ? 'Automática' : 'Manual'}</span>
                            </div>
                            {car.class && (
                                <div className="spec-item-pro">
                                    <span className="label-pro">Tracción</span>
                                    <span className="value-pro">
                                        {car.class.toLowerCase().includes('awd') ? 'AWD' : 
                                         car.class.toLowerCase().includes('4wd') ? '4WD' : 'FWD'}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                </motion.div>

                {/* Rendimiento Section */}
                <motion.div variants={slideUp} className="column is-6">
                    <div className="spec-group">
                        <div className="group-header">
                            <i className="fas fa-bolt mr-2"></i>
                            <span>Rendimiento</span>
                        </div>
                        <div className="spec-items-grid">
                            {car.cylinders && car.displacement && (
                                <div className="spec-item-pro">
                                    <span className="label-pro">Potencia (est.)</span>
                                    <span className="value-pro">{Math.round(car.displacement * car.cylinders * 25)} HP</span>
                                </div>
                            )}
                            <div className="spec-item-pro">
                                <span className="label-pro">Eficiencia</span>
                                <span className="value-pro">
                                    {car.fuel_type === 'electricity' ? 'E-Power' :
                                        car.fuel_type === 'hybrid' ? 'Híbrido' :
                                     car.cylinders && car.cylinders <= 4 ? 'Económico' : 'Estándar'}
                                </span>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* General Section */}
                <motion.div variants={slideUp} className="column is-6">
                    <div className="spec-group">
                        <div className="group-header">
                            <i className="fas fa-info-circle mr-2"></i>
                            <span>Detalles Generales</span>
                        </div>
                        <div className="spec-items-grid">
                            <div className="spec-item-pro">
                                <span className="label-pro">Categoría</span>
                                <span className="value-pro">{car.class || 'N/A'}</span>
                            </div>
                            <div className="spec-item-pro">
                                <span className="label-pro">Fabricación</span>
                                <span className="value-pro">{car.year}</span>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>

            <p className="has-text-grey-dark is-size-7 mt-4">
                * Las especificaciones pueden variar según la versión y equipamiento del vehículo.
            </p>
        </motion.div>
    );
};

export default CarSpecs;