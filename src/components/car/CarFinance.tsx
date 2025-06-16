import React from 'react';
import type { Car } from '@/types';

interface CarFinanceProps {
    car: Car;
}

const CarFinance: React.FC<CarFinanceProps> = ({ car }) => {
    const price = car.price || 0;
    const downPayment = price * 0.2;
    const estimatedMonthlyPayment = Math.round((price * 0.8) / 48 * 1.079);

    return (
        <div id="financiamiento">
            <h4 className="title is-4 mb-4">Opciones de Financiamiento</h4>
            <div className="columns">
                <div className="column is-5">
                    <div className="finance-card">
                        <h5 className="title is-5 mb-4">Calculadora de Pagos</h5>
                        <div className="field">
                            <label className="label">Precio del vehículo</label>
                            <div className="control">
                                <input className="input" type="text" value={price ? `$${price.toLocaleString()}` : 'Consultar'} readOnly />
                            </div>
                        </div>
                        <div className="field">
                            <label className="label">Enganche estimado (20%)</label>
                            <div className="control">
                                <input className="input is-warning has-text-weight-bold" type="text" value={price ? `$${downPayment.toLocaleString()}` : 'Consultar'} readOnly />
                            </div>
                        </div>
                        <div className="field">
                            <label className="label">Pago mensual estimado (48 meses)</label>
                            <div className="control">
                                <input className="input is-primary has-text-weight-bold" type="text" value={price ? `$${estimatedMonthlyPayment.toLocaleString()}` : 'Consultar'} readOnly />
                            </div>
                        </div>
                        <div className="has-text-centered mt-5">
                            <button className="button is-primary">
                                <span className="icon">
                                    <i className="fas fa-file-contract"></i>
                                </span>
                                <span>Solicitar financiamiento</span>
                            </button>
                        </div>
                    </div>
                </div>
                <div className="column is-7">
                    <div className="finance-info-card">
                        <h5 className="title is-5 mb-4">Beneficios de financiamiento</h5>
                        <ul className="benefits-list">
                            <li>
                                <i className="fas fa-check-circle"></i>
                                <span>Tasas competitivas desde 7.9%</span>
                            </li>
                            <li>
                                <i className="fas fa-check-circle"></i>
                                <span>Aprobación en 24 horas</span>
                            </li>
                            <li>
                                <i className="fas fa-check-circle"></i>
                                <span>Sin penalización por pago anticipado</span>
                            </li>
                            <li>
                                <i className="fas fa-check-circle"></i>
                                <span>Plazos flexibles de 24 a 72 meses</span>
                            </li>
                            <li>
                                <i className="fas fa-check-circle"></i>
                                <span>Incluye seguro por un año</span>
                            </li>
                        </ul>
                        <div className="mt-4 has-text-centered">
                            <button className="button is-outlined is-accent">
                                <span className="icon">
                                    <i className="fas fa-info-circle"></i>
                                </span>
                                <span>Más información</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <p className="has-text-grey is-size-7 mt-4 has-text-centered">*Los cálculos son aproximados. Consulta a un asesor para información exacta.</p>
        </div>
    );
};

export default CarFinance;