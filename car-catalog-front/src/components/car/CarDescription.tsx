import React from 'react';
import type { Car } from '@/types';

interface CarDescriptionProps {
    car: Car;
}

const CarDescription: React.FC<CarDescriptionProps> = ({ car }) => {
    return (
        <div>
            <h3 className="title is-4 mb-3 has-text-accent">
                <span className="icon">
                    <i className="fas fa-info-circle"></i>
                </span>
                <span>Descripción</span>
            </h3>
            <p className="mb-4 has-text-white-bis has-text-centered">
                {car.description || `${car.make} ${car.model} ${car.year} con motor ${car.fuel_type} de ${car.cylinders} cilindros.`}
            </p>
            <p className="has-text-grey-light is-italic has-text-centered">
                Este vehículo se encuentra en excelentes condiciones, listo para entrega inmediata.
            </p>
            
            <div className="columns is-multiline mt-5">
                <div className="column is-6">
                    <div className="highlight-item">
                        <span className="icon has-text-accent">
                            <i className="fas fa-gas-pump"></i>
                        </span>
                        <div>
                            <p className="has-text-grey">Combustible</p>
                            <p className="has-text-white has-text-weight-bold">{car.fuel_type}</p>
                        </div>
                    </div>
                </div>
                <div className="column is-6">
                    <div className="highlight-item">
                        <span className="icon has-text-accent">
                            <i className="fas fa-cog"></i>
                        </span>
                        <div>
                            <p className="has-text-grey">Transmisión</p>
                            <p className="has-text-white has-text-weight-bold">
                                {car.transmission === 'a' ? 'Automática' : 'Manual'}
                            </p>
                        </div>
                    </div>
                </div>
                {car.displacement && (
                    <div className="column is-6">
                        <div className="highlight-item">
                            <span className="icon has-text-accent">
                                <i className="fas fa-tachometer-alt"></i>
                            </span>
                            <div>
                                <p className="has-text-grey">Desplazamiento</p>
                                <p className="has-text-white has-text-weight-bold">{car.displacement} L</p>
                            </div>
                        </div>
                    </div>
                )}
                {car.cylinders && (
                    <div className="column is-6">
                        <div className="highlight-item">
                            <span className="icon has-text-accent">
                                <i className="fas fa-compress-arrows-alt"></i>
                            </span>
                            <div>
                                <p className="has-text-grey">Cilindros</p>
                                <p className="has-text-white has-text-weight-bold">{car.cylinders}</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CarDescription;