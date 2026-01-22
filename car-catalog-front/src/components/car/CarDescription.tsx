import React from 'react';
import type { Car } from '@/types';

interface CarDescriptionProps {
    car: Car;
}

const CarDescription: React.FC<CarDescriptionProps> = ({ car }) => {
    return (
        <div className="description-container">
            {/* Header con Badge */}
            <div className="is-flex is-justify-content-space-between is-align-items-center mb-5 wrap-mobile">
                <h3 className="title is-4 has-text-white mb-0">
                    <span className="icon-text">
                        <span className="icon has-text-accent mr-3">
                            <i className="fas fa-info-circle"></i>
                        </span>
                        <span>Información del Vehículo</span>
                    </span>
                </h3>
                {/* Badge Verificado Destacado */}
                <span className="tag is-success is-medium rounded-pill mt-mobile-2 has-text-weight-bold shadow-sm" style={{ boxShadow: '0 4px 10px rgba(72, 199, 116, 0.3)' }}>
                    <span className="icon mr-2"><i className="fas fa-check-circle"></i></span>
                    Verificado por VeloDrive
                </span>
            </div>

            {/* Cuerpo Principal Premium */}
            <div className="description-card p-5 mb-5" style={{
                background: 'linear-gradient(145deg, #1e1e1e 0%, #151515 100%)',
                borderRadius: '16px',
                border: '1px solid rgba(255,255,255,0.08)',
                boxShadow: '0 8px 30px rgba(0,0,0,0.2)'
            }}>
                <div className="columns is-vcentered">
                    <div className="column is-8">
                        <div className="description-text mb-5" style={{ fontSize: '1.1rem', lineHeight: '1.8', color: '#d0d0d0' }}>
                            <p className="mb-4">
                                {car.description && car.description.length > 50 ? car.description :
                                    `Este impresionante ${car.make} ${car.model} ${car.year} es la definición de ${car.class ? car.class.toLowerCase() : 'excelencia automotive'}. Combina un diseño exterior aerodinámico y moderno con un interior refinado, pensado para ofrecer el máximo confort tanto al conductor como a los pasajeros.`}
                            </p>
                            <p>
                                Bajo el capó, cuenta con un motor {car.fuel_type === 'electricity' ? 'eléctrico de alto rendimiento' : `${car.fuel_type} altamente eficiente`}, que entrega una respuesta suave y potente.
                                {car.transmission === 'a' ? ' Su transmisión automática garantiza cambios imperceptibles para una marcha fluida.' : ' Su transmisión manual ofrece un control total y deportivo.'}
                                Un vehículo que no solo cumple con las expectativas, sino que las supera, ideal para quienes buscan fiabilidad y estilo en un solo paquete.
                            </p>
                        </div>

                        {/* Tags Estilizados */}
                        <div className="tags are-medium">
                            <span className="tag is-primary is-light rounded-pill border-tag">
                                <span className="icon is-small mr-1"><i className="fas fa-shipping-fast"></i></span>
                                Entrega Inmediata
                            </span>
                            <span className="tag is-info is-light rounded-pill border-tag">
                                <span className="icon is-small mr-1"><i className="fas fa-certificate"></i></span>
                                Garantía Extendida
                            </span>
                            {car.year > 2020 &&
                                <span className="tag is-warning is-light rounded-pill border-tag">
                                    <span className="icon is-small mr-1"><i className="fas fa-star"></i></span>
                                    Estado Excelente
                                </span>
                            }
                        </div>
                    </div>

                    {/* Stats rápidos visuales */}
                    <div className="column is-4">
                        <div className="quick-stats p-4" style={{
                            background: 'rgba(255,255,255,0.03)',
                            borderRadius: '12px',
                            border: '1px solid rgba(255,255,255,0.05)'
                        }}>
                            <h6 className="is-size-7 has-text-grey-light is-uppercase mb-4" style={{ letterSpacing: '1px' }}>Resumen de Estado</h6>

                            <div className="is-flex is-align-items-center mb-4 pb-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                <div className="icon-box mr-3 has-text-success">
                                    <i className="fas fa-history fa-lg"></i>
                                </div>
                                <div>
                                    <p className="is-size-7 has-text-grey">Historial</p>
                                    <p className="has-text-white has-text-weight-bold">Sin Accidentes</p>
                                </div>
                            </div>

                            <div className="is-flex is-align-items-center mb-4 pb-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                <div className="icon-box mr-3 has-text-info">
                                    <i className="fas fa-key fa-lg"></i>
                                </div>
                                <div>
                                    <p className="is-size-7 has-text-grey">Llaves</p>
                                    <p className="has-text-white has-text-weight-bold">2 Copias Originales</p>
                                </div>
                            </div>

                            <div className="is-flex is-align-items-center">
                                <div className="icon-box mr-3 has-text-warning">
                                    <i className="fas fa-tools fa-lg"></i>
                                </div>
                                <div>
                                    <p className="is-size-7 has-text-grey">Mantenimiento</p>
                                    <p className="has-text-white has-text-weight-bold">Al día (Agencia)</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Grid de especificaciones clave */}
            <div className="desc-highlight-grid">
                <div className="desc-highlight-item">
                    <div className="desc-highlight-icon">
                        <i className="fas fa-gas-pump"></i>
                    </div>
                    <div className="desc-highlight-content">
                        <p className="label">Combustible</p>
                        <p className="value">{car.fuel_type}</p>
                    </div>
                </div>

                <div className="desc-highlight-item">
                    <div className="desc-highlight-icon">
                        <i className="fas fa-cog"></i>
                    </div>
                    <div className="desc-highlight-content">
                        <p className="label">Transmisión</p>
                        <p className="value">
                            {car.transmission === 'a' ? 'Automática' : 'Manual'}
                        </p>
                    </div>
                </div>

                {car.displacement && (
                    <div className="desc-highlight-item">
                        <div className="desc-highlight-icon">
                            <i className="fas fa-tachometer-alt"></i>
                        </div>
                        <div className="desc-highlight-content">
                            <p className="label">Motor</p>
                            <p className="value">{car.displacement}L</p>
                        </div>
                    </div>
                )}

                {car.class && (
                    <div className="desc-highlight-item">
                        <div className="desc-highlight-icon">
                            <i className="fas fa-car-side"></i>
                        </div>
                        <div className="desc-highlight-content">
                            <p className="label">Clase</p>
                            <p className="value">{car.class}</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CarDescription;