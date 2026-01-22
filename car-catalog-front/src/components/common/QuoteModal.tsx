import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { Car } from '@/types';
import { quoteService } from '../../services/api';

interface QuoteModalProps {
    isOpen: boolean;
    onClose: () => void;
    car: Car;
}

const QuoteModal: React.FC<QuoteModalProps> = ({ isOpen, onClose, car }) => {
    const [step, setStep] = useState(1); // 1: Datos, 2: Éxito
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        customerName: '',
        email: '',
        phone: '',
        downPayment: 20,
        term: 48
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await quoteService.requestQuote({
                carId: car.id.toString(),
                ...formData
            });
            setStep(2);
        } catch (error) {
            console.error('Error al solicitar cotización:', error);
            toast.error('Hubo un error al procesar tu solicitud. Por favor intenta de nuevo.');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className={`modal ${isOpen ? 'is-active' : ''}`}>
            <div className="modal-background modal-blur-bg" onClick={onClose}></div>
            <div className="modal-card quote-modal-card">
                {step === 1 ? (
                    <>
                        <header className="modal-card-head has-background-grey-darker modal-header-bordered">
                            <p className="modal-card-title has-text-white is-size-5">
                                <span className="icon mr-2 has-text-accent">
                                    <i className="fas fa-file-invoice-dollar"></i>
                                </span>
                                Solicitar Cotización Oficial
                            </p>
                            <button className="delete" aria-label="close" onClick={onClose}></button>
                        </header>
                        
                        <section className="modal-card-body has-background-grey-darker has-text-white">
                            <div className="is-flex is-align-items-center mb-5 p-3 car-summary-box">
                                <figure className="image is-64x64 mr-3 car-thumb-figure">
                                    <img src={car.image} alt={car.model} className="car-thumb-img" />
                                </figure>
                                <div style={{flex: 1}}>
                                    <p className="has-text-weight-bold is-size-6">{car.year} {car.make} {car.model}</p>
                                    <p className="has-text-accent has-text-weight-bold">
                                        Precio: ${car.price?.toLocaleString()}
                                    </p>
                                </div>
                            </div>

                            <form onSubmit={handleSubmit}>
                                <div className="field">
                                    <label className="label has-text-grey-light">Nombre Completo</label>
                                    <div className="control has-icons-left">
                                        <input 
                                            className="input has-background-grey-dark has-text-white has-border-grey" 
                                            type="text" 
                                            name="customerName"
                                            required
                                            value={formData.customerName}
                                            onChange={handleChange}
                                            placeholder="Ej. Juan Pérez" 
                                        />
                                        <span className="icon is-small is-left">
                                            <i className="fas fa-user"></i>
                                        </span>
                                    </div>
                                </div>

                                <div className="field">
                                    <label className="label has-text-grey-light">Correo Electrónico</label>
                                    <div className="control has-icons-left">
                                        <input 
                                            className="input has-background-grey-dark has-text-white has-border-grey" 
                                            type="email" 
                                            name="email"
                                            required
                                            value={formData.email}
                                            onChange={handleChange}
                                            placeholder="tu@email.com" 
                                        />
                                        <span className="icon is-small is-left">
                                            <i className="fas fa-envelope"></i>
                                        </span>
                                    </div>
                                    <p className="help is-dark">Te enviaremos el PDF a este correo.</p>
                                </div>

                                <div className="field">
                                    <label className="label has-text-grey-light">Teléfono</label>
                                    <div className="control has-icons-left">
                                        <input 
                                            className="input has-background-grey-dark has-text-white has-border-grey" 
                                            type="tel" 
                                            name="phone"
                                            required
                                            value={formData.phone}
                                            onChange={handleChange}
                                            placeholder="55 1234 5678" 
                                        />
                                        <span className="icon is-small is-left">
                                            <i className="fas fa-phone"></i>
                                        </span>
                                    </div>
                                </div>

                                <div className="columns is-mobile">
                                    <div className="column">
                                        <div className="field">
                                            <label className="label has-text-grey-light">Enganche (%)</label>
                                            <div className="control">
                                                <input 
                                                    className="input has-background-grey-dark has-text-white" 
                                                    type="number" 
                                                    name="downPayment"
                                                    min="10" max="90"
                                                    value={formData.downPayment}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="column">
                                        <div className="field">
                                            <label className="label has-text-grey-light">Plazo (meses)</label>
                                            <div className="control">
                                                <div className="select is-fullwidth is-dark">
                                                    <select 
                                                        name="term"
                                                        className="has-background-grey-dark has-text-white"
                                                        value={formData.term}
                                                        onChange={handleChange}
                                                    >
                                                        <option value="12">12 meses</option>
                                                        <option value="24">24 meses</option>
                                                        <option value="36">36 meses</option>
                                                        <option value="48">48 meses</option>
                                                        <option value="60">60 meses</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <button 
                                    className={`button is-primary is-fullwidth mt-4 quote-submit-btn ${loading ? 'is-loading' : ''}`}
                                >
                                    <span className="icon">
                                        <i className="fas fa-paper-plane"></i>
                                    </span>
                                    <span>Enviar Cotización</span>
                                </button>
                            </form>
                        </section>
                    </>
                ) : (
                    <section className="modal-card-body has-background-grey-darker has-text-white has-text-centered py-6">
                            <div className="icon is-large has-text-success mb-4 success-check-icon">
                            <i className="fas fa-check-circle"></i>
                        </div>
                        <h3 className="title is-4 has-text-white">¡Cotización Enviada!</h3>
                        <p className="subtitle is-6 has-text-grey-light mb-5">
                            Hemos enviado un PDF con los detalles a <strong>{formData.email}</strong>.
                        </p>
                        <p className="has-text-grey mb-6 is-size-7">
                            Un asesor de ventas revisará tu solicitud y te contactará brevemente.
                        </p>
                        <button 
                            className="button is-outlined is-white is-rounded"
                            onClick={onClose}
                        >
                            Cerrar
                        </button>
                    </section>
                )}
            </div>
        </div>
    );
};

export default QuoteModal;
