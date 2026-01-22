import React from 'react';

interface Testimonial {
    id: number;
    text: string;
    author: string;
    role: string;
    avatar: string;
}

const Testimonials: React.FC = () => {
    const testimonials: Testimonial[] = [
        {
            id: 1,
            text: "Encontré mi Toyota Corolla ideal gracias a este catálogo. La búsqueda fue muy intuitiva y los filtros me ayudaron a encontrar exactamente lo que necesitaba.",
            author: "María García",
            role: "Profesora",
            avatar: "https://randomuser.me/api/portraits/women/1.jpg"
        },
        {
            id: 2,
            text: "Excelente servicio. Pude comparar varios modelos de Kia antes de decidirme por el Civic. La información detallada me ayudó mucho en mi decisión.",
            author: "Carlos Rodríguez",
            role: "Ingeniero",
            avatar: "https://randomuser.me/api/portraits/men/2.jpg"
        },
        {
            id: 3,
            text: "Recomiendo totalmente este catálogo. La función de favoritos me permitió guardar mis opciones y compararlas luego con calma. ¡Imprescindible!",
            author: "Laura Martínez",
            role: "Diseñadora",
            avatar: "https://randomuser.me/api/portraits/women/3.jpg"
        }
    ];

    return (
        <section className="section">
            <div className="container">
                <h2 className="title is-2 has-text-centered animate-fadeIn section-title">
                    Lo que dicen nuestros usuarios
                </h2>
                <p className="subtitle has-text-centered has-text-grey-light mb-6">
                    Testimonios de personas que encontraron su auto ideal con nosotros
                </p>
                
                <div className="columns">
                    {testimonials.map(testimonial => (
                        <div key={testimonial.id} className="column is-4 animate-fadeIn">
                            <div className="testimonial">
                                <p className="has-text-grey-lighter mb-4">
                                    {testimonial.text}
                                </p>
                                <div className="testimonial-author">
                                    <img 
                                        src={testimonial.avatar} 
                                        alt={testimonial.author}
                                        className="testimonial-avatar"
                                    />
                                    <div>
                                        <p className="has-text-white has-text-weight-bold">{testimonial.author}</p>
                                        <p className="has-text-grey-light is-size-7">{testimonial.role}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Testimonials;