import React, { useState, useEffect } from 'react';
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
import { fetchMakes, searchCars } from '@/services/api';
import { useHistory } from 'react-router-dom';

const Search: React.FC = () => {
  const history = useHistory();
  const [makes, setMakes] = useState<string[]>([]);
  const [selectedMake, setSelectedMake] = useState<string>('');
  const [yearRange, setYearRange] = useState({ lower: 2015, upper: 2024 });
  const [results, setResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const loadMakes = async () => {
      const data = await fetchMakes();
      if (data) setMakes(data);
    };
    loadMakes();
    // Load initial cars (Catalog)
    const initialLoad = async () => {
       const res = await searchCars({});
       setResults(res);
    };
    initialLoad();
  }, []);

  const handleSearch = async () => {
    setIsSearching(true);
    // In a real app we would pass all these filters
    // For now we simulate or use the basic search
    try {
      const filters: any = {};
      if (selectedMake) filters.searchTerm = selectedMake;
      if (yearRange.lower > 2015) filters.year = yearRange.lower.toString();
      
      const res = await searchCars(filters);
      setResults(res);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <IonPage>
      <IonHeader className="ion-no-border bg-white shadow-none">
        <div className="px-6 pt-6 pb-2 bg-white">
          <h1 className="text-3xl font-extrabold text-slate-900">Discover</h1>
          <p className="text-slate-500 font-medium">Find your perfect vehicle</p>
        </div>
      </IonHeader>

      <IonContent fullscreen className="bg-slate-50">
        <div className="p-6 space-y-8">
          
          {/* Filters Selection */}
          <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
             
             {/* Make Selector */}
             <div className="mb-6">
               <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Car Make</label>
               <div className="bg-slate-50 rounded-2xl px-2 border border-slate-100">
                 <IonSelect 
                    value={selectedMake} 
                    placeholder="Select Brand" 
                    onIonChange={e => setSelectedMake(e.detail.value)}
                    interface="action-sheet"
                    className="w-full text-slate-900 font-bold"
                 >
                   {makes.map(make => (
                     <IonSelectOption key={make} value={make}>{make}</IonSelectOption>
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
             <button 
                onClick={handleSearch}
                className="w-full !bg-slate-900 !text-white !font-bold !py-4 !rounded-full shadow-lg shadow-slate-900/20 active:scale-95 transition-transform flex items-center justify-center gap-2"
             >
                <IonIcon icon={search} />
                Search Available Cars
             </button>
          </div>

          {/* Results Area */}
          <div>
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
                  <div 
                    key={car.id || car._id} 
                    onClick={() => history.push(`/car/${car.id || car._id}`)}
                    className="bg-white p-3 rounded-2xl shadow-sm flex gap-4 items-center active:scale-95 transition-transform"
                  >
                     <div className="w-20 h-20 bg-slate-100 rounded-xl overflow-hidden flex-shrink-0">
                        <img src={car.image || car.imageUrl || 'https://placehold.co/100'} className="w-full h-full object-cover" />
                     </div>
                     <div>
                        <h4 className="font-bold text-slate-900">{car.make} {car.model}</h4>
                        <p className="text-slate-500 text-xs font-medium mb-1">{car.year}</p>
                        <p className="font-bold text-slate-900 text-sm">${car.price?.toLocaleString()}</p>
                     </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      </IonContent>
    </IonPage>
  );
};

export default Search;
