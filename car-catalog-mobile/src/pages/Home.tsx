import React, { useState } from 'react';
import { 
  IonContent, 
  IonPage, 
  IonHeader,
  IonIcon
} from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { notifications, arrowForward, build } from 'ionicons/icons';
import useCarData from '@/hooks/useCarData';
import PreferencesModal from '@/components/PreferencesModal';
import { SlidersHorizontal } from 'lucide-react';
import { motion } from 'framer-motion';
import { staggerContainer, fadeInUp, scaleIn } from '../animations';

import PromotionsCarousel from '@/components/PromotionsCarousel';
import HeroBanner from '@/components/HeroBanner';
import NewsFeed from '@/components/NewsFeed';
import TrendingCarousel from '@/components/TrendingCarousel';
import { getBrands, type Brand } from '@/services/api/brands';
import { useEffect } from 'react';

const Home: React.FC = () => {
  const history = useHistory();
  const { cars } = useCarData();
  const [showPreferences, setShowPreferences] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [brands, setBrands] = useState<Brand[]>([]);

  useEffect(() => {
    const loadBrands = async () => {
      const data = await getBrands();
      // If no brands from API, showing nothing or empty is better than static strings that don't match data
      setBrands(data);
    };
    loadBrands();
  }, []);

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
        <motion.div
          className="pb-24"
          variants={staggerContainer}
          initial="hidden"
          animate="show"
        >

          {/* 1. Hero Promo Section */}
          <motion.div className="mb-8 -mt-20" variants={fadeInUp}>
            <HeroBanner />
          </motion.div>

          {/* 2. Brands Scroll */}
          <motion.div className="mb-10" variants={fadeInUp}>
             <div className="px-6 flex justify-between items-end mb-4">
                <h3 className="text-lg font-bold text-slate-900">Browse by Brand</h3>
                <span className="text-slate-400 text-xs font-bold">See all</span>
             </div>
             <div className="flex gap-5 overflow-x-auto px-6 pb-2 -mx-0 scrollbar-hide">
              {brands.map((brand) => (
                <div
                  key={brand._id}
                  className="flex flex-col items-center gap-3 flex-shrink-0 group cursor-pointer"
                  onClick={() => history.push(`/search?make=${brand.name}`)}
                >
                  <div className="w-16 h-16 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center text-slate-900 font-bold text-xl group-active:scale-95 transition-transform overflow-hidden p-2">
                    {brand.cloudinaryUrl || brand.logo ? (
                      <img
                        src={brand.cloudinaryUrl || brand.logo}
                        alt={brand.name}
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      brand.name?.substring(0, 1) || '?'
                    )}
                      </div>
                    <span className="text-[11px] font-bold text-slate-500">{brand.name}</span>
                   </div>
                ))}
             </div>
          </motion.div>

          {/* 3. Trending Now (Carousel) */}
          <motion.div variants={fadeInUp}>
            <TrendingCarousel cars={cars} />
          </motion.div>

          {/* 4. Special Offers */}
          <motion.div variants={fadeInUp}>
            <PromotionsCarousel />
          </motion.div>

          {/* 5. Our Services */}
          <motion.div className="mb-10 px-6" variants={scaleIn}>
            <h3 className="text-lg font-bold text-slate-900 mb-4">Servicios VeloDrive</h3>
            <div
              onClick={() => history.push('/maintenance')}
              className="bg-slate-900 rounded-[2rem] p-6 text-white relative overflow-hidden active:scale-95 transition-transform flex items-center justify-between shadow-xl shadow-slate-900/20"
            >
              <div className="relative z-10">
                <div className="w-12 h-12 bg-indigo-500 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-indigo-500/50">
                  <IonIcon icon={build} className="text-2xl" />
                </div>
                <h4 className="text-xl font-bold mb-1">Mantenimiento</h4>
                <p className="text-slate-400 text-xs font-medium max-w-[150px]">Agenda tu cita y mantén tu auto al 100%.</p>
              </div>

              <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-indigo-600/20 to-transparent"></div>
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-indigo-500/20 rounded-full blur-2xl"></div>

              <div className="relative z-10 bg-white/10 backdrop-blur-md p-3 rounded-full border border-white/10">
                <IonIcon icon={arrowForward} />
              </div>
            </div>
          </motion.div>

          {/* 6. Latest News */}
          <motion.div variants={fadeInUp}>
            <NewsFeed />
          </motion.div>

        </motion.div>
        
        <PreferencesModal 
          isOpen={showPreferences} 
          onClose={() => setShowPreferences(false)}
          mode="home"
        />
      </IonContent>
    </IonPage>
  );
};

export default Home;
