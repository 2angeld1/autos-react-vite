import React, { useState } from 'react';
import { 
  IonContent, 
  IonPage, 
  IonHeader,
  IonIcon
} from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { notifications, arrowForward, flame, newspaper } from 'ionicons/icons';
import useCarData from '@/hooks/useCarData';
import PreferencesModal, { type SortOption } from '@/components/PreferencesModal';
import { SlidersHorizontal } from 'lucide-react';

// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/autoplay';

const Home: React.FC = () => {
  const history = useHistory();
  const { cars } = useCarData();
  const [showPreferences, setShowPreferences] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [sortOption, setSortOption] = useState<SortOption>('featured');
  
  // Fake News Data
  const news = [
    { id: 1, title: "Tesla Model 2 Confirmed?", category: "EV News", time: "2h ago", image: "https://placehold.co/100x100/1e293b/ffffff?text=EV" },
    { id: 2, title: "2026 BMW Series Redesign", category: "Reviews", time: "5h ago", image: "https://placehold.co/100x100/1e293b/ffffff?text=BMW" },
    { id: 3, title: "Gas prices drop below $3", category: "Market", time: "1d ago", image: "https://placehold.co/100x100/1e293b/ffffff?text=Gas" },
  ];

  const brands = ["BMW", "Tesla", "Audi", "Ford", "Toyota", "Honda", "Mercedes"];

  return (
    <IonPage>
      <IonHeader 
        className={`ion-no-border absolute top-0 w-full z-20 transition-all duration-300 shadow-none`}
        style={{ backgroundColor: isScrolled ? '#ffffff' : 'transparent', borderBottom: isScrolled ? '1px solid #f1f5f9' : 'none' }}
      >
        <div className={`flex items-center justify-between px-6 pt-4 pb-2`}>
           {/* Logo */}
           <div className="flex-shrink-0 flex items-center gap-2">
             <img 
               src="/logo-transparent.png" 
               alt="VeloDrive Logo" 
               className={`h-8 w-auto object-contain transition-all duration-300 ${isScrolled ? 'brightness-0' : ''}`}
             />
           </div>
           
           <div className="flex gap-3">
              {/* Settings Button */}
              <button 
                onClick={() => setShowPreferences(true)}
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                    isScrolled 
                        ? 'hover:bg-slate-50 text-slate-700' 
                        : 'bg-white/20 backdrop-blur-md border border-white/20 text-white'
                }`}
              >
                 <SlidersHorizontal size={20} strokeWidth={2.5} />
              </button>

              {/* Notification Button */}
              <button className={`w-10 h-10 rounded-full flex items-center justify-center relative transition-all ${
                 isScrolled
                    ? 'bg-slate-50 text-slate-900'
                    : 'bg-white/20 backdrop-blur-md border border-white/20 text-white'
              }`}>
                 <IonIcon icon={notifications} />
                 <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
              </button>
           </div>
        </div>
      </IonHeader>
      
      <IonContent 
        fullscreen 
        className="bg-slate-50"
        scrollEvents={true}
        onIonScroll={(e) => setIsScrolled(e.detail.scrollTop > 10)}
      >
        <div className="pb-24">
          
          {/* 1. Hero Promo Section - Fused with Header */}
          <div className="mb-8 -mt-20">
             <div className="relative w-full h-[480px] overflow-hidden shadow-2xl shadow-indigo-900/20">
               <img src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&q=80&w=1000" className="w-full h-full object-cover" alt="Hero Car" />
               <div className="absolute inset-0 bg-gradient-to-b from-slate-900/40 via-transparent to-slate-900/90 flex flex-col justify-end items-start p-8 pb-14 pt-32">
                  <span className="bg-white/20 backdrop-blur-md text-white border border-white/30 text-[10px] font-bold px-4 py-1.5 rounded-full uppercase tracking-widest mb-4 shadow-lg">Summer Event</span>
                  <h2 className="text-5xl font-extrabold text-white leading-[0.95] mb-4 drop-shadow-lg">
                    Limitless <br/> <span className="text-indigo-400">Luxury.</span>
                  </h2>
                  <p className="text-slate-200 text-sm font-medium max-w-[240px] mb-8 drop-shadow-md leading-relaxed">
                    Experience the future of driving with our exclusive summer collection.
                  </p>
                  <button 
                    onClick={() => history.push('/showcase')}
                    className="bg-white text-slate-900 font-bold py-4 px-8 rounded-full text-sm active:scale-95 transition-transform shadow-[0_10px_30px_rgba(255,255,255,0.2)] flex items-center gap-2"
                  >
                    Check Inventory 
                    <IonIcon icon={arrowForward} />
                  </button>
               </div>
             </div>
          </div>

          {/* 2. Brands Scroll */}
          <div className="mb-10">
             <div className="px-6 flex justify-between items-end mb-4">
                <h3 className="text-lg font-bold text-slate-900">Browse by Brand</h3>
                <span className="text-slate-400 text-xs font-bold">See all</span>
             </div>
             <div className="flex gap-5 overflow-x-auto px-6 pb-2 -mx-0 scrollbar-hide">
                {brands.map((brand, i) => (
                   <div key={i} className="flex flex-col items-center gap-3 flex-shrink-0 group">
                      <div className="w-16 h-16 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center text-slate-900 font-bold text-xl group-active:scale-95 transition-transform">
                         {brand.substring(0, 1)}
                      </div>
                      <span className="text-[11px] font-bold text-slate-500">{brand}</span>
                   </div>
                ))}
             </div>
          </div>


          {/* 3. Trending Now (Carousel) */}
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
             
             {/* Swiper Carousel */}
             <div className="pl-6 pb-4">
                <Swiper
                  modules={[Autoplay]}
                  spaceBetween={16}
                  slidesPerView={1.4}
                  loop={true}
                  autoplay={{
                    delay: 2500,
                    disableOnInteraction: false,
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
             </div>
          </div>

          {/* 4. Latest News */}
          <div className="px-6">
             <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
               <IonIcon icon={newspaper} className="text-slate-400" />
               Auto News
             </h3>
             <div className="space-y-4">
               {news.map(item => (
                  <div key={item.id} className="bg-white p-4 rounded-3xl flex gap-4 items-center shadow-sm border border-slate-50 active:scale-[0.98] transition-transform">
                     <img src={item.image} className="w-20 h-20 rounded-2xl object-cover bg-slate-200" />
                     <div>
                        <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-wide bg-indigo-50 px-2 py-0.5 rounded-md">{item.category}</span>
                        <h4 className="font-bold text-slate-900 text-sm leading-snug mt-1 mb-1">{item.title}</h4>
                        <p className="text-[10px] text-slate-400 font-medium">{item.time}</p>
                     </div>
                  </div>
               ))}
             </div>
          </div>

        </div>
        
        <PreferencesModal 
          isOpen={showPreferences} 
          onClose={() => setShowPreferences(false)}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          sortOption={sortOption}
          onSortChange={setSortOption}
        />
      </IonContent>
    </IonPage>
  );
};

export default Home;
