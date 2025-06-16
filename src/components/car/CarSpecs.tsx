import React from 'react';
import type { Car } from '@/types';

interface CarSpecsProps {
    car: Car;
}

const CarSpecs: React.FC<CarSpecsProps> = ({ car }) => {
    return (
        <div id="especificaciones">
            <h4 className="title is-4 mb-4 has-text-white">Especificaciones Técnicas</h4>
            <div className="columns is-multiline">
                <div className="column is-6">
                    <div className="spec-box">
                        <h5 className="title is-5 has-text-accent">Motor</h5>
                        <div className="content">
                            <p>
                                <span className="spec-label">Tipo de combustible:</span> 
                                <span className="spec-value has-text-white">{car.fuel_type || 'No especificado'}</span>
                            </p>
                            <p>
                                <span className="spec-label">Cilindros:</span> 
                                <span className="spec-value has-text-white">{car.cylinders || 'No especificado'}</span>
                            </p>
                            {car.displacement && (
                                <p>
                                    <span className="spec-label">Desplazamiento:</span> 
                                    <span className="spec-value has-text-white">{car.displacement} L</span>
                                </p>
                            )}
                        </div>
                    </div>
                </div>
                
                <div className="column is-6">
                    <div className="spec-box">
                        <h5 className="title is-5 has-text-accent">Transmisión</h5>
                        <div className="content">
                            <p>
                                <span className="spec-label">Tipo:</span> 
                                <span className="spec-value has-text-white">
                                    {car.transmission === 'a' ? 'Automática' : 'Manual'}
                                </span>
                            </p>
                            {car.class && (
                                <p>
                                    <span className="spec-label">Tracción:</span> 
                                    <span className="spec-value has-text-white">
                                        {car.class.toLowerCase().includes('awd') ? 'AWD' : 
                                         car.class.toLowerCase().includes('4wd') ? '4WD' : 'FWD'}
                                    </span>
                                </p>
                            )}
                        </div>
                    </div>
                </div>
                
                <div className="column is-6">
                    <div className="spec-box">
                        <h5 className="title is-5 has-text-accent">Rendimiento</h5>
                        <div className="content">
                            {car.cylinders && car.displacement && (
                                <p>
                                    <span className="spec-label">Potencia estimada:</span> 
                                    <span className="spec-value has-text-white">
                                        {Math.round(car.displacement * car.cylinders * 25)} HP*
                                    </span>
                                </p>
                            )}
                            <p>
                                <span className="spec-label">Eficiencia:</span> 
                                <span className="spec-value has-text-white">
                                    {car.fuel_type === 'electricity' ? 'Eléctrico' :
                                     car.fuel_type === 'hybrid' ? 'Híbrido eficiente' :
                                     car.cylinders && car.cylinders <= 4 ? 'Económico' : 'Estándar'}
                                </span>
                            </p>
                            <p className="has-text-grey-light is-size-7">
                                *Estimación basada en especificaciones del motor
                            </p>
                        </div>
                    </div>
                </div>
                
                <div className="column is-6">
                    <div className="spec-box">
                        <h5 className="title is-5 has-text-accent">General</h5>
                        <div className="content">
                            <p>
                                <span className="spec-label">Clase:</span> 
                                <span className="spec-value has-text-white">{car.class || 'No especificada'}</span>
                            </p>
                            <p>
                                <span className="spec-label">Año:</span> 
                                <span className="spec-value has-text-white">{car.year}</span>
                            </p>
                            <p>
                                <span className="spec-label">Marca:</span> 
                                <span className="spec-value has-text-white">{car.make}</span>
                            </p>
                            <p>
                                <span className="spec-label">Modelo:</span> 
                                <span className="spec-value has-text-white">{car.model}</span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CarSpecs;