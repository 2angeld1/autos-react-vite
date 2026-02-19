import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

interface DecoCardProps {
    _id?: string;
    image: string;
    title: string;
    price: string;
    category: string;
    material?: string;
    dimensions?: string;
}

const DecoCard = ({ _id, image, title, price, category, material }: DecoCardProps) => (
    <Link to={`/decohaus/product/${_id || '1'}`}>
        <motion.div
            whileHover={{ y: -6 }}
            transition={{ duration: 0.3 }}
            className="group cursor-pointer bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300"
        >
            {/* Image */}
            <div className="relative overflow-hidden h-64">
                <img
                    src={image}
                    alt={title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {/* Category badge */}
                <div className="absolute top-4 left-4">
                    <span className="text-[9px] tracking-wider uppercase bg-white text-[#8B6F47] px-3 py-1.5 rounded-full font-semibold shadow-sm">
                        {category}
                    </span>
                </div>
                {/* Quick view */}
                <div className="absolute inset-0 bg-[#1a1a1a]/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="flex items-center gap-2 bg-white text-[#1a1a1a] text-xs font-semibold px-5 py-2.5 rounded-full">
                        Ver Producto <ArrowRight className="w-3 h-3" />
                    </span>
                </div>
            </div>

            {/* Info */}
            <div className="p-5">
                {material && <p className="text-[10px] tracking-wider uppercase text-[#8B6F47] mb-1">{material}</p>}
                <h3 className="font-semibold text-[#1a1a1a] mb-3 line-clamp-2 text-sm">{title}</h3>
                <div className="flex items-center justify-between">
                    <span className="font-bold text-[#1a1a1a]">${price}</span>
                    <span className="text-xs text-[#8B6F47] font-medium">Ver más →</span>
                </div>
            </div>
        </motion.div>
    </Link>
);

export default DecoCard;
