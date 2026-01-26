import React from 'react';
import { 
  IonContent, 
  IonHeader, 
  IonPage, 
  IonRefresher, 
  IonRefresherContent, 
  IonIcon
} from '@ionic/react';
import { search } from 'ionicons/icons';
import { SlidersHorizontal } from 'lucide-react';

import PreferencesModal from '@/components/PreferencesModal';
import CarCard from '@/components/CarCard';
import { useShowcase } from '../hooks/useShowcase';
import { motion } from 'framer-motion';

const Showcase: React.FC = () => {

    const {
        sortedCars,
        loading,
        searchText, setSearchText,
        viewMode, setViewMode,
        sortOption, setSortOption,
        showPreferences, setShowPreferences,
        handleRefresh
    } = useShowcase();

  return (
    <IonPage>
      <IonHeader className="ion-no-border bg-white shadow-none">
              <div className="px-6 pb-2 bg-white flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900">Showcase</h1>
            <p className="text-slate-500 font-medium">Explore our collection</p>
          </div>
          
          <button 
             onClick={() => setShowPreferences(true)}
             className="w-10 h-10 hover:bg-slate-50 rounded-full flex items-center justify-center text-slate-700 transition-colors mb-1"
          >
              <SlidersHorizontal size={20} strokeWidth={2.5} />
          </button>
        </div>
        
        {/* Search Bar */}
        <div className="px-6 pb-4 bg-white">
           <div className="flex items-center bg-slate-100 rounded-full px-4 h-12 w-full transition-all focus-within:ring-2 focus-within:ring-slate-200 focus-within:bg-white">
              <IonIcon icon={search} className="text-slate-400 text-lg mr-2 flex-shrink-0" /> 
              <input 
                type="text"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder="Find a car..."
                className="bg-transparent border-none outline-none text-slate-900 w-full text-sm placeholder:text-slate-400 h-full font-bold"
              />
           </div>
        </div>
      </IonHeader>

      <IonContent fullscreen className="bg-slate-50">
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent />
        </IonRefresher>

        <div className="p-4 pb-24 min-h-screen">
           
           {/* Grid/List Results */}
                  <motion.div
                      layout
                      className={`grid gap-4 ${viewMode === 'grid' ? 'grid-cols-2' : 'grid-cols-1'}`}
                  >
              {sortedCars.map((car: any) => (
                  <CarCard key={car.id || car._id} car={car} viewMode={viewMode} />
              ))}
                  </motion.div>
           
           {sortedCars.length === 0 && !loading && (
             <div className="text-center py-20 opacity-50">
               <p>No cars found</p>
             </div>
           )}

        </div>

        <PreferencesModal 
                  mode="showcase"
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

export default Showcase;
