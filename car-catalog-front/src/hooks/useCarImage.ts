import { useState, useCallback, useEffect } from 'react'; // ✅ CORREGIDO: Quitar useRef

interface UseCarImageProps {
    car: {
        id: string;
        make: string;
        model: string;
        year: number;
        image?: string;
    };
    fallbackImage?: string;
}

interface UseCarImageReturn {
    imageSrc: string;
    imageError: boolean;
    imageLoading: boolean;
    imageMode: 'cover' | 'contain';
    handleImageError: (e: React.SyntheticEvent<HTMLImageElement>) => void;
    handleImageLoad: (e: React.SyntheticEvent<HTMLImageElement>) => void;
    resetImage: () => void;
}

export const useCarImage = ({ 
    car, 
    fallbackImage = "https://images.unsplash.com/photo-1493238792000-8113da705763?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80"
}: UseCarImageProps): UseCarImageReturn => {
    const [imageError, setImageError] = useState<boolean>(false);
    const [imageLoading, setImageLoading] = useState<boolean>(true);
    const [imageSrc, setImageSrc] = useState<string>(fallbackImage);
    const [imageMode, setImageMode] = useState<'cover' | 'contain'>('cover');
    // ✅ CORREGIDO: Eliminado imgRef ya que no se usa

    // ✅ ACTUALIZADO: Lista de imágenes de backup por marca (incluir Mitsubishi y Chevrolet)
    const getBackupImageByMake = useCallback((make: string): string => {
        const backupImages: { [key: string]: string } = {
            'toyota': 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80',
            'kia': 'https://images.unsplash.com/photo-1558383817-dd10c33e799f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80',
            'hyundai': 'https://images.unsplash.com/photo-1629293363663-08de80df7b5d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80',
            'tesla': 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80',
            'geely': 'https://images.unsplash.com/photo-1549924231-f129b911e442?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80',
            'mazda': 'https://images.unsplash.com/photo-1563720223522-462cbfe9a8bb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80',
            'mitsubishi': 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80',
            'nissan': 'https://images.unsplash.com/photo-1606016829667-c9f7ff88b8c8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80',
            'chevrolet': 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80'
        };
        
        const brandImage = backupImages[make.toLowerCase()] || fallbackImage;
        return brandImage;
    }, [fallbackImage]);

    // ✅ MODIFICADO: Función más flexible para detectar modo de imagen
    const detectImageMode = useCallback((img: HTMLImageElement): 'cover' | 'contain' => {
        
        // ✅ SUPER PERMISIVO: Solo usar contain si la imagen es EXTREMADAMENTE pequeña
        if (img.naturalWidth < 100 || img.naturalHeight < 100) {
            return 'contain';
        }
        
        // ✅ Para todo lo demás, usar cover (dejamos que CSS lo maneje)
        return 'cover';
    }, []);

    useEffect(() => {        
        setImageLoading(true);
        
        // ✅ SUPER PERMISIVO: Usar CUALQUIER imagen que no sea placeholder
        if (car.image && car.image !== '' && 
            !car.image.includes('placeholder.com') && 
            !car.image.includes('placehold.it') &&
            !car.image.includes('via.placeholder.com')) {
            
            setImageSrc(car.image);
            setImageError(false);
        } 
        // ✅ Solo si no hay imagen válida, usar imagen específica por marca
        else {
            const backupImage = getBackupImageByMake(car.make);
            setImageSrc(backupImage);
            setImageError(false);
        }
    }, [car.image, car.id, car.make, car.model, fallbackImage, getBackupImageByMake]);

    const handleImageLoad = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
        const img = e.target as HTMLImageElement;

        // Detectar el mejor modo para esta imagen
        const bestMode = detectImageMode(img);
        setImageMode(bestMode);
        setImageLoading(false);
        
    }, [detectImageMode]);

    const handleImageError = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
        console.warn(`❌ Image load failed for ${car.make} ${car.model}: ${imageSrc}`);
        
        const target = e.target as HTMLImageElement;
        target.onerror = null; // Prevenir bucle infinito
        
        // ✅ Usar imagen específica por marca como backup
        if (!imageError) {
            const backupImage = getBackupImageByMake(car.make);
            target.src = backupImage;
            setImageSrc(backupImage);
            setImageError(true);
            setImageLoading(false);
        }
    }, [car.make, car.model, imageSrc, imageError, getBackupImageByMake]);

    const resetImage = useCallback(() => {
        setImageError(false);
        setImageLoading(true);
        if (car.image && car.id !== 'loading' && !car.image.includes('placehold.co')) {
            setImageSrc(car.image);
        } else {
            const backupImage = getBackupImageByMake(car.make);
            setImageSrc(backupImage);
        }
    }, [car.image, car.id, car.make, getBackupImageByMake]);

    return {
        imageSrc,
        imageError,
        imageLoading,
        imageMode,
        handleImageError,
        handleImageLoad,
        resetImage
    };
};