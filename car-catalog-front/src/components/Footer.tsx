import React from 'react';
import { Link } from 'react-router-dom';
import logoImg from '../assets/images/logo.png'; // Importamos el logo

const Footer: React.FC = () => {
    return (
        <footer className="footer">
            <div className="container">
                <div className="columns">
                    <div className="column is-4">
                        <div className="footer-logo-container">
                            <img 
                                src={logoImg} 
                                alt="Logo" 
                                className="footer-logo" 
                            />
                        </div>
                        <p className="mt-4 has-text-grey-light">
                            Tu destino preferido para encontrar el vehículo perfecto. Ofrecemos una amplia selección de automóviles de alta calidad para cada estilo y presupuesto.
                        </p>
                        <div className="social-icons mt-5">
                            <a href="#" className="social-icon">
                                <i className="fab fa-facebook-f"></i>
                            </a>
                            <a href="#" className="social-icon">
                                <i className="fab fa-twitter"></i>
                            </a>
                            <a href="#" className="social-icon">
                                <i className="fab fa-instagram"></i>
                            </a>
                            <a href="#" className="social-icon">
                                <i className="fab fa-youtube"></i>
                            </a>
                        </div>
                    </div>
                    
                    <div className="column is-2 is-offset-1">
                        <h3 className="footer-title">Explorar</h3>
                        <ul className="footer-links">
                            <li><Link to="/">Inicio</Link></li>
                            <li><Link to="/favorites">Favoritos</Link></li>
                            <li><Link to="/about">Acerca de</Link></li>
                            <li><a href="#search">Buscar</a></li>
                        </ul>
                    </div>

                    <div className="column is-2">
                        <h3 className="footer-title">Categorías</h3>
                        <ul className="footer-links">
                            <li><a href="#">Sedanes</a></li>
                            <li><a href="#">SUVs</a></li>
                            <li><a href="#">Deportivos</a></li>
                            <li><a href="#">Eléctricos</a></li>
                        </ul>
                    </div>

                    <div className="column is-3">
                        <h3 className="footer-title">Contacto</h3>
                        <ul className="footer-contact">
                            <li>
                                <span className="icon has-text-accent">
                                    <i className="fas fa-map-marker-alt"></i>
                                </span>
                                <span>Av. Principal #123, Ciudad</span>
                            </li>
                            <li>
                                <span className="icon has-text-accent">
                                    <i className="fas fa-phone"></i>
                                </span>
                                <span>+52 123 456 7890</span>
                            </li>
                            <li>
                                <span className="icon has-text-accent">
                                    <i className="fas fa-envelope"></i>
                                </span>
                                <span>info@autoshowcase.com</span>
                            </li>
                            <li>
                                <span className="icon has-text-accent">
                                    <i className="fas fa-clock"></i>
                                </span>
                                <span>Lun-Sáb: 9:00 - 18:00</span>
                            </li>
                        </ul>
                    </div>
                </div>
                
                <hr className="footer-divider" />
                
                <div className="level">
                    <div className="level-left">
                        <div className="level-item">
                            <p className="has-text-grey">
                                © {new Date().getFullYear()} AutoShowcase. Todos los derechos reservados.
                            </p>
                        </div>
                    </div>
                    <div className="level-right">
                        <div className="level-item">
                            <div className="footer-legal-links">
                                <a href="#">Términos de Uso</a>
                                <a href="#">Privacidad</a>
                                <a href="#">Cookies</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;