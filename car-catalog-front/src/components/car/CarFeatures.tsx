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
            <motion.h4 variants={slideUp} className="title is-4 mb-4 has-text-white">Características Principales</motion.h4>
            <div className="columns is-multiline">
                <motion.div variants={fadeIn} className="column is-6">
                    <div className="feature-card">
                        <div className="feature-header">
                            <div className="icon-wrapper">
                                <i className="fas fa-car"></i>
                            </div>
                            <h5>Exterior</h5>
                        </div>
                        <div className="feature-content-body">
                            <ul className="feature-list">
                                <li>Faros LED de alto rendimiento</li>
                                <li>Rines de aleación ligera</li>
                                <li>Espejos laterales eléctricos abatibles</li>
                                <li>Sunroof panorámico con filtro UV</li>
                                <li>Sensores de estacionamiento delanteros y traseros</li>
                            </ul>
                        </div>
                    </div>
                </motion.div>

                <motion.div variants={fadeIn} className="column is-6">
                    <div className="feature-card">
                        <div className="feature-header">
                            <div className="icon-wrapper">
                                <i className="fas fa-couch"></i>
                            </div>
                            <h5>Interior</h5>
                        </div>
                        <div className="feature-content-body">
                            <ul className="feature-list">
                                <li>Asientos deportivos en cuero premium</li>
                                <li>Climatizador automático bi-zona</li>
                                <li>Iluminación ambiental personalizable</li>
                                <li>Asientos delanteros calefactables</li>
                                <li>Volante multifunción forrado en piel</li>
                            </ul>
                        </div>
                    </div>
                </motion.div>

                <motion.div variants={fadeIn} className="column is-6">
                    <div className="feature-card">
                        <div className="feature-header">
                            <div className="icon-wrapper">
                                <i className="fas fa-shield-alt"></i>
                            </div>
                            <h5>Seguridad</h5>
                        </div>
                        <div className="feature-content-body">
                            <ul className="feature-list">
                                <li>Sistema de frenos ABS + EBD</li>
                                <li>Control electrónico de estabilidad (ESP)</li>
                                <li>6 Airbags (Frontales, Laterales, Cortina)</li>
                                <li>Cámara de visión trasera 360°</li>
                                <li>Asistente de arranque en pendientes</li>
                            </ul>
                        </div>
                    </div>
                </motion.div>

                <motion.div variants={fadeIn} className="column is-6">
                    <div className="feature-card">
                        <div className="feature-header">
                            <div className="icon-wrapper">
                                <i className="fas fa-laptop"></i>
                            </div>
                            <h5>Tecnología</h5>
                        </div>
                        <div className="feature-content-body">
                            <ul className="feature-list">
                                <li>Sistema de infoentretenimiento de 10"</li>
                                <li>Conectividad Apple CarPlay y Android Auto</li>
                                <li>Sistema de sonido Premium Surround</li>
                                <li>Cargador inalámbrico para smartphone</li>
                                <li>Cluster de instrumentos digital</li>
                            </ul>
                        </div>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
};

export default CarFeatures;