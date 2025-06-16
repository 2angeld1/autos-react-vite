import React, { useState, useCallback, useEffect } from 'react';

interface SafeCarImageProps {
    src: string;
    alt: string;
    className?: string;
    style?: React.CSSProperties;
    onLoad?: () => void;
    car?: {
        make: string;
        model: string;
        year: number;
    };
}

const SafeCarImage: React.FC<SafeCarImageProps> = ({
    src,
    alt,
    className,
    style,
    onLoad,
    car
}) => {
    const [currentSrc, setCurrentSrc] = useState<string>(src);
    const [fallbackIndex, setFallbackIndex] = useState<number>(0);
    const [hasError, setHasError] = useState<boolean>(false);

    // ✅ Generar fallbacks dinámicos basados en el auto específico
    const generateFallbacks = useCallback((): string[] => {
        const carMake = car?.make?.toLowerCase() || 'car';
        const carModel = car?.model?.toLowerCase() || '';
        const searchTerm = `${carMake} ${carModel}`.trim();
        
        return [
            src, // Imagen original
            // ✅ Fallbacks específicos por marca usando el catálogo local
            `https://cdn.motor1.com/images/mgl/ZnMNP/s1/2020-${carMake}-${carModel.replace(/\s+/g, '-')}.jpg`,
            // ✅ Fallbacks genéricos de alta calidad
            `https://images.unsplash.com/photo-1583121274602-3e2820c69888?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450&q=80&text=${encodeURIComponent(searchTerm)}`,
            `https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450&q=80`,
            // ✅ Fallback por marca específica
            getDefaultImageByMake(carMake),
            // ✅ Último recurso: placeholder con el nombre del auto
            `https://placehold.co/800x450/1a1a1a/ffffff?text=${encodeURIComponent(searchTerm || 'Car')}`
        ].filter((url, index, array) => array.indexOf(url) === index); // Eliminar duplicados
    }, [src, car]);

    // ✅ Función para obtener imagen por defecto por marca
    const getDefaultImageByMake = (make: string): string => {
        const brandDefaults: Record<string, string> = {
            'toyota': 'https://cdn.motor1.com/images/mgl/P3MJE/s1/2020-toyota-supra.jpg',
            'chevrolet': 'https://cdn.motor1.com/images/mgl/ZnMNP/s1/2020-chevrolet-malibu.jpg',
            'ford': 'https://cdn.motor1.com/images/mgl/G3MbX/s1/2020-ford-mustang.jpg',
            'honda': 'https://cdn.motor1.com/images/mgl/2NMmE/s1/2020-honda-civic.jpg',
            'nissan': 'https://cdn.motor1.com/images/mgl/2NMlE/s1/2020-nissan-altima.jpg',
            'bmw': 'https://cdn.motor1.com/images/mgl/G3MbX/s1/2022-bmw-3-series.jpg',
            'audi': 'https://cdn.motor1.com/images/mgl/ZnMNP/s1/2020-audi-a4.jpg',
            'mercedes': 'https://cdn.motor1.com/images/mgl/G3MbX/s1/2022-mercedes-c-class.jpg',
            'lexus': 'https://cdn.motor1.com/images/mgl/ZnMNP/s1/2020-lexus-es.jpg',
            'kia': 'https://cdn.motor1.com/images/mgl/ZnMNP/s1/2020-kia-optima.jpg',
            'hyundai': 'https://cdn.motor1.com/images/mgl/2NMmE/s1/2020-hyundai-elantra.jpg'
        };
        
        return brandDefaults[make] || 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450&q=80';
    };

    const [fallbacks, setFallbacks] = useState<string[]>([]);

    // ✅ Actualizar fallbacks cuando cambie el src o car
    useEffect(() => {
        const newFallbacks = generateFallbacks();
        setFallbacks(newFallbacks);
        setCurrentSrc(newFallbacks[0]);
        setFallbackIndex(0);
        setHasError(false);
    }, [generateFallbacks]);

    const handleImageError = useCallback(() => {
        console.warn(`❌ Image load failed: ${currentSrc}`);
        
        // ✅ Intentar el siguiente fallback
        if (fallbackIndex < fallbacks.length - 1) {
            const nextIndex = fallbackIndex + 1;
            const nextSrc = fallbacks[nextIndex];
            
            setFallbackIndex(nextIndex);
            setCurrentSrc(nextSrc);
        } else {
            console.error(`❌ All ${fallbacks.length} image fallbacks failed for: ${alt}`);
            setHasError(true);
        }
    }, [currentSrc, fallbackIndex, fallbacks, alt]);

    const handleImageLoad = useCallback(() => {
        setHasError(false);
        onLoad?.();
    }, [currentSrc, fallbackIndex, fallbacks.length, onLoad]);

    // ✅ Si todas las imágenes fallan, mostrar placeholder elegante
    if (hasError) {
        const brandColors: Record<string, string> = {
            'toyota': '#e50000',
            'chevrolet': '#d1a856',
            'ford': '#003478',
            'honda': '#cc0000',
            'nissan': '#c3002f',
            'bmw': '#0066b1',
            'audi': '#bb0a30',
            'mercedes': '#00adef',
            'lexus': '#00205b',
            'kia': '#0033a0',
            'hyundai': '#002c5f'
        };

        const carMake = car?.make?.toLowerCase() || '';
        const backgroundColor = brandColors[carMake] || '#6b7280';
        
        return (
            <div 
                className={`has-text-centered is-flex is-align-items-center is-justify-content-center ${className || ''}`}
                style={{ 
                    ...style,
                    backgroundColor,
                    minHeight: '300px',
                    borderRadius: '8px',
                    border: '2px solid rgba(255,255,255,0.1)'
                }}
            >
                <div className="has-text-white">
                    <span className="icon is-large mb-3">
                        <i className="fas fa-car fa-3x"></i>
                    </span>
                    <p className="is-size-3 has-text-weight-bold mb-2">
                        {car ? `${car.make.toUpperCase()} ${car.model.toUpperCase()}` : 'VEHÍCULO'}
                    </p>
                    {car && (
                        <p className="is-size-5 has-text-weight-light mb-3">
                            {car.year}
                        </p>
                    )}
                    <p className="is-size-6 has-text-grey-light">
                        Imagen no disponible
                    </p>
                    <div className="mt-4">
                        <span className="tag is-light">
                            <span className="icon">
                                <i className="fas fa-camera"></i>
                            </span>
                            <span>Foto próximamente</span>
                        </span>
                    </div>
                </div>
            </div>
        );
    }

    // ✅ Mostrar indicador de carga si estamos en fallbacks
    const isUsingFallback = fallbackIndex > 0;
    
    return (
        <div className="position-relative">
            <img
                src={currentSrc}
                alt={alt}
                className={className}
                style={style}
                onError={handleImageError}
                onLoad={handleImageLoad}
            />
            
            {/* ✅ Indicador discreto si estamos usando fallback */}
            {isUsingFallback && !hasError && (
                <div 
                    className="position-absolute"
                    style={{
                        bottom: '10px',
                        right: '10px',
                        zIndex: 5
                    }}
                >
                    <span className="tag is-warning is-small">
                        <span className="icon">
                            <i className="fas fa-exclamation-triangle"></i>
                        </span>
                        <span>Fallback {fallbackIndex}</span>
                    </span>
                </div>
            )}
        </div>
    );
};

export default SafeCarImage;