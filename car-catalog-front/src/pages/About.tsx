import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faRocket,
    faShieldAlt,
    faHandshake,
    faAward,
    faUsers,
    faCar,
    faGlobe,
    faEnvelope,
    faPhone,
    faMapMarkerAlt
} from '@fortawesome/free-solid-svg-icons';
import {
    faTwitter,
    faFacebook,
    faInstagram,
    faLinkedin
} from '@fortawesome/free-brands-svg-icons';

const About: React.FC = () => {
    const stats = [
        { value: '15K+', label: 'Vehículos Vendidos', icon: faCar },
        { value: '98%', label: 'Clientes Satisfechos', icon: faUsers },
        { value: '50+', label: 'Marcas Disponibles', icon: faAward },
        { value: '12', label: 'Años de Experiencia', icon: faGlobe }
    ];

    const values = [
        {
            icon: faRocket,
            title: 'Innovación',
            description: 'Utilizamos las últimas tecnologías para ofrecerte la mejor experiencia de compra de vehículos.'
        },
        {
            icon: faShieldAlt,
            title: 'Confianza',
            description: 'Cada vehículo pasa por rigurosas inspecciones de calidad antes de ser publicado.'
        },
        {
            icon: faHandshake,
            title: 'Transparencia',
            description: 'Precios justos y toda la información que necesitas para tomar la mejor decisión.'
        },
        {
            icon: faAward,
            title: 'Excelencia',
            description: 'Comprometidos con ofrecer el mejor servicio y atención al cliente en la industria.'
        }
    ];

    const team = [
        {
            name: 'Carlos Mendoza',
            role: 'CEO & Fundador',
            image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face'
        },
        {
            name: 'María García',
            role: 'Directora de Ventas',
            image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&h=300&fit=crop&crop=face'
        },
        {
            name: 'Roberto Silva',
            role: 'Jefe de Tecnología',
            image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face'
        },
        {
            name: 'Ana Rodríguez',
            role: 'Atención al Cliente',
            image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face'
        }
    ];

    return (
        <div className="about-page">
            {/* Hero Section */}
            <section className="hero is-large has-bg-gradient">
                <div className="hero-body">
                    <div className="container has-text-centered">
                        <div className="mb-5">
                            <img 
                                src="/logo-transparent.png" 
                                alt="VeloDrive" 
                                style={{ height: '120px', marginBottom: '1.5rem' }}
                            />
                        </div>
                        <h1 className="title is-1 has-text-white mb-4" style={{
                            fontFamily: "'Orbitron', sans-serif",
                            fontSize: '3.5rem',
                            letterSpacing: '0.1em',
                            textShadow: '0 4px 30px rgba(0,0,0,0.3)'
                        }}>
                            VELODRIVE
                        </h1>
                        <p className="subtitle is-4 has-text-white-bis" style={{ maxWidth: '700px', margin: '0 auto' }}>
                            Tu destino premium para encontrar el vehículo perfecto. 
                            Combinamos tecnología de vanguardia con pasión por los automóviles.
                        </p>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="section" style={{ marginTop: '-80px', position: 'relative', zIndex: 10 }}>
                <div className="container">
                    <div className="columns is-multiline">
                        {stats.map((stat, index) => (
                            <div key={index} className="column is-3-desktop is-6-tablet">
                                <div className="box has-text-centered stat-card" style={{
                                    background: 'linear-gradient(145deg, #1a1a2e 0%, #16213e 100%)',
                                    border: '1px solid rgba(249, 115, 22, 0.3)',
                                    borderRadius: '16px',
                                    padding: '2rem'
                                }}>
                                    <span className="icon is-large has-text-warning mb-3">
                                        <FontAwesomeIcon icon={stat.icon} size="2x" />
                                    </span>
                                    <p className="title is-2 has-text-white mb-2" style={{
                                        fontFamily: "'Orbitron', sans-serif"
                                    }}>
                                        {stat.value}
                                    </p>
                                    <p className="has-text-grey-light">{stat.label}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Mission Section */}
            <section className="section" style={{ background: '#0a0a1a' }}>
                <div className="container">
                    <div className="columns is-vcentered">
                        <div className="column is-6">
                            <h2 className="title is-2 has-text-white mb-4">
                                Nuestra <span style={{ color: '#f97316' }}>Misión</span>
                            </h2>
                            <p className="has-text-grey-light mb-4" style={{ fontSize: '1.1rem', lineHeight: '1.8' }}>
                                En VeloDrive, creemos que encontrar tu próximo vehículo debería ser una experiencia 
                                emocionante, no estresante. Por eso hemos creado una plataforma que combina la mayor 
                                selección de vehículos con herramientas inteligentes de búsqueda.
                            </p>
                            <p className="has-text-grey-light" style={{ fontSize: '1.1rem', lineHeight: '1.8' }}>
                                Nuestro compromiso es conectar a compradores con vendedores de manera transparente, 
                                ofreciendo información detallada y verificada de cada vehículo para que puedas 
                                tomar decisiones informadas.
                            </p>
                        </div>
                        <div className="column is-6">
                            <div style={{
                                background: 'linear-gradient(135deg, rgba(249, 115, 22, 0.1) 0%, rgba(234, 88, 12, 0.05) 100%)',
                                borderRadius: '24px',
                                padding: '3rem',
                                border: '1px solid rgba(249, 115, 22, 0.2)'
                            }}>
                                <img 
                                    src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=600&h=400&fit=crop"
                                    alt="Luxury Car"
                                    style={{ borderRadius: '16px', width: '100%' }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section className="section" style={{ background: '#0f0f23' }}>
                <div className="container">
                    <div className="has-text-centered mb-6">
                        <h2 className="title is-2 has-text-white">
                            Nuestros <span style={{ color: '#f97316' }}>Valores</span>
                        </h2>
                        <p className="has-text-grey-light" style={{ maxWidth: '600px', margin: '0 auto' }}>
                            Los principios que guían cada decisión que tomamos
                        </p>
                    </div>
                    <div className="columns is-multiline">
                        {values.map((value, index) => (
                            <div key={index} className="column is-6-tablet is-3-desktop">
                                <div className="box value-card" style={{
                                    background: 'linear-gradient(145deg, #1a1a2e 0%, #0d0d1a 100%)',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    borderRadius: '16px',
                                    padding: '2rem',
                                    height: '100%',
                                    transition: 'all 0.3s ease'
                                }}>
                                    <span className="icon is-large has-text-warning mb-4" style={{
                                        background: 'rgba(249, 115, 22, 0.15)',
                                        borderRadius: '12px',
                                        width: '60px',
                                        height: '60px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        <FontAwesomeIcon icon={value.icon} size="lg" />
                                    </span>
                                    <h3 className="title is-5 has-text-white mb-3">{value.title}</h3>
                                    <p className="has-text-grey-light">{value.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Team Section */}
            <section className="section" style={{ background: '#0a0a1a' }}>
                <div className="container">
                    <div className="has-text-centered mb-6">
                        <h2 className="title is-2 has-text-white">
                            Nuestro <span style={{ color: '#f97316' }}>Equipo</span>
                        </h2>
                        <p className="has-text-grey-light" style={{ maxWidth: '600px', margin: '0 auto' }}>
                            Profesionales apasionados por brindarte la mejor experiencia
                        </p>
                    </div>
                    <div className="columns is-multiline is-centered">
                        {team.map((member, index) => (
                            <div key={index} className="column is-6-tablet is-3-desktop">
                                <div className="has-text-centered team-card" style={{
                                    padding: '2rem'
                                }}>
                                    <figure className="image mb-4" style={{ margin: '0 auto', maxWidth: '150px' }}>
                                        <img 
                                            src={member.image} 
                                            alt={member.name}
                                            style={{
                                                borderRadius: '50%',
                                                border: '3px solid #f97316',
                                                boxShadow: '0 8px 30px rgba(249, 115, 22, 0.3)'
                                            }}
                                        />
                                    </figure>
                                    <h3 className="title is-5 has-text-white mb-1">{member.name}</h3>
                                    <p className="has-text-warning">{member.role}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Contact Section */}
            <section className="section" style={{ 
                background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
                borderTop: '1px solid rgba(249, 115, 22, 0.2)'
            }}>
                <div className="container">
                    <div className="columns is-vcentered">
                        <div className="column is-6">
                            <h2 className="title is-2 has-text-white mb-4">
                                ¿Tienes <span style={{ color: '#f97316' }}>Preguntas</span>?
                            </h2>
                            <p className="has-text-grey-light mb-5" style={{ fontSize: '1.1rem' }}>
                                Estamos aquí para ayudarte. Contáctanos y te responderemos lo antes posible.
                            </p>
                            <div className="content">
                                <p className="has-text-white mb-3">
                                    <FontAwesomeIcon icon={faEnvelope} className="mr-3" style={{ color: '#f97316' }} />
                                    contacto@velodrive.com
                                </p>
                                <p className="has-text-white mb-3">
                                    <FontAwesomeIcon icon={faPhone} className="mr-3" style={{ color: '#f97316' }} />
                                    +1 (555) 123-4567
                                </p>
                                <p className="has-text-white mb-4">
                                    <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-3" style={{ color: '#f97316' }} />
                                    123 Auto Drive, Miami, FL 33101
                                </p>
                            </div>
                            <div className="buttons">
                                <a href="#" className="button is-medium" style={{
                                    background: 'transparent',
                                    border: '2px solid #f97316',
                                    color: '#f97316',
                                    borderRadius: '8px'
                                }}>
                                    <FontAwesomeIcon icon={faTwitter} />
                                </a>
                                <a href="#" className="button is-medium" style={{
                                    background: 'transparent',
                                    border: '2px solid #f97316',
                                    color: '#f97316',
                                    borderRadius: '8px'
                                }}>
                                    <FontAwesomeIcon icon={faFacebook} />
                                </a>
                                <a href="#" className="button is-medium" style={{
                                    background: 'transparent',
                                    border: '2px solid #f97316',
                                    color: '#f97316',
                                    borderRadius: '8px'
                                }}>
                                    <FontAwesomeIcon icon={faInstagram} />
                                </a>
                                <a href="#" className="button is-medium" style={{
                                    background: 'transparent',
                                    border: '2px solid #f97316',
                                    color: '#f97316',
                                    borderRadius: '8px'
                                }}>
                                    <FontAwesomeIcon icon={faLinkedin} />
                                </a>
                            </div>
                        </div>
                        <div className="column is-6">
                            <div className="box" style={{
                                background: 'rgba(255,255,255,0.03)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: '16px',
                                padding: '2rem'
                            }}>
                                <div className="field">
                                    <label className="label has-text-white">Nombre</label>
                                    <div className="control">
                                        <input className="input" type="text" placeholder="Tu nombre" style={{
                                            background: 'rgba(255,255,255,0.05)',
                                            border: '1px solid rgba(255,255,255,0.2)',
                                            color: 'white'
                                        }} />
                                    </div>
                                </div>
                                <div className="field">
                                    <label className="label has-text-white">Email</label>
                                    <div className="control">
                                        <input className="input" type="email" placeholder="tu@email.com" style={{
                                            background: 'rgba(255,255,255,0.05)',
                                            border: '1px solid rgba(255,255,255,0.2)',
                                            color: 'white'
                                        }} />
                                    </div>
                                </div>
                                <div className="field">
                                    <label className="label has-text-white">Mensaje</label>
                                    <div className="control">
                                        <textarea className="textarea" placeholder="¿En qué podemos ayudarte?" style={{
                                            background: 'rgba(255,255,255,0.05)',
                                            border: '1px solid rgba(255,255,255,0.2)',
                                            color: 'white',
                                            minHeight: '120px'
                                        }}></textarea>
                                    </div>
                                </div>
                                <div className="field">
                                    <div className="control">
                                        <button className="button is-fullwidth" style={{
                                            background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
                                            border: 'none',
                                            color: 'white',
                                            fontWeight: '600',
                                            padding: '1.5rem',
                                            borderRadius: '8px',
                                            boxShadow: '0 4px 20px rgba(249, 115, 22, 0.4)'
                                        }}>
                                            Enviar Mensaje
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <style>{`
                .about-page .has-bg-gradient {
                    background: linear-gradient(135deg, #0a0a1a 0%, #1a1a2e 50%, #0f0f23 100%);
                    position: relative;
                    overflow: hidden;
                }
                
                .about-page .has-bg-gradient::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: radial-gradient(circle at 30% 20%, rgba(249, 115, 22, 0.15) 0%, transparent 50%),
                                radial-gradient(circle at 70% 80%, rgba(234, 88, 12, 0.1) 0%, transparent 50%);
                }
                
                .about-page .stat-card:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 10px 40px rgba(249, 115, 22, 0.2);
                }
                
                .about-page .value-card:hover {
                    transform: translateY(-5px);
                    border-color: rgba(249, 115, 22, 0.5) !important;
                    box-shadow: 0 10px 40px rgba(249, 115, 22, 0.15);
                }
                
                .about-page .team-card:hover img {
                    transform: scale(1.05);
                    box-shadow: 0 12px 40px rgba(249, 115, 22, 0.4);
                }
                
                .about-page .team-card img {
                    transition: all 0.3s ease;
                }
            `}</style>
        </div>
    );
};

export default About;
