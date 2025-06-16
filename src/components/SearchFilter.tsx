import React, { useState } from 'react';
import type { SearchFilters } from '@/types';

interface SearchFilterProps {
    onSearch: (filters: SearchFilters) => void;
}

const SearchFilter: React.FC<SearchFilterProps> = ({ onSearch }) => {
    const [filters, setFilters] = useState<SearchFilters>({
        searchTerm: '',
        year: '',
        price: '',
        fuelType: 'any',
        transmission: 'any'
    });

    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        onSearch(filters);
    };

    const handleClear = () => {
        setFilters({
            searchTerm: '',
            year: '',
            price: '',
            fuelType: 'any',
            transmission: 'any'
        });
        // Opcional: también ejecutar búsqueda vacía
        onSearch({
            searchTerm: '',
            year: '',
            price: '',
            fuelType: 'any',
            transmission: 'any'
        });
    };

    return (
        <form onSubmit={handleSubmit} className="search-filter-form">
            <div className="columns is-multiline">
                <div className="column is-6-tablet is-3-desktop">
                    <div className="field">
                        <label className="label has-text-white">Marca y Modelo</label>
                        <div className="control has-icons-left">
                            <input 
                                className="input" 
                                type="text" 
                                name="searchTerm" 
                                placeholder="Ej. Toyota Corolla" 
                                value={filters.searchTerm}
                                onChange={handleFilterChange}
                            />
                            <span className="icon is-small is-left">
                                <i className="fas fa-car"></i>
                            </span>
                        </div>
                    </div>
                </div>

                <div className="column is-6-tablet is-3-desktop">
                    <div className="field">
                        <label className="label has-text-white">Año</label>
                        <div className="control">
                            <input 
                                className="input" 
                                type="number" 
                                name="year" 
                                placeholder="Ej. 2022" 
                                value={filters.year}
                                onChange={handleFilterChange}
                                min="1990"
                                max={new Date().getFullYear().toString()}
                            />
                        </div>
                    </div>
                </div>

                <div className="column is-6-tablet is-3-desktop">
                    <div className="field">
                        <label className="label has-text-white">Precio</label>
                        <div className="control has-icons-left">
                            <input 
                                className="input" 
                                type="number" 
                                name="price" 
                                placeholder="Presupuesto máximo" 
                                value={filters.price}
                                onChange={handleFilterChange}
                                min="0"
                            />
                            <span className="icon is-small is-left">
                                <i className="fas fa-dollar-sign"></i>
                            </span>
                        </div>
                    </div>
                </div>

                <div className="column is-6-tablet is-3-desktop">
                    <div className="field">
                        <label className="label has-text-white">Combustible</label>
                        <div className="control">
                            <div className="select is-fullwidth">
                                <select 
                                    name="fuelType" 
                                    value={filters.fuelType} 
                                    onChange={handleFilterChange}
                                >
                                    <option value="any">Todos</option>
                                    <option value="gas">Gasolina</option>
                                    <option value="diesel">Diesel</option>
                                    <option value="electricity">Eléctrico</option>
                                    <option value="hybrid">Híbrido</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="column is-6-tablet is-3-desktop">
                    <div className="field">
                        <label className="label has-text-white">Transmisión</label>
                        <div className="control">
                            <div className="select is-fullwidth">
                                <select 
                                    name="transmission" 
                                    value={filters.transmission} 
                                    onChange={handleFilterChange}
                                >
                                    <option value="any">Todas</option>
                                    <option value="a">Automática</option>
                                    <option value="m">Manual</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="column is-12 has-text-centered">
                    <div className="field is-grouped is-grouped-centered mt-4">
                        <div className="control">
                            <button 
                                type="submit" 
                                className="button is-accent is-medium"
                            >
                                <span className="icon">
                                    <i className="fas fa-search"></i>
                                </span>
                                <span>Buscar</span>
                            </button>
                        </div>
                        <div className="control">
                            <button 
                                type="button" 
                                className="button is-light is-medium"
                                onClick={handleClear}
                            >
                                <span className="icon">
                                    <i className="fas fa-times"></i>
                                </span>
                                <span>Limpiar</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    );
};

export default SearchFilter;