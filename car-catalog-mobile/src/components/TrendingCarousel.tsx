import React from 'react';
import { IonIcon } from '@ionic/react';
import { arrowForward, flame } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/autoplay';

interface TrendingCarouselProps {
  cars: any[];
}

const TrendingCarousel: React.FC<TrendingCarouselProps> = ({ cars }) => {
  const history = useHistory();

  return (
    <div className="mb-10">
       <div className="px-6 flex justify-between items-end mb-4">
          <div className="flex items-center gap-2">
             <h3 className="text-lg font-bold text-slate-900">Trending Now</h3>
             <IonIcon icon={flame} className="text-orange-500" />
          </div>
          <button onClick={() => history.push('/showcase')} className="text-indigo-600 text-xs font-bold flex items-center gap-1">
             View All <IonIcon icon={arrowForward} />
          </button>
       </div>
       
       <div className="pl-6 pb-4">
        {cars.length > 0 && (
          <Swiper
            key={cars.length}
            modules={[Autoplay]}
            spaceBetween={16}
            slidesPerView={1.4}
            loop={cars.length > 2}
            observer={true}
            observeParents={true}
            autoplay={{
              delay: 2500,
              disableOnInteraction: false,
              pauseOnMouseEnter: true
            }}
            className="w-full"
          >
            {cars.slice(0, 8).map((car: any) => ( 
              <SwiperSlide key={car.id || car._id}>
                <div 
                  onClick={() => history.push(`/car/${car.id || car._id}`)}
                  className="bg-white rounded-[2rem] p-4 shadow-sm border border-slate-100 h-full active:scale-95 transition-transform"
                >
                  <div className="h-40 w-full bg-slate-100 rounded-[1.5rem] mb-4 overflow-hidden relative">
                      <img src={car.image || car.imageUrl || 'https://placehold.co/300x200'} className="w-full h-full object-cover" />
                      <span className="absolute top-3 right-3 bg-white/90 backdrop-blur text-[10px] font-bold px-3 py-1.5 rounded-full text-slate-900 shadow-sm">
                        ${(car.price / 1000).toFixed(0)}k
                      </span>
                  </div>
                  <div className="px-1">
                      <h4 className="font-bold text-slate-900 text-lg mb-1 truncate">{car.model}</h4>
                      <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-3">{car.make}</p>
                      <div className="flex gap-2">
                        <span className="bg-slate-50 text-slate-500 text-[10px] font-bold px-3 py-1.5 rounded-lg border border-slate-100">{car.year}</span>
                        <span className="bg-slate-50 text-slate-500 text-[10px] font-bold px-3 py-1.5 rounded-lg border border-slate-100 truncate max-w-[80px]">{car.fuel_type || 'Gas'}</span>
                      </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </div>
    </div>
  );
};

export default TrendingCarousel;
