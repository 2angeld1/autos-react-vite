import React, { useState } from 'react';

interface Car {
    make: string;
    model: string;
    year: number;
    image?: string;
}

interface CarGalleryProps {
    car: Car;
    imgError: boolean;
    onImageError: () => void;
}

const CarGallery: React.FC<CarGalleryProps> = ({ car, imgError, onImageError }) => {
    const [activeGalleryImage, setActiveGalleryImage] = useState<number>(0);

    // Simulated gallery images
    const galleryImages = [
        { id: 0, type: 'main', label: 'Principal' },
        { id: 1, type: 'interior', label: 'Interior' },
        { id: 2, type: 'front', label: 'Frontal' },
        { id: 3, type: 'back', label: 'Trasera' },
    ];

    const getBrandColor = (make: string): string => {
        const brandColors: Record<string, string> = {
            toyota: '#e50000',
            kia: '#0033a0',
            nissan: '#c3002f',
            ford: '#003478',
            chevrolet: '#d1a856',
            bmw: '#0066b1',
            audi: '#bb0a30',
            mercedes: '#00adef'
        };

        return brandColors[make.toLowerCase()] || '#6b7280';
    };

    // These URLs are simulated - we use placeholders in case of error
    const getPlaceholderImage = (carInfo: Car, type: string = 'main'): string => {
        const makeModel = `${carInfo.make} ${carInfo.model}`;
        return `https://source.unsplash.com/800x450/?${makeModel}+${type}+car`;
    };

    const getGalleryImage = (imageType: string): string => {
        if (imgError) return getPlaceholderImage(car, imageType);

        // In a real environment, you would have multiple images of the car
        // For this simulation, we use the same image but could look for variants
        return car.image || getPlaceholderImage(car, imageType);
    };

    return (
        <div className="car-gallery-container p-4">
            {imgError ? (
                <div 
                    className="has-text-centered is-flex is-justify-content-center is-align-items-center has-text-white main-image-container"
                    style={{ backgroundColor: getBrandColor(car.make), height: '400px' }}
                >
                    <span className="is-size-2">{car.make} {car.model} {car.year}</span>
                </div>
            ) : (
                <div className="car-gallery">
                    <div className="main-image-container mb-4">
                        <figure className="image is-16by9">
                            <img 
                                src={getGalleryImage(galleryImages[activeGalleryImage].type)} 
                                alt={`${car.make} ${car.model} - ${galleryImages[activeGalleryImage].label}`} 
                                className="main-gallery-image" 
                                onError={onImageError}
                            />
                        </figure>
                    </div>
                    
                    <div className="thumbnails">
                        <div className="columns is-mobile">
                            {galleryImages.map((img) => (
                                <div className="column is-3" key={img.id}>
                                    <div 
                                        className={`thumbnail ${activeGalleryImage === img.id ? 'is-active' : ''}`}
                                        onClick={() => setActiveGalleryImage(img.id)}
                                    >
                                        <figure className="image is-4by3">
                                            <img 
                                                src={getGalleryImage(img.type)} 
                                                alt={`${car.make} ${car.model} - ${img.label}`}
                                            />
                                        </figure>
                                        <div className="thumbnail-label">{img.label}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CarGallery;