const DecoFooter = () => (
    <footer className="bg-[#1a1a1a] text-white py-16 px-8">
        <div className="container mx-auto max-w-6xl">
            <div className="grid md:grid-cols-4 gap-10 mb-12">
                <div className="md:col-span-2">
                    <h3 className="text-3xl font-black mb-1">Deco<span className="font-light text-[#C9A078]">haus</span></h3>
                    <p className="text-gray-400 text-sm leading-relaxed mt-4 max-w-xs">
                        Diseño con propósito. Muebles que transforman espacios en hogares.
                    </p>
                </div>
                <div>
                    <h4 className="text-xs tracking-widest uppercase text-gray-500 mb-5">Colección</h4>
                    <ul className="space-y-2 text-sm text-gray-400">
                        {['Sala de Estar', 'Comedor', 'Dormitorio', 'Oficina', 'Exterior'].map(c => (
                            <li key={c} className="hover:text-white transition-colors cursor-pointer">{c}</li>
                        ))}
                    </ul>
                </div>
                <div>
                    <h4 className="text-xs tracking-widest uppercase text-gray-500 mb-5">Nosotros</h4>
                    <ul className="space-y-2 text-sm text-gray-400">
                        {['Nuestra Historia', 'Materiales', 'Envío', 'Contacto'].map(c => (
                            <li key={c} className="hover:text-white transition-colors cursor-pointer">{c}</li>
                        ))}
                    </ul>
                </div>
            </div>
            <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                <p className="text-gray-500 text-xs">© 2026 DecoHaus. Todos los derechos reservados.</p>
                <p className="text-gray-700 text-xs italic">Powered by Core Retail Engine™</p>
            </div>
        </div>
    </footer>
);

export default DecoFooter;
