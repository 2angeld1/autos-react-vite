import React, { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCarSide, faUser } from '@fortawesome/free-solid-svg-icons';

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
                    <Link className="navbar-item brand-logo" to="/">
                        <span className="icon has-text-accent mr-2">
                            <FontAwesomeIcon icon={faCarSide} />
                        </span>
                        <span className="brand-name">VeloDrive</span>
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
                        <NavLink className="navbar-item" to="/" end>
                            Inicio
                        </NavLink>
                        <NavLink className="navbar-item" to="/favorites">
                            Favoritos
                        </NavLink>
                        <NavLink className="navbar-item" to="/about">
                            Acerca de
                        </NavLink>
                        <div className="navbar-item">
                            <div className="buttons">
                                <a href="http://localhost:3001" className="button is-accent" target="_blank" rel="noopener noreferrer">
                                    <span className="icon">
                                        <FontAwesomeIcon icon={faUser} />
                                    </span>
                                    <span>Iniciar Sesión</span>
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