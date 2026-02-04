import React, { useState, useEffect } from 'react';
import type { SearchFilters } from '@/types';
import { inventoryService, Category, Brand } from '../../services/api/inventoryService';

interface SearchFilterProps {
    onSearch: (filters: SearchFilters) => void;
}

const SearchFilter: React.FC<SearchFilterProps> = ({ onSearch }) => {
    const [filters, setFilters] = useState<SearchFilters>({
        searchTerm: '',
        make: '',
        category: '',
        year: '',
        transmission: '',
        fuelType: ''
    });

    const [categories, setCategories] = useState<Category[]>([]);
    const [brands, setBrands] = useState<Brand[]>([]);
    const [isSearching, setIsSearching] = useState(false);

    useEffect(() => {
        const loadFilterData = async () => {
            const [cats, brs] = await Promise.all([
                inventoryService.getCategories(),
                inventoryService.getBrands()
            ]);
            setCategories(cats);
            setBrands(brs);
        };
        loadFilterData();
    }, []);

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
            make: '',
            category: '',
            year: '',
            transmission: '',
            fuelType: ''
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
                {/* Búsqueda por Texto */}
                <div className="column is-6-tablet is-4-desktop">
                    <div className="field">
                        <label className="label has-text-white">Marca o Modelo</label>
                        <div className="control has-icons-left">
                            <input 
                                className="input" 
                                type="text" 
                                name="searchTerm" 
                                placeholder="Ej. Corolla, Civic..." 
                                value={filters.searchTerm}
                                onChange={handleFilterChange}
                            />
                            <span className="icon is-small is-left">
                                <i className="fas fa-search"></i>
                            </span>
                        </div>
                    </div>
                </div>

                {/* Marca Seleccionable */}
                <div className="column is-6-tablet is-2-desktop">
                    <div className="field">
                        <label className="label has-text-white">Marca</label>
                        <div className="control">
                            <div className="select is-fullwidth">
                                <select name="make" value={filters.make} onChange={handleFilterChange}>
                                    <option value="">Todas</option>
                                    {brands.map(b => (
                                        <option key={b._id} value={b.name}>{b.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Categoría Seleccionable */}
                <div className="column is-6-tablet is-2-desktop">
                    <div className="field">
                        <label className="label has-text-white">Categoría</label>
                        <div className="control">
                            <div className="select is-fullwidth">
                                <select name="category" value={filters.category} onChange={handleFilterChange}>
                                    <option value="">Todas</option>
                                    {categories.map(c => (
                                        <option key={c._id} value={c.name}>{c.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Año */}
                <div className="column is-6-tablet is-2-desktop">
                    <div className="field">
                        <label className="label has-text-white">Año</label>
                        <div className="control">
                            <input 
                                className="input" 
                                type="number" 
                                name="year" 
                                placeholder="Ej. 2024" 
                                value={filters.year}
                                onChange={handleFilterChange}
                            />
                        </div>
                    </div>
                </div>

                {/* Transmisión */}
                <div className="column is-6-tablet is-2-desktop">
                    <div className="field">
                        <label className="label has-text-white">Transmisión</label>
                        <div className="control">
                            <div className="select is-fullwidth">
                                <select name="transmission" value={filters.transmission} onChange={handleFilterChange}>
                                    <option value="">Todas</option>
                                    <option value="Automatic">Automática</option>
                                    <option value="Manual">Manual</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="columns mt-2">
                <div className="column is-12 has-text-centered">
                    <div className="field is-grouped is-grouped-centered">
                        <div className="control">
                            <button 
                                type="submit" 
                                className={`button is-accent is-medium is-px-5 ${isSearching ? 'is-loading' : ''}`}
                            >
                                <span className="icon"><i className="fas fa-search"></i></span>
                                <span>Buscar Vehículos</span>
                            </button>
                        </div>
                        <div className="control">
                            <button 
                                type="button" 
                                className="button is-light is-medium"
                                onClick={handleClear}
                            >
                                <span className="icon"><i className="fas fa-undo"></i></span>
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