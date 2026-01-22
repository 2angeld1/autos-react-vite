import React, { useState } from 'react';
import type { SearchFilters } from '@/types';

interface SearchFilterProps {
    onSearch: (filters: SearchFilters) => void;
}

const SearchFilter: React.FC<SearchFilterProps> = ({ onSearch }) => {
    const [filters, setFilters] = useState<SearchFilters>({
        searchTerm: '',
        year: ''
    });

    const [isSearching, setIsSearching] = useState(false);

    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSearching(true);
        
        try {
            await onSearch(filters);
        } finally {
            setIsSearching(false);
        }
    };

    const handleClear = async () => {
        const emptyFilters = {
            searchTerm: '',
            year: ''
        };
        
        setFilters(emptyFilters);
        setIsSearching(true);
        
        try {
            await onSearch(emptyFilters);
        } finally {
            setIsSearching(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="search-filter-form">
            <div className="columns is-multiline">
                <div className="column is-6-tablet is-4-desktop">
                    <div className="field">
                        <label className="label has-text-white">
                            <span className="icon-text">
                                <span className="icon">
                                    <i className="fas fa-car"></i>
                                </span>
                                <span>Marca y Modelo</span>
                            </span>
                        </label>
                        <div className="control has-icons-left">
                            <input 
                                className="input" 
                                type="text" 
                                name="searchTerm" 
                                placeholder="Ej. Toyota Corolla, Kia Sportage" 
                                value={filters.searchTerm}
                                onChange={handleFilterChange}
                                disabled={isSearching}
                            />
                            <span className="icon is-small is-left">
                                <i className="fas fa-car"></i>
                            </span>
                        </div>
                        <p className="help has-text-grey-light">
                            Busca por marca (Toyota, Kia, Tesla) o marca + modelo
                        </p>
                    </div>
                </div>

                <div className="column is-6-tablet is-4-desktop">
                    <div className="field">
                        <label className="label has-text-white">
                            <span className="icon-text">
                                <span className="icon">
                                    <i className="fas fa-calendar-alt"></i>
                                </span>
                                <span>Año</span>
                            </span>
                        </label>
                        <div className="control">
                            <input 
                                className="input" 
                                type="number" 
                                name="year" 
                                placeholder="Ej. 2022, 2023, 2024" 
                                value={filters.year}
                                onChange={handleFilterChange}
                                min="1990"
                                max={new Date().getFullYear().toString()}
                                disabled={isSearching}
                            />
                        </div>
                        <p className="help has-text-grey-light">
                            Año del modelo (1990-{new Date().getFullYear()})
                        </p>
                    </div>
                </div>

                <div className="column is-12-tablet is-4-desktop has-text-centered">
                    <div className="field is-grouped is-grouped-centered mt-4">
                        <div className="control">
                            <button 
                                type="submit" 
                                className={`button is-accent is-medium ${isSearching ? 'is-loading' : ''}`}
                                disabled={isSearching}
                            >
                                <span className="icon">
                                    <i className="fas fa-search"></i>
                                </span>
                                <span>{isSearching ? 'Buscando...' : 'Buscar'}</span>
                            </button>
                        </div>
                        <div className="control">
                            <button 
                                type="button" 
                                className="button is-light is-medium"
                                onClick={handleClear}
                                disabled={isSearching}
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