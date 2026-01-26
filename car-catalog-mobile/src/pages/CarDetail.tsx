import React, { useEffect, useState } from 'react';
import { 
  IonContent, 
  IonHeader, 
  IonPage, 
  IonButtons,
  IonBackButton,
  IonToolbar,
  IonIcon
} from '@ionic/react';
import { heart, shareSocial, call, calendar } from 'ionicons/icons';
import { useParams, useHistory } from 'react-router-dom';
import { fetchCarById, fetchSimilarCars } from '@/services/api';
import type { Car } from '@/types';
import { Fuel, Gauge, SlidersHorizontal, MapPin } from 'lucide-react';

const DEFAULT_IMAGE = 'https://placehold.co/600x400/f1f5f9/94a3b8?text=No+Image';

const CarDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const history = useHistory();
  const [car, setCar] = useState<Car | null>(null);
  const [similarCars, setSimilarCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCar = async () => {
      try {
        setLoading(true);
        const data = await fetchCarById(id);
        setCar(data);
        
        if (data && (data.id || (data as any)._id)) {
          const similar = await fetchSimilarCars(data.id || (data as any)._id);
          setSimilarCars(similar);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (id) loadCar();
  }, [id]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(price);
  };

  const getCarImage = (car: any) => {
    if (car.image) return car.image;
    if (car.images && car.images.length > 0) return car.images[0];
    if (car.imageUrl) return car.imageUrl;
    return DEFAULT_IMAGE;
  };

  if (loading) {
    return (
      <IonPage>
        <IonHeader className="ion-no-border">
          <IonToolbar>
            <IonButtons slot="start">
              <IonBackButton defaultHref="/" />
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          <div className="animate-pulse space-y-4 mt-4">
             <div className="w-full h-64 bg-slate-200 rounded-3xl" />
             <div className="h-8 w-3/4 bg-slate-200 rounded-lg" />
             <div className="h-4 w-1/2 bg-slate-200 rounded-lg" />
             <div className="grid grid-cols-3 gap-4 mt-8">
               <div className="h-24 bg-slate-100 rounded-2xl" />
               <div className="h-24 bg-slate-100 rounded-2xl" />
               <div className="h-24 bg-slate-100 rounded-2xl" />
             </div>
          </div>
        </IonContent>
      </IonPage>
    );
  }

  if (!car) return null;

  return (
    <IonPage className="bg-white">
      {/* Immersive Header (Floating Buttons) */}
      <div className="absolute top-0 inset-x-0 z-20 flex justify-between items-center p-4 pt-12">
         <div 
           onClick={() => window.history.back()}
           className="w-12 h-12 bg-white/90 backdrop-blur-md rounded-full shadow-sm flex items-center justify-center text-slate-900 active:scale-90 transition-transform cursor-pointer"
         >
           <IonIcon icon={calendar} className="-rotate-90 transform" style={{ display: 'none' }} /> {/* Hack to load icon */}
           {/* Custom Back Arrow */}
           <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
         </div>

         <div className="flex gap-3">
            <button className="w-12 h-12 bg-white/90 backdrop-blur-md rounded-full shadow-sm flex items-center justify-center text-slate-900 active:scale-90 transition-transform">
               <IonIcon icon={shareSocial} className="text-xl" />
            </button>
            <button className="w-12 h-12 bg-white/90 backdrop-blur-md rounded-full shadow-sm flex items-center justify-center text-red-500 active:scale-90 transition-transform">
               <IonIcon icon={heart} className="text-xl" />
            </button>
         </div>
      </div>

      <IonContent fullscreen className="bg-white">
        {/* Hero Image */}
        <div className="relative w-full h-[50vh]">
          <img 
            src={getCarImage(car)} 
            alt={car.model} 
            className="w-full h-full object-cover"
          />
        </div>

        {/* Content Container (Overlapping) */}
        <div className="relative -mt-14 px-6 pb-32 bg-white rounded-t-[0.5rem] shadow-[0_-20px_40px_rgba(0,0,0,0.05)] pt-10">
            
            {/* Header Info */}
            <div className="mb-8">
              <div className="flex items-start justify-between mb-2">
                <div>
                   <span className="inline-block py-1 px-3 rounded-full bg-slate-100 text-slate-600 font-bold tracking-wider text-[10px] uppercase mb-3">
                     {car.year} Model
                   </span>
                   <h1 className="text-4xl font-extrabold text-slate-900 leading-none tracking-tight mb-1">
                     {car.make} {car.model}
                   </h1>
                </div>
              </div>
              
              <div className="flex items-end justify-between">
                 <div className="flex items-center gap-2 text-slate-500 text-sm font-medium">
                    <MapPin size={16} className="text-slate-400" />
                    <span>Miami, FL</span>
                 </div>
                 <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
                   {formatPrice(car.price)}
                 </h2>
              </div>
            </div>

            {/* Specs Grid */}
            <div className="grid grid-cols-3 gap-4 mb-8">
               <div className="bg-slate-50 p-4 rounded-[2rem] flex flex-col items-center justify-center text-center gap-2 aspect-[4/5]">
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm text-slate-900 mb-1">
                     <Gauge size={20} strokeWidth={2} />
                  </div>
                  <div>
                    <span className="block text-slate-900 font-bold text-sm leading-tight mb-1">
                      {car.class ? car.class.split(' ')[0] : 'Sedan'}
                    </span>
                    <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Class</span>
                  </div>
               </div>
               
               <div className="bg-slate-50 p-4 rounded-[2rem] flex flex-col items-center justify-center text-center gap-2 aspect-[4/5]">
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm text-slate-900 mb-1">
                     <Fuel size={20} strokeWidth={2} />
                  </div>
                  <div>
                    <span className="block text-slate-900 font-bold text-sm leading-tight mb-1 capitalize truncate w-full">
                      {car.fuel_type || 'Gas'}
                    </span>
                    <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Fuel</span>
                  </div>
               </div>

               <div className="bg-slate-50 p-4 rounded-[2rem] flex flex-col items-center justify-center text-center gap-2 aspect-[4/5]">
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm text-slate-900 mb-1">
                     <SlidersHorizontal size={20} strokeWidth={2} />
                  </div>
                  <div>
                    <span className="block text-slate-900 font-bold text-sm leading-tight mb-1 capitalize">
                       {car.transmission === 'a' ? 'Auto' : (car.transmission || 'Auto')}
                    </span>
                    <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Trans</span>
                  </div>
               </div>
            </div>

            {/* Description */}
            <div className="mb-8">
              <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                About this vehicle
              </h3>
              <p className="text-slate-500 leading-relaxed text-sm font-medium">
                {car.description || `Experience the power and luxury of this ${car.year} ${car.make} ${car.model}. A perfect blend of style and performance, ready for your next adventure.`}
              </p>
            </div>
            
            {/* Technical Details List */}
            <div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Technical Specs</h3>
              <div className="space-y-3">
                 {[
                    { label: 'Engine', value: car.displacement ? `${car.displacement}L` : 'V6 Turbo' },
                    { label: 'Cylinders', value: car.cylinders || '6' },
                    { label: 'City MPG', value: car.city_mpg || '21' },
                    { label: 'Hwy MPG', value: car.highway_mpg || '28' },
                 ].map((item, i) => (
                    <div key={i} className="flex justify-between items-center py-3 border-b border-slate-50 last:border-0">
                       <span className="text-slate-500 text-sm font-medium">{item.label}</span>
                       <span className="font-bold text-slate-900 text-sm">{item.value}</span>
                    </div>
                 ))}
              </div>
            </div>

            {/* Similar Vehicles */}
            {similarCars.length > 0 && (
              <div className="mt-10 pt-6 border-t border-slate-50">
                <h3 className="text-lg font-bold text-slate-900 mb-4">Similar Vehicles</h3>
                <div className="flex gap-4 overflow-x-auto pb-4 -mx-6 px-6 scrollbar-hide">
                  {similarCars.map((sCar: any) => (
                    <div 
                      key={sCar.id || sCar._id} 
                      onClick={() => history.push(`/car/${sCar.id || sCar._id}`)}
                      className="flex-shrink-0 w-40 bg-white rounded-2xl border border-slate-100/10 shadow-sm overflow-hidden active:scale-95 transition-transform"
                    >
                      <div className="h-28 w-full relative">
                        <img 
                          src={getCarImage(sCar)} 
                          alt={sCar.model}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-3">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">{sCar.make}</p>
                        <p className="text-xs font-bold text-slate-900 truncate">{sCar.model}</p>
                        <p className="text-xs font-bold text-slate-900 mt-1">{formatPrice(sCar.price)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

        </div>
      </IonContent>

      {/* Floating Action Bar */}
      <div className="fixed bottom-0 inset-x-0 bg-white/90 backdrop-blur-xl border-t border-slate-100/50 p-3 z-30 transition-all">
         <div className="flex gap-2.5 max-w-sm mx-auto">
            <button className="flex-1 !bg-white !border !border-slate-200 !text-slate-900 !font-bold !py-2.5 !px-4 !rounded-full flex items-center justify-center gap-2 shadow-sm transition-all active:scale-95">
               <IonIcon icon={calendar} className="text-base text-slate-500" />
               <span className="text-[12px] tracking-wide">Test Drive</span>
            </button>
            <button className="flex-[1.2] !bg-slate-900 !text-white !font-bold !py-2.5 !px-4 !rounded-full flex items-center justify-center gap-2 shadow-md transition-all active:scale-95">
               <IonIcon icon={call} className="text-base" />
               <span className="text-[12px] tracking-wide">Contact Dealer</span>
            </button>
         </div>
      </div>
    </IonPage>
  );
};

export default CarDetail;
