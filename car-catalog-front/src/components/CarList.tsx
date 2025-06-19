import React from 'react';
import CarCard from './CarCard';
import { useCarContext } from '../context/CarContext';
import type { Car } from '@/types';

const CarList: React.FC = () => {
    const { cars, loading, error } = useCarContext();

    if (loading) return (
        <div className="has-text-centered p-6">
            <div className="button is-loading is-large is-white"></div>
            <p className="mt-4 is-size-5">Cargando automóviles...</p>
        </div>
    );
    
    if (error) return (
        <div className="notification is-danger is-light has-text-centered p-6">
            <p className="is-size-5">Error al cargar los autos: {error}</p>
            <button className="button is-danger mt-4">Reintentar</button>
        </div>
    );
    
    if (cars.length === 0) return (
        <div className="notification is-warning is-light has-text-centered p-6">
            <p className="is-size-5">No se encontraron automóviles con los filtros actuales.</p>
        </div>
    );

    return (
        <div className="columns is-multiline">
            {cars.map((car: Car) => (
                <CarCard key={car.id} car={car} />
            ))}
        </div>
    );
};

export default CarList;