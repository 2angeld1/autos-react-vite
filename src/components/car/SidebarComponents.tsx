import React from 'react';

interface Car {
    make: string;
    model: string;
    year: number;
}

interface SidebarComponentsProps {
    car: Car;
}

const SidebarComponents: React.FC<SidebarComponentsProps> = ({ car }) => {
    return (
        <>
            {/* Contacto */}
            <div className="detail-section" id="contacto">
                <h3 className="title is-4 mb-4 has-text-accent">¿Interesado?</h3>
                
                <div className="card contact-card mb-5">
                    <div className="card-content">
                        <div className="dealer-info mb-4">
                            <div className="dealer-avatar">
                                <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="Asesor de ventas" />
                            </div>
                            <div className="dealer-details">
                                <p className="has-text-white has-text-weight-bold is-size-5">Carlos Méndez</p>
                                <p className="has-text-grey-light">Asesor de ventas</p>
                                <div className="dealer-rating">
                                    <span className="icon has-text-warning">
                                        <i className="fas fa-star"></i>
                                    </span>
                                    <span className="icon has-text-warning">
                                        <i className="fas fa-star"></i>
                                    </span>
                                    <span className="icon has-text-warning">
                                        <i className="fas fa-star"></i>
                                    </span>
                                    <span className="icon has-text-warning">
                                        <i className="fas fa-star"></i>
                                    </span>
                                    <span className="icon has-text-warning">
                                        <i className="fas fa-star-half-alt"></i>
                                    </span>
                                    <span className="has-text-grey-light ml-2">(128)</span>
                                </div>
                            </div>
                        </div>
                        
                        <div className="buttons is-centered mb-4">
                            <a href="tel:+5215512345678" className="button is-accent is-medium is-fullwidth">
                                <span className="icon">
                                    <i className="fas fa-phone"></i>
                                </span>
                                <span>Llamar ahora</span>
                            </a>
                            <a href="https://wa.me/5215512345678" className="button is-success is-medium is-fullwidth">
                                <span className="icon">
                                    <i className="fab fa-whatsapp"></i>
                                </span>
                                <span>WhatsApp</span>
                            </a>
                        </div>
                    </div>
                </div>
                
                <div className="box contact-form-box">
                    <h4 className="title is-5 mb-3">Solicitar información</h4>
                    <div className="field">
                        <label className="label">Nombre</label>
                        <div className="control has-icons-left">
                            <input className="input" type="text" placeholder="Tu nombre" />
                            <span className="icon is-small is-left">
                                <i className="fas fa-user"></i>
                            </span>
                        </div>
                    </div>
                    <div className="field">
                        <label className="label">Email</label>
                        <div className="control has-icons-left">
                            <input className="input" type="email" placeholder="Tu email" />
                            <span className="icon is-small is-left">
                                <i className="fas fa-envelope"></i>
                            </span>
                        </div>
                    </div>
                    <div className="field">
                        <label className="label">Teléfono</label>
                        <div className="control has-icons-left">
                            <input className="input" type="tel" placeholder="Tu teléfono" />
                            <span className="icon is-small is-left">
                                <i className="fas fa-phone"></i>
                            </span>
                        </div>
                    </div>
                    <div className="field">
                        <label className="label">Mensaje</label>
                        <div className="control">
                            <textarea className="textarea" placeholder={`Me interesa el ${car.make} ${car.model} ${car.year}. Por favor contáctenme.`}></textarea>
                        </div>
                    </div>
                    <div className="field">
                        <div className="control">
                            <label className="checkbox">
                                <input type="checkbox" />
                                <span className="ml-2 has-text-grey-light is-size-7">Acepto recibir información sobre ofertas y promociones</span>
                            </label>
                        </div>
                    </div>
                    <div className="field is-grouped is-grouped-centered">
                        <div className="control">
                            <button className="button is-accent">Enviar</button>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Servicios adicionales */}
            <div className="detail-section">
                <h3 className="title is-4 mb-4 has-text-accent">Servicios adicionales</h3>
                
                <div className="service-cards">
                    <div className="service-card">
                        <div className="service-icon">
                            <i className="fas fa-car-crash"></i>
                        </div>
                        <div className="service-content">
                            <h4 className="has-text-white has-text-weight-bold">Seguro de auto</h4>
                            <p className="has-text-grey-light">Protege tu inversión con nuestras opciones de seguro.</p>
                            <a href="#" className="button is-small is-outlined is-accent mt-2">Más info</a>
                        </div>
                    </div>
                    
                    <div className="service-card">
                        <div className="service-icon">
                            <i className="fas fa-tools"></i>
                        </div>
                        <div className="service-content">
                            <h4 className="has-text-white has-text-weight-bold">Mantenimiento</h4>
                            <p className="has-text-grey-light">Paquetes de mantenimiento para tu nuevo vehículo.</p>
                            <a href="#" className="button is-small is-outlined is-accent mt-2">Más info</a>
                        </div>
                    </div>
                    
                    <div className="service-card">
                        <div className="service-icon">
                            <i className="fas fa-exchange-alt"></i>
                        </div>
                        <div className="service-content">
                            <h4 className="has-text-white has-text-weight-bold">Aceptamos tu auto</h4>
                            <p className="has-text-grey-light">Recibimos tu auto actual como parte de pago.</p>
                            <a href="#" className="button is-small is-outlined is-accent mt-2">Más info</a>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Banners promocionales */}
            <div className="promotion-banner mb-4">
                <h4 className="title is-5 has-text-white">Prueba de manejo</h4>
                <p className="has-text-white-bis mb-3">Agenda una prueba de manejo hoy mismo y vive la experiencia de conducir este {car.make} {car.model}.</p>
                <button className="button is-small is-secondary-accent">Agendar ahora</button>
            </div>
            
            <div className="promotion-banner">
                <h4 className="title is-5 has-text-white">¿Quieres vender tu auto?</h4>
                <p className="has-text-white-bis mb-3">Te damos el mejor precio por tu auto actual. Evaluación sin compromiso.</p>
                <button className="button is-small is-accent">Más información</button>
            </div>
        </>
    );
};

export default SidebarComponents;