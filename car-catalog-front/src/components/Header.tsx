import React, { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faHeart, faInfoCircle, faHome, faTags, faWrench } from '@fortawesome/free-solid-svg-icons';

const Header: React.FC = () => {
    const [isActive, setIsActive] = useState<boolean>(false);
    const [scrolled, setScrolled] = useState<boolean>(false);

    // Handle the scroll event to change the navbar style
    useEffect(() => {
        const handleScroll = () => {
            const scrollPosition = window.scrollY;
            setScrolled(scrollPosition > 50);
        };

        window.addEventListener('scroll', handleScroll);

        // Cleanup the event listener
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <nav className={`navbar is-fixed-top ${scrolled ? 'is-scrolled' : 'is-transparent'}`} role="navigation" aria-label="main navigation">
            <div className="container">
                <div className="navbar-brand">
                    <Link className="navbar-item brand-logo" to="/" style={{ padding: '0.5rem' }}>
                        <img
                            src="/logo-transparent.png"
                            alt="VeloDrive"
                            style={{
                                height: '40px',
                                width: 'auto',
                                maxHeight: 'none',
                                objectFit: 'contain'
                            }}
                        />
                    </Link>

                    <a
                        role="button"
                        className={`navbar-burger ${isActive ? 'is-active' : ''}`}
                        aria-label="menu"
                        aria-expanded="false"
                        onClick={() => setIsActive(!isActive)}
                    >
                        <span aria-hidden="true"></span>
                        <span aria-hidden="true"></span>
                        <span aria-hidden="true"></span>
                    </a>
                </div>

                <div className={`navbar-menu ${isActive ? 'is-active' : ''}`}>
                    <div className="navbar-end">
                        <NavLink className="navbar-item nav-link-hover" to="/" end>
                            <FontAwesomeIcon icon={faHome} className="mr-2" style={{ fontSize: '0.85rem' }} />
                            Inicio
                        </NavLink>
                        <NavLink className="navbar-item nav-link-hover" to="/favorites">
                            <FontAwesomeIcon icon={faHeart} className="mr-2" style={{ fontSize: '0.85rem' }} />
                            Favoritos
                        </NavLink>
                        <NavLink className="navbar-item nav-link-hover" to="/about">
                            <FontAwesomeIcon icon={faInfoCircle} className="mr-2" style={{ fontSize: '0.85rem' }} />
                            Nosotros
                        </NavLink>
                        <NavLink className="navbar-item nav-link-hover" to="/promotions">
                            <FontAwesomeIcon icon={faTags} className="mr-2" style={{ fontSize: '0.85rem' }} />
                            Promociones
                        </NavLink>
                        <NavLink className="navbar-item nav-link-hover" to="/maintenance">
                            <FontAwesomeIcon icon={faWrench} className="mr-2" style={{ fontSize: '0.85rem' }} />
                            Mantenimiento
                        </NavLink>
                        <div className="navbar-item">
                            <div className="buttons">
                                <a
                                    href={import.meta.env.VITE_DASHBOARD_URL || 'http://localhost:3001'}
                                    className="button is-accent"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{
                                        // Usa la clase .is-accent (probablemente morado/rojizo)
                                        border: 'none',
                                        fontWeight: '600',
                                        letterSpacing: '0.02em',
                                        transition: 'all 0.3s ease'
                                    }}
                                >
                                    <span className="icon">
                                        <FontAwesomeIcon icon={faUser} />
                                    </span>
                                    <span>Admin</span>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Header;