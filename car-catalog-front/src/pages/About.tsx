import React from 'react';
import { motion } from 'framer-motion';
import '../assets/styles/About.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRocket, faShieldAlt, faHandshake, faAward, faUsers, faCar, faGlobe, faEnvelope, faPhone, faMapMarkerAlt, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { faTwitter, faFacebook, faInstagram, faLinkedin } from '@fortawesome/free-brands-svg-icons';
import { slideUp, staggerContainer, scaleIn, fadeIn } from '../animations/variants'; // Added import

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
            <motion.section
                className="hero is-large has-bg-gradient"
                initial="hidden"
                animate="visible"
                variants={staggerContainer}
            >
                <div className="hero-body">
                    <div className="container has-text-centered">
                        <motion.div variants={scaleIn}>
                            <h1 className="title is-1 has-text-white mb-6 about-title-icon">
                                <FontAwesomeIcon icon={faInfoCircle} className="text-orange" />
                            </h1>
                        </motion.div>
                        <motion.p
                            variants={slideUp}
                            className="subtitle is-4 has-text-white-bis about-subtitle"
                        >
                            Tu destino premium para encontrar el vehículo perfecto. 
                            Combinamos tecnología de vanguardia con pasión por los automóviles.
                        </motion.p>
                    </div>
                </div>
            </motion.section>

            {/* Stats Section */}
            <section className="section stats-section-container">
                <div className="container">
                    <motion.div
                        className="columns is-multiline"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={staggerContainer}
                    >
                        {stats.map((stat, index) => (
                            <div key={index} className="column is-3-desktop is-6-tablet">
                                <div className="box has-text-centered stat-card">
                                    <span className="icon is-large has-text-warning mb-3">
                                        <FontAwesomeIcon icon={stat.icon} size="2x" />
                                    </span>
                                    <p className="title is-2 has-text-white mb-2 stat-value">
                                        {stat.value}
                                    </p>
                                    <p className="has-text-grey-light">{stat.label}</p>
                                </div>
                            </div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Mission Section */}
            <motion.section
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeIn}
                className="section"
                style={{ background: '#0a0a1a' }}
            >
                <div className="container">
                    <div className="columns is-vcentered">
                        <motion.div variants={slideUp} className="column is-6">
                            <h2 className="title is-2 has-text-white mb-4">
                                Nuestra <span className="text-orange">Misión</span>
                            </h2>
                            <p className="has-text-grey-light mb-4 mission-text">
                                En VeloDrive, creemos que encontrar tu próximo vehículo debería ser una experiencia 
                                emocionante, no estresante. Por eso hemos creado una plataforma que combina la mayor 
                                selección de vehículos con herramientas inteligentes de búsqueda.
                            </p>
                            <p className="has-text-grey-light mission-text">
                                Nuestro compromiso es conectar a compradores con vendedores de manera transparente, 
                                ofreciendo información detallada y verificada de cada vehículo para que puedas 
                                tomar decisiones informadas.
                            </p>
                        </motion.div>
                        <motion.div variants={scaleIn} className="column is-6">
                            <div className="mission-image-container">
                                <img 
                                    src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=600&h=400&fit=crop"
                                    alt="Luxury Car"
                                    className="mission-image"
                                />
                            </div>
                        </motion.div>
                    </div>
                </div>
            </motion.section>

            {/* Values Section */}
            <motion.section
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={staggerContainer}
                className="section values-section"
            >
                <div className="container">
                    <motion.div variants={slideUp} className="has-text-centered mb-6">
                        <h2 className="title is-2 has-text-white">
                            Nuestros <span className="text-orange">Valores</span>
                        </h2>
                        <p className="has-text-grey-light values-subtitle">
                            Los principios que guían cada decisión que tomamos
                        </p>
                    </motion.div>
                    <div className="columns is-multiline">
                        {values.map((value, index) => (
                            <motion.div key={index} variants={fadeIn} className="column is-6-tablet is-3-desktop">
                                <div className="box value-card">
                                    <span className="icon is-large has-text-warning mb-4 value-icon-wrapper">
                                        <FontAwesomeIcon icon={value.icon} size="lg" />
                                    </span>
                                    <h3 className="title is-5 has-text-white mb-3">{value.title}</h3>
                                    <p className="has-text-grey-light">{value.description}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </motion.section>

            {/* Team Section */}
            <motion.section
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={staggerContainer}
                className="section team-section"
            >
                <div className="container">
                    <motion.div variants={slideUp} className="has-text-centered mb-6">
                        <h2 className="title is-2 has-text-white">
                            Nuestro <span className="text-orange">Equipo</span>
                        </h2>
                        <p className="has-text-grey-light team-subtitle">
                            Profesionales apasionados por brindarte la mejor experiencia
                        </p>
                    </motion.div>
                    <div className="columns is-multiline is-centered">
                        {team.map((member, index) => (
                            <motion.div key={index} variants={fadeIn} className="column is-6-tablet is-3-desktop">
                                <div className="has-text-centered team-card">
                                    <figure className="image mb-4 team-image-wrapper">
                                        <img 
                                            src={member.image} 
                                            alt={member.name}
                                            className="team-image"
                                        />
                                    </figure>
                                    <h3 className="title is-5 has-text-white mb-1">{member.name}</h3>
                                    <p className="has-text-warning">{member.role}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </motion.section>

            {/* Contact Section */}
            <section className="section contact-section">
                <div className="container">
                    <div className="columns is-vcentered">
                        <div className="column is-6">
                            <h2 className="title is-2 has-text-white mb-4">
                                ¿Tienes <span className="text-orange">Preguntas</span>?
                            </h2>
                            <p className="has-text-grey-light mb-5 contact-text">
                                Estamos aquí para ayudarte. Contáctanos y te responderemos lo antes posible.
                            </p>
                            <div className="content">
                                <p className="has-text-white mb-3">
                                    <FontAwesomeIcon icon={faEnvelope} className="mr-3 text-orange" />
                                    contacto@velodrive.com
                                </p>
                                <p className="has-text-white mb-3">
                                    <FontAwesomeIcon icon={faPhone} className="mr-3 text-orange" />
                                    +1 (555) 123-4567
                                </p>
                                <p className="has-text-white mb-4">
                                    <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-3 text-orange" />
                                    123 Auto Drive, Miami, FL 33101
                                </p>
                            </div>
                            <div className="buttons">
                                <a href="#" className="button is-medium social-button">
                                    <FontAwesomeIcon icon={faTwitter} />
                                </a>
                                <a href="#" className="button is-medium social-button">
                                    <FontAwesomeIcon icon={faFacebook} />
                                </a>
                                <a href="#" className="button is-medium social-button">
                                    <FontAwesomeIcon icon={faInstagram} />
                                </a>
                                <a href="#" className="button is-medium social-button">
                                    <FontAwesomeIcon icon={faLinkedin} />
                                </a>
                            </div>
                        </div>
                        <div className="column is-6">
                            <div className="box contact-form-box">
                                <div className="field">
                                    <label className="label has-text-white">Nombre</label>
                                    <div className="control">
                                        <input className="input contact-input" type="text" placeholder="Tu nombre" />
                                    </div>
                                </div>
                                <div className="field">
                                    <label className="label has-text-white">Email</label>
                                    <div className="control">
                                        <input className="input contact-input" type="email" placeholder="tu@email.com" />
                                    </div>
                                </div>
                                <div className="field">
                                    <label className="label has-text-white">Mensaje</label>
                                    <div className="control">
                                        <textarea className="textarea contact-textarea" placeholder="¿En qué podemos ayudarte?"></textarea>
                                    </div>
                                </div>
                                <div className="field">
                                    <div className="control">
                                        <button className="button is-fullwidth submit-button">
                                            Enviar Mensaje
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

        </div>
    );
};

export default About;
