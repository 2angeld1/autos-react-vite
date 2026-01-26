import React, { useMemo, useState } from 'react';
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
import { useHistory } from 'react-router-dom';
import useCarData from '@/hooks/useCarData';
import PreferencesModal, { type SortOption } from '@/components/PreferencesModal';

const DEFAULT_IMAGE = 'https://placehold.co/600x400/f1f5f9/94a3b8?text=No+Image';

const Showcase: React.FC = () => {
  const history = useHistory();
  const { cars, loading } = useCarData();
  
  const [searchText, setSearchText] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('grid'); // Default to grid
  const [sortOption, setSortOption] = useState<SortOption>('featured');
  const [showPreferences, setShowPreferences] = useState(false);

  // Sorting Logic
  const sortedCars = useMemo(() => {
    const filtered = [...cars].filter(car => {
      if (!searchText) return true;
      const lower = searchText.toLowerCase();
      return (
        car.make?.toLowerCase().includes(lower) || 
        car.model?.toLowerCase().includes(lower)
      );
    });

    switch (sortOption) {
      case 'price-asc':
        return filtered.sort((a, b) => (a.price || 0) - (b.price || 0));
      case 'price-desc':
        return filtered.sort((a, b) => (b.price || 0) - (a.price || 0));
      case 'year-desc':
        return filtered.sort((a, b) => (b.year || 0) - (a.year || 0));
      default:
        return filtered;
    }
  }, [cars, sortOption, searchText]);

  const handleRefresh = (event: CustomEvent<any>) => {
    setTimeout(() => {
      window.location.reload(); 
      event.detail.complete();
    }, 1000);
  };

  const getCarImage = (car: any) => {
    if (car.image) return car.image;
    if (car.images && car.images.length > 0) return car.images[0];
    if (car.imageUrl) return car.imageUrl;
    return DEFAULT_IMAGE;
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(price);
  };

  return (
    <IonPage>
      <IonHeader className="ion-no-border bg-white shadow-none">
        <div className="px-6 pt-6 pb-2 bg-white flex justify-between items-end">
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
           <div className={`grid gap-4 ${viewMode === 'grid' ? 'grid-cols-2' : 'grid-cols-1'}`}>
              {sortedCars.map((car: any) => (
                <div 
                  key={car.id || car._id} 
                  onClick={() => history.push(`/car/${car.id || car._id}`)}
                  className="bg-white rounded-[2rem] shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-slate-100 relative cursor-pointer active:scale-95"
                >
                  <div className={`relative bg-slate-100 overflow-hidden ${viewMode === 'list' ? 'aspect-[2/1]' : 'aspect-square'}`}>
                     <img 
                       src={getCarImage(car)} 
                       alt={car.model}
                       className="w-full h-full object-cover"
                       loading="lazy"
                     />
                     <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-2 py-1 rounded-lg shadow-sm">
                        <span className="font-extrabold text-slate-900 text-[10px] tracking-tight">{formatPrice(car.price)}</span>
                     </div>
                  </div>

                  <div className="p-3">
                     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{car.make}</p>
                     <h3 className="font-bold text-slate-900 text-sm leading-tight truncate">{car.model}</h3>
                     <div className="mt-2 flex gap-1">
                        <span className="bg-slate-50 w-full text-center text-slate-500 text-[10px] font-bold py-1 rounded-md capitalize">{car.year}</span>
                        <span className="bg-slate-50 w-full text-center text-slate-500 text-[10px] font-bold py-1 rounded-md capitalize truncate">{car.fuel_type || 'Gas'}</span>
                     </div>
                  </div>
                </div>
              ))}
           </div>
           
           {sortedCars.length === 0 && !loading && (
             <div className="text-center py-20 opacity-50">
               <p>No cars found</p>
             </div>
           )}

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

export default Showcase;
