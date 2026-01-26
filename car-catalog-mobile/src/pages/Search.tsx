import React from 'react';
import { 
  IonContent, 
  IonHeader, 
  IonPage, 
  IonRange,
  IonSelect,
  IonSelectOption,
  IonIcon
} from '@ionic/react';
import { search, carSport } from 'ionicons/icons';

import { useSearch } from '../hooks/useSearch';
import { motion } from 'framer-motion';
import { staggerContainer, fadeInUp, scaleIn } from '../animations';
import CarCard from '@/components/CarCard';

const Search: React.FC = () => {
    const {
        brands,
        selectedMake, setSelectedMake,
        yearRange, setYearRange,
        results,
        isSearching,
        handleSearch
    } = useSearch();

  return (
    <IonPage>
      <IonHeader className="ion-no-border bg-white shadow-none">
              <div className="px-6 pb-2 bg-white">
          <h1 className="text-3xl font-extrabold text-slate-900">Discover</h1>
          <p className="text-slate-500 font-medium">Find your perfect vehicle</p>
        </div>
      </IonHeader>

      <IonContent fullscreen className="bg-slate-50">
              <motion.div
                  className="p-6 space-y-8"
                  variants={staggerContainer}
                  initial="hidden"
                  animate="show"
              >

          {/* Filters Selection */}
                  <motion.div
                      className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100"
                      variants={scaleIn}
                  >

             {/* Make Selector */}
             <div className="mb-6">
                          <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Car Brand</label>
               <div className="bg-slate-50 rounded-2xl px-2 border border-slate-100">
                              <IonSelect
                                  value={selectedMake}
                                  placeholder="Select Brand"
                    onIonChange={e => setSelectedMake(e.detail.value)}
                    interface="action-sheet"
                    className="w-full text-slate-900 font-bold"
                 >
                                  <IonSelectOption value="">All Brands</IonSelectOption>
                                  {brands.map(brand => (
                                      <IonSelectOption key={brand._id} value={brand.name}>{brand.name}</IonSelectOption>
                   ))}
                 </IonSelect>
               </div>
             </div>

             {/* Year Range */}
             <div className="mb-6">
                <div className="flex justify-between mb-2">
                   <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Year Range</label>
                   <span className="text-xs font-bold text-slate-900">{yearRange.lower} - {yearRange.upper}</span>
                </div>
                          <IonRange
                              dualKnobs={true}
                              min={2000}
                              max={2024}
                              step={1}
                  value={yearRange}
                  onIonChange={e => setYearRange(e.detail.value as any)}
                              className="px-0 py-0"
                  color="dark"
                />
             </div>

             {/* Search Button */}
                      <motion.button
                          whileTap={{ scale: 0.95 }}
                onClick={handleSearch}
                          className="w-full !bg-slate-900 !text-white !font-bold !py-4 !rounded-full shadow-lg shadow-slate-900/20 flex items-center justify-center gap-2"
             >
                <IonIcon icon={search} />
                Search Available Cars
                      </motion.button>
                  </motion.div>

          {/* Results Area */}
                  <motion.div variants={fadeInUp}>
            <div className="flex justify-between items-center mb-4">
               <h3 className="text-lg font-bold text-slate-900">Results</h3>
               <span className="text-xs font-bold text-slate-400 bg-slate-200/50 px-2 py-1 rounded-lg">{results.length} Found</span>
            </div>

            <div className="grid gap-4">
              {results.length === 0 && !isSearching ? (
                 <div className="text-center py-10 opacity-50">
                    <IonIcon icon={carSport} className="text-4xl mb-2 text-slate-300" />
                    <p className="text-sm font-medium">Ready to search</p>
                 </div>
              ) : (
                results.map((car: any) => (
                    <CarCard key={car.id || car._id} car={car} viewMode="list" />
                ))
              )}
            </div>
                  </motion.div>

              </motion.div>
      </IonContent>
    </IonPage>
  );
};

export default Search;
