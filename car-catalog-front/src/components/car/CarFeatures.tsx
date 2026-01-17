import React from 'react';
import { motion } from 'framer-motion';
import { fadeIn, staggerContainer, slideUp } from '../../animations/variants';

const CarFeatures: React.FC = () => {
    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
        >
            <motion.h4 variants={slideUp} className="title is-4 mb-4 has-text-white">Características</motion.h4>
            <div className="columns is-multiline">
                <motion.div variants={fadeIn} className="column is-6">
                    <div className="feature-card">
                        <div className="feature-icon">
                            <i className="fas fa-car"></i>
                        </div>
                        <div className="feature-content">
                            <h5 className="title is-5">Exterior</h5>
                            <ul className="feature-list">
                                <li>Faros LED</li>
                                <li>Rines de aleación</li>
                                <li>Espejos laterales eléctricos</li>
                                <li>Sunroof panorámico</li>
                                <li>Sensores de estacionamiento</li>
                            </ul>
                        </div>
                    </div>
                </motion.div>
                <motion.div variants={fadeIn} className="column is-6">
                    <div className="feature-card">
                        <div className="feature-icon">
                            <i className="fas fa-couch"></i>
                        </div>
                        <div className="feature-content">
                            <h5 className="title is-5">Interior</h5>
                            <ul className="feature-list">
                                <li>Asientos de cuero</li>
                                <li>Climatizador automático</li>
                                <li>Sistema de infoentretenimiento</li>
                                <li>Asientos calefactables</li>
                                <li>Volante multifunción</li>
                            </ul>
                        </div>
                    </div>
                </motion.div>
                <motion.div variants={fadeIn} className="column is-6">
                    <div className="feature-card">
                        <div className="feature-icon">
                            <i className="fas fa-shield-alt"></i>
                        </div>
                        <div className="feature-content">
                            <h5 className="title is-5">Seguridad</h5>
                            <ul className="feature-list">
                                <li>Frenos ABS</li>
                                <li>Control de estabilidad</li>
                                <li>Airbags múltiples</li>
                                <li>Cámara de reversa</li>
                                <li>Sistema de monitoreo de punto ciego</li>
                            </ul>
                        </div>
                    </div>
                </motion.div>
                <motion.div variants={fadeIn} className="column is-6">
                    <div className="feature-card">
                        <div className="feature-icon">
                            <i className="fas fa-laptop"></i>
                        </div>
                        <div className="feature-content">
                            <h5 className="title is-5">Tecnología</h5>
                            <ul className="feature-list">
                                <li>Conectividad Bluetooth</li>
                                <li>Apple CarPlay / Android Auto</li>
                                <li>Sistema de navegación GPS</li>
                                <li>Cargador inalámbrico</li>
                                <li>Sistema de audio premium</li>
                            </ul>
                        </div>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
};

export default CarFeatures;