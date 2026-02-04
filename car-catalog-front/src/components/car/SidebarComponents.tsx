import React, { useState } from 'react';
import type { Car } from '@/types';
import { toast } from 'react-hot-toast';
import { quoteService } from '@/services/api';

interface QuoteBoxProps {
    car: Car;
    onQuoteClick: () => void;
}

export const QuoteBox: React.FC<QuoteBoxProps> = ({ car, onQuoteClick }) => {
    return (
        <div className="box mt-4 interest-box">
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

export const ContactBox: React.FC<ContactBoxProps> = ({ car }) => {
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({ name: '', phone: '', message: '' });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.name || !form.phone) return toast.error('Por favor completa los campos');

        setLoading(true);
        try {
            // Reutilizamos el quoteService para registrar el contacto como un lead
            await quoteService.requestQuote({
                carId: car.id,
                customerName: form.name,
                email: 'contacto@vendedor.com', // Email ficticio para completar el modelo
                phone: form.phone,
                downPayment: 0,
                term: 0
            });
            toast.success('Mensaje enviado. Te contactaremos pronto.');
            setForm({ name: '', phone: '', message: '' });
        } catch (error) {
            toast.error('Error al enviar el mensaje');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="box mt-4" id="contact">
            <h4 className="title is-5">
                <span className="icon">
                    <i className="fas fa-phone"></i>
                </span>
                <span>Contactar Vendedor</span>
            </h4>
            <form onSubmit={handleSubmit} className="content">
                <p className="has-text-grey-light mb-3">
                    ¿Interesado en este vehículo? Contáctanos para más información.
                </p>
                <div className="field">
                    <label className="label">Nombre</label>
                    <div className="control">
                        <input
                            className="input"
                            type="text"
                            placeholder="Tu nombre"
                            value={form.name}
                            onChange={e => setForm({ ...form, name: e.target.value })}
                        />
                    </div>
                </div>
                <div className="field">
                    <label className="label">Teléfono</label>
                    <div className="control">
                        <input
                            className="input"
                            type="tel"
                            placeholder="Tu teléfono"
                            value={form.phone}
                            onChange={e => setForm({ ...form, phone: e.target.value })}
                        />
                    </div>
                </div>
                <div className="field">
                    <label className="label">Mensaje</label>
                    <div className="control">
                        <textarea
                            className="textarea"
                            placeholder={`Hola, estoy interesado en el ${car.make} ${car.model} ${car.year}`}
                            rows={3}
                            value={form.message}
                            onChange={e => setForm({ ...form, message: e.target.value })}
                        ></textarea>
                    </div>
                </div>
                <div className="field">
                    <div className="control">
                        <button className={`button is-accent is-fullwidth ${loading ? 'is-loading' : ''}`}>
                            <span className="icon">
                                <i className="fas fa-paper-plane"></i>
                            </span>
                            <span>Enviar Mensaje</span>
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

interface FinancingBoxProps {
    car: Car;
}

export const FinancingBox: React.FC<FinancingBoxProps> = ({ car }) => {
    const [downPaymentPerc, setDownPaymentPerc] = useState(20);
    const [term, setTerm] = useState(48);
    const [monthlyPayment, setMonthlyPayment] = useState<number | null>(null);

    const calculatePayment = () => {
        if (!car.price) return;
        const interestRate = 0.089; // 8.9% anual estimado
        const loanAmount = car.price * (1 - downPaymentPerc / 100);
        const monthlyRate = interestRate / 12;
        const payment = (loanAmount * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -term));
        setMonthlyPayment(payment);
        toast.success('Cálculo actualizado');
    };

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
                            <label className="label">Pago Inicial ({downPaymentPerc}%)</label>
                            <div className="control">
                                <input
                                    className="input" 
                                    type="range"
                                    min="10"
                                    max="80"
                                    step="5"
                                    value={downPaymentPerc}
                                    onChange={e => setDownPaymentPerc(Number(e.target.value))}
                                />
                                <p className="help is-white">${(car.price * (downPaymentPerc / 100)).toLocaleString()}</p>
                            </div>
                        </div>
                        <div className="field">
                            <label className="label">Plazo (meses)</label>
                            <div className="control">
                                <div className="select is-fullwidth">
                                    <select value={term} onChange={e => setTerm(Number(e.target.value))}>
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

                        {monthlyPayment && (
                            <div className="notification is-dark py-3 mb-4 has-text-centered border-accent">
                                <p className="mb-0 has-text-grey-light is-size-7">Mensualidad Estimada</p>
                                <p className="title is-4 has-text-accent">${monthlyPayment.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                            </div>
                        )}

                        <div className="field">
                            <div className="control">
                                <button
                                    onClick={calculatePayment}
                                    className="button is-secondary-accent is-fullwidth"
                                >
                                    <span className="icon">
                                        <i className="fas fa-chart-line"></i>
                                    </span>
                                    <span>Calcular Cuotas</span>
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