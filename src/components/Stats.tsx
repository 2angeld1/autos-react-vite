import React from 'react';

const Stats: React.FC = () => {
    return (
        <section className="section has-background-black-bis py-6">
            <div className="container">
                <div className="columns is-multiline">
                    <div className="column is-3 has-text-centered animate-fadeIn">
                        <div className="stat-circle">
                            <span className="stat-number">500+</span>
                            <span className="stat-label">Marcas</span>
                        </div>
                        <p className="mt-4 has-text-grey-light">Las mejores marcas del mercado</p>
                    </div>
                    <div className="column is-3 has-text-centered animate-fadeIn">
                        <div className="stat-circle">
                            <span className="stat-number">10K+</span>
                            <span className="stat-label">Modelos</span>
                        </div>
                        <p className="mt-4 has-text-grey-light">Gran variedad de vehículos</p>
                    </div>
                    <div className="column is-3 has-text-centered animate-fadeIn">
                        <div className="stat-circle">
                            <span className="stat-number">24/7</span>
                            <span className="stat-label">Soporte</span>
                        </div>
                        <p className="mt-4 has-text-grey-light">Atención personalizada</p>
                    </div>
                    <div className="column is-3 has-text-centered animate-fadeIn">
                        <div className="stat-circle">
                            <span className="stat-number">99%</span>
                            <span className="stat-label">Satisfacción</span>
                        </div>
                        <p className="mt-4 has-text-grey-light">Clientes satisfechos</p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Stats;