import React, { useEffect, useState } from 'react';
import { IonIcon } from '@ionic/react';
import { arrowForward } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade } from 'swiper/modules';
import api, { BACKEND_API_BASE_URL } from '../services/api/config';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/effect-fade';

const HeroBanner: React.FC = () => {
  const history = useHistory();
  const [images, setImages] = useState<string[]>([]);


  // Fallback Premium Images
  const fallbackImages = [
      "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1503376763036-066120622c74?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&q=80&w=1000"
  ];

  useEffect(() => {
    const fetchSliderImages = async () => {
        try {
            const response = await api.get('/files/sliders');
            if (response.data && response.data.data && Array.isArray(response.data.data) && response.data.data.length > 0) {
                const serverUrl = BACKEND_API_BASE_URL.replace('/api', '');
                const processedImages = response.data.data.map((img: string) => 
                    img.startsWith('http') ? img : `${serverUrl}${img}`
                );
                setImages(processedImages);
            } else {
                setImages(fallbackImages);
            }
        } catch (error) {
            console.error("Failed to load slider images", error);
            setImages(fallbackImages);
        }
    };

    fetchSliderImages();
  }, []);

  const displayImages = images.length > 0 ? images : fallbackImages;

  return (
    <div className="relative w-full h-[480px] overflow-hidden shadow-2xl shadow-indigo-900/20 bg-slate-900">
      
      <Swiper
        modules={[Autoplay, EffectFade]}
        effect="fade"
        speed={1500}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        loop={true}
        allowTouchMove={false} // "Sin botones", also maybe disable swipe for pure background feel? Or allow swipe. User said "no buttons".
        className="w-full h-full"
      >
          {displayImages.map((img, index) => (
              <SwiperSlide key={index}>
                  <img 
                    src={img} 
                    className="w-full h-full object-cover" 
                    alt={`Hero Slide ${index + 1}`} 
                    loading={index === 0 ? "eager" : "lazy"}
                  />
                  {/* Dark overlay built into slide to ensure text readability on all images */}
                  <div className="absolute inset-0 bg-gradient-to-b from-slate-900/30 via-transparent to-slate-900/90" />
              </SwiperSlide>
          ))}
      </Swiper>

      {/* Content Overlay */}
      <div className="absolute inset-0 flex flex-col justify-end items-start p-8 pb-14 pt-32 z-10 pointer-events-none">
        <span className="bg-white/20 backdrop-blur-md text-white border border-white/30 text-[10px] font-bold px-4 py-1.5 rounded-full uppercase tracking-widest mb-4 shadow-lg animate-fade-in-up">
            Summer Event
        </span>
        <h2 className="text-5xl font-extrabold text-white leading-[0.95] mb-4 drop-shadow-lg max-w-xs">
          Limitless <br/> <span className="text-indigo-400">Luxury.</span>
        </h2>
        <p className="text-slate-200 text-sm font-medium max-w-[240px] mb-8 drop-shadow-md leading-relaxed">
          Experience the future of driving with our exclusive summer collection.
        </p>
        <button 
          onClick={() => history.push('/showcase')}
          className="pointer-events-auto !bg-white !text-slate-900 !font-bold !py-4 !px-8 !rounded-full !text-sm active:scale-95 transition-transform !shadow-[0_10px_30px_rgba(255,255,255,0.2)] !flex !items-center !gap-2 hover:bg-slate-50"
        >
          Check Inventory 
          <IonIcon icon={arrowForward} />
        </button>
      </div>
    </div>
  );
};

export default HeroBanner;
