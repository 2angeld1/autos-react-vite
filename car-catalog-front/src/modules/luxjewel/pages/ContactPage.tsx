import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, MessageCircle } from 'lucide-react';
import { JewelLayout } from '../layout/JewelLayout';

const ContactPage = () => {
    return (
        <JewelLayout>
            {/* Header Space */}
            <div className="h-32" />

            {/* Main Content */}
            <section className="py-20 px-8 bg-[#0a090c]">
                <div className="container mx-auto max-w-7xl">
                    <div className="grid lg:grid-cols-2 gap-24">

                        {/* Info Column */}
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="space-y-12"
                        >
                            <div>
                                <p className="text-[10px] tracking-[0.5em] uppercase text-[#C9A84C] mb-6">Contacto Directo</p>
                                <h1 className="text-5xl md:text-7xl font-bold italic text-white tracking-widest mb-8">E-Boutique</h1>
                                <p className="text-gray-400 font-sans text-lg leading-relaxed max-w-lg">
                                    Nuestros asesores de la Maison están a su entera disposición para guiarle en la elección de su pieza perfecta o resolver cualquier duda técnica.
                                </p>
                            </div>

                            <div className="grid sm:grid-cols-2 gap-10">
                                <div className="space-y-4">
                                    <h4 className="text-[10px] font-bold tracking-[0.3em] uppercase text-white font-sans">Llamada Privada</h4>
                                    <div className="flex items-center gap-4 text-gray-500 hover:text-[#C9A84C] transition-colors cursor-pointer group">
                                        <Phone className="w-4 h-4 text-[#C9A84C]" />
                                        <span className="text-sm font-sans">+33 1 42 60 34 00</span>
                                    </div>
                                    <p className="text-[10px] text-gray-600 uppercase tracking-widest leading-none">Lunes a Sábado • 10h - 19h CET</p>
                                </div>
                                <div className="space-y-4">
                                    <h4 className="text-[10px] font-bold tracking-[0.3em] uppercase text-white font-sans">Email Boutique</h4>
                                    <div className="flex items-center gap-4 text-gray-500 hover:text-[#C9A84C] transition-colors cursor-pointer group">
                                        <Mail className="w-4 h-4 text-[#C9A84C]" />
                                        <span className="text-sm font-sans">concierge@luxjewel.com</span>
                                    </div>
                                </div>
                            </div>

                            <div className="p-8 border border-[#C9A84C]/10 bg-[#0d0c11]/50 space-y-6">
                                <h4 className="text-xs font-bold tracking-[0.2em] uppercase text-white font-sans flex items-center gap-3">
                                    <MessageCircle className="w-4 h-4 text-[#C9A84C]" />
                                    Conserjería en vivo
                                </h4>
                                <p className="text-gray-400 text-sm font-sans italic">
                                    Inicie un chat directo con un experto gemólogo para recibir fotografías adicionales del producto en tiempo real.
                                </p>
                                <button className="w-full py-4 border border-[#C9A84C]/30 text-[#C9A84C] text-[10px] tracking-[0.3em] font-bold uppercase hover:bg-[#C9A84C]/5 transition-all">
                                    Iniciar Conversación
                                </button>
                            </div>
                        </motion.div>

                        {/* Form Column */}
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-[#08070d] p-10 md:p-16 border border-white/5 relative"
                        >
                            <h3 className="text-2xl font-bold italic text-white tracking-widest mb-10 text-center uppercase">Solicitud de Información</h3>
                            <form className="space-y-8">
                                <div className="grid md:grid-cols-2 gap-8">
                                    <div className="space-y-2">
                                        <label className="text-[9px] tracking-[0.3em] uppercase text-gray-500 font-sans">Nombre Completo</label>
                                        <input type="text" className="w-full bg-transparent border-b border-white/10 py-3 text-white outline-none focus:border-[#C9A84C] transition-colors font-sans text-sm" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[9px] tracking-[0.3em] uppercase text-gray-500 font-sans">Correo Electrónico</label>
                                        <input type="email" className="w-full bg-transparent border-b border-white/10 py-3 text-white outline-none focus:border-[#C9A84C] transition-colors font-sans text-sm" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[9px] tracking-[0.3em] uppercase text-gray-500 font-sans">Pieza de Interés / Referencia</label>
                                    <input type="text" className="w-full bg-transparent border-b border-white/10 py-3 text-white outline-none focus:border-[#C9A84C] transition-colors font-sans text-sm" placeholder="Ej: Anillo Constelación III" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[9px] tracking-[0.3em] uppercase text-gray-500 font-sans">Su Mensaje</label>
                                    <textarea rows={4} className="w-full bg-transparent border-b border-white/10 py-3 text-white outline-none focus:border-[#C9A84C] transition-colors font-sans text-sm resize-none" />
                                </div>
                                <button className="w-full py-5 bg-[#C9A84C] text-black text-[10px] tracking-[0.5em] font-black uppercase hover:bg-white transition-all">
                                    Enviar Mensaje
                                </button>
                            </form>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Sedes Section */}
            <section className="py-24 bg-[#08070d] border-t border-white/5 px-8">
                <div className="container mx-auto max-w-7xl">
                    <div className="text-center mb-16">
                        <p className="text-[10px] tracking-[0.5em] uppercase text-[#C9A84C] mb-4">Ubicaciones</p>
                        <h2 className="text-4xl font-bold italic text-white tracking-widest">Nuestras Boutiques</h2>
                    </div>
                    <div className="grid md:grid-cols-3 gap-12 text-center text-sm font-sans">
                        {[
                            { city: 'París', street: '13 Rue de la Paix', zip: '75002', icon: MapPin },
                            { city: 'Madrid', street: 'Calle de Serrano, 42', zip: '28001', icon: MapPin },
                            { city: 'New York', street: '727 Fifth Avenue', zip: 'NY 10022', icon: MapPin }
                        ].map((loc, i) => (
                            <div key={i} className="space-y-4">
                                <loc.icon className="w-6 h-6 text-[#C9A84C] mx-auto opacity-50" />
                                <h4 className="text-white font-bold tracking-[0.2em] italic uppercase">{loc.city}</h4>
                                <p className="text-gray-500 leading-relaxed">{loc.street} <br /> {loc.zip}</p>
                                <button className="text-[9px] tracking-[0.3em] font-bold text-[#C9A84C] hover:text-white transition-colors">Ver en Google Maps</button>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </JewelLayout>
    );
};

export default ContactPage;
