import React from 'react';
import type { Car } from '@/types';

interface QuoteBoxProps {
    car: Car;
    onQuoteClick: () => void;
}

// Caja de solicitar cotización
// Caja de solicitar cotización
export const QuoteBox: React.FC<QuoteBoxProps> = ({ car, onQuoteClick }) => {
    return (
        <div className="box mt-4 interest-box" style={{ backgroundColor: '#1a1a1a', border: '1px solid #2a2a2a', boxShadow: 'none' }}>
            <h4 className="title is-5 has-text-centered has-text-white mb-4">
                ¿Te interesa este auto?
            </h4>
            <button
                onClick={onQuoteClick}
                className="button is-danger is-fullwidth is-large animate-pulse quote-button"
            >
                <span className="icon">
                    <i className="fas fa-file-invoice-dollar"></i>
                </span>
                <span>Solicitar Cotización</span>
            </button>
            {car.price && (
                <p className="has-text-centered mt-3 has-text-grey is-size-7">
                    Precio Total: <span className="has-text-white has-text-weight-bold">${car.price.toLocaleString()}</span>
                </p>
            )}
        </div>
    );
};

interface ContactBoxProps {
    car: Car;
}

// Caja de contacto
export const ContactBox: React.FC<ContactBoxProps> = ({ car }) => {
    return (
        <div className="box mt-4" id="contact">
            <h4 className="title is-5">
                <span className="icon">
                    <i className="fas fa-phone"></i>
                </span>
                <span>Contactar Vendedor</span>
            </h4>
            <div className="content">
                <p className="has-text-grey-light mb-3">
                    ¿Interesado en este vehículo? Contáctanos para más información.
                </p>
                <div className="field">
                    <label className="label">Nombre</label>
                    <div className="control">
                        <input className="input" type="text" placeholder="Tu nombre" />
                    </div>
                </div>
                <div className="field">
                    <label className="label">Teléfono</label>
                    <div className="control">
                        <input className="input" type="tel" placeholder="Tu teléfono" />
                    </div>
                </div>
                <div className="field">
                    <label className="label">Mensaje</label>
                    <div className="control">
                        <textarea
                            className="textarea"
                            placeholder={`Hola, estoy interesado en el ${car.make} ${car.model} ${car.year}`}
                            rows={3}
                        ></textarea>
                    </div>
                </div>
                <div className="field">
                    <div className="control">
                        <button className="button is-accent is-fullwidth">
                            <span className="icon">
                                <i className="fas fa-paper-plane"></i>
                            </span>
                            <span>Enviar Mensaje</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

interface FinancingBoxProps {
    car: Car;
}

// Caja de financiamiento
export const FinancingBox: React.FC<FinancingBoxProps> = ({ car }) => {
    return (
        <div className="box mt-4" id="financing">
            <h4 className="title is-5">
                <span className="icon">
                    <i className="fas fa-calculator"></i>
                </span>
                <span>Calculadora de Financiamiento</span>
            </h4>
            <div className="content">
                {car.price ? (
                    <>
                        <div className="field">
                            <label className="label">Precio del vehículo</label>
                            <div className="control">
                                <input
                                    className="input"
                                    type="text"
                                    value={`$${car.price.toLocaleString()}`}
                                    readOnly
                                />
                            </div>
                        </div>
                        <div className="field">
                            <label className="label">Enganche (%)</label>
                            <div className="control">
                                <input className="input" type="number" defaultValue="20" min="0" max="100" />
                            </div>
                        </div>
                        <div className="field">
                            <label className="label">Plazo (meses)</label>
                            <div className="control">
                                <div className="select is-fullwidth">
                                    <select defaultValue="48">
                                        <option value="12">12 meses</option>
                                        <option value="24">24 meses</option>
                                        <option value="36">36 meses</option>
                                        <option value="48">48 meses</option>
                                        <option value="60">60 meses</option>
                                        <option value="72">72 meses</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className="field">
                            <div className="control">
                                <button className="button is-secondary-accent is-fullwidth">
                                    <span className="icon">
                                        <i className="fas fa-chart-line"></i>
                                    </span>
                                    <span>Calcular Pagos</span>
                                </button>
                            </div>
                        </div>
                    </>
                ) : (
                    <p className="has-text-grey-dark">
                        Contacta para información de precios y financiamiento.
                    </p>
                )}
            </div>
        </div>
    );
};

// Componente principal del Sidebar que agrupa todos
interface SidebarComponentsProps {
    car: Car;
    onQuoteClick: () => void;
}

const SidebarComponents: React.FC<SidebarComponentsProps> = ({ car, onQuoteClick }) => {
    return (
        <div className="sticky-sidebar">
            <QuoteBox car={car} onQuoteClick={onQuoteClick} />
            <ContactBox car={car} />
            <FinancingBox car={car} />
        </div>
    );
};

export default SidebarComponents;