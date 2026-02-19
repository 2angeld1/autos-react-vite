import { Instagram, Facebook, LocateFixed, ShieldCheck, Mail } from 'lucide-react';

const JewelFooter = () => (
    <footer className="bg-[#050406] border-t border-[#C9A84C]/10 py-24 px-8 relative overflow-hidden">
        {/* Subtle decorative background glow */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[60%] h-[30%] bg-[#C9A84C]/5 blur-[120px] rounded-full pointer-events-none" />

        <div className="container mx-auto max-w-7xl relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
                {/* Brand Column */}
                <div className="space-y-6">
                    <div>
                        <p className="text-[10px] font-sans tracking-[0.6em] text-[#C9A84C] uppercase mb-1">Maison d'Excellence</p>
                        <h3 className="text-3xl font-bold italic text-white tracking-widest leading-none">LuxJewel</h3>
                    </div>
                    <p className="text-gray-500 text-sm leading-relaxed font-sans max-w-xs italic">
                        Preservando el arte de la alta joyería desde nuestra fundación. Cada creación es un testimonio de perfección y deseo eterno.
                    </p>
                    <div className="flex gap-4 pt-2">
                        {[Instagram, Facebook, Mail].map((Icon, i) => (
                            <a key={i} href="#" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-gray-500 hover:text-[#C9A84C] hover:border-[#C9A84C]/40 transition-all duration-300">
                                <Icon className="w-4 h-4" />
                            </a>
                        ))}
                    </div>
                </div>

                {/* Collections Column */}
                <div>
                    <h4 className="text-[11px] tracking-[0.4em] uppercase font-sans text-white font-bold mb-8">Colecciones</h4>
                    <ul className="space-y-4 text-[13px] font-sans text-gray-500">
                        {['Anillos & Alianzas', 'Collares de Alta Gala', 'Gargantillas de Diamantes', 'Relojería de Precisión', 'Ediciones Atelier'].map(c => (
                            <li key={c} className="hover:text-white transition-colors cursor-pointer flex items-center gap-3 group">
                                <div className="w-1.5 h-px bg-[#C9A84C] scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
                                {c}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* The Maison Column */}
                <div>
                    <h4 className="text-[11px] tracking-[0.4em] uppercase font-sans text-white font-bold mb-8">La Maison</h4>
                    <ul className="space-y-4 text-[13px] font-sans text-gray-500">
                        {['Herencia & Artesanía', 'Compromiso Ético', 'Servicios de Boutique', 'Garantía Vitalicia', 'Localizador de Maison'].map(c => (
                            <li key={c} className="hover:text-white transition-colors cursor-pointer flex items-center gap-3 group">
                                <div className="w-1.5 h-px bg-[#C9A84C] scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
                                {c}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Newsletter/Contact Column */}
                <div className="space-y-8">
                    <div>
                        <h4 className="text-[11px] tracking-[0.4em] uppercase font-sans text-white font-bold mb-4">Newsletter</h4>
                        <p className="text-gray-500 text-xs font-sans mb-6">Reciba invitaciones exclusivas a nuestras nuevas colecciones.</p>
                        <div className="relative">
                            <input
                                type="email"
                                placeholder="SU EMAIL"
                                className="w-full bg-transparent border-b border-white/10 py-3 text-xs tracking-widest text-white placeholder:text-gray-700 outline-none focus:border-[#C9A84C] transition-colors"
                            />
                            <button className="absolute right-0 bottom-3 text-[#C9A84C] text-[10px] tracking-widest font-bold hover:text-white transition-colors">UNIRSE</button>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 text-gray-500 group cursor-pointer hover:text-white">
                        <LocateFixed className="w-4 h-4 text-[#C9A84C]" />
                        <span className="text-[10px] tracking-[0.3em] font-sans lowercase">Encontrar una boutique cercana</span>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
                <div className="flex gap-10 items-center">
                    <div className="flex items-center gap-2">
                        <ShieldCheck className="w-3.5 h-3.5 text-[#C9A84C]" />
                        <span className="text-[9px] tracking-[0.3em] uppercase text-gray-600">Certificado Gemológico</span>
                    </div>
                    <span className="text-[9px] tracking-[0.3em] uppercase text-gray-600">© 2026 LuxJewel Maison</span>
                </div>

                <div className="flex gap-8 text-[9px] tracking-[0.2em] uppercase text-gray-600">
                    <a href="#" className="hover:text-white">Aviso Legal</a>
                    <a href="#" className="hover:text-white">Privacidad</a>
                    <a href="#" className="hover:text-white">Cookies</a>
                    <span className="italic font-serif opacity-30">Core Retail Engine™</span>
                </div>
            </div>
        </div>
    </footer>
);

export default JewelFooter;
