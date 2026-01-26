import React from 'react';
import { 
  IonModal, 
  IonContent
} from '@ionic/react';
import { LayoutGrid, Smartphone, ArrowUpNarrowWide, ArrowDownNarrowWide, Calendar, Sparkles, Check, Globe, Wallet } from 'lucide-react';

export type SortOption = 'featured' | 'price-asc' | 'price-desc' | 'year-desc';

interface PreferencesModalProps {
  isOpen: boolean;
  onClose: () => void;
    mode: 'home' | 'showcase';
    viewMode?: 'list' | 'grid';
    onViewModeChange?: (mode: 'list' | 'grid') => void;
    sortOption?: SortOption;
    onSortChange?: (option: SortOption) => void;
}

const PreferencesModal: React.FC<PreferencesModalProps> = ({ 
  isOpen, 
  onClose, 
    mode,
    viewMode = 'list', 
  onViewModeChange,
    sortOption = 'featured',
  onSortChange
}) => {
  return (
    <IonModal 
      isOpen={isOpen} 
      onDidDismiss={onClose}
      initialBreakpoint={0.95} 
      breakpoints={[0, 0.95]}
      handle={true}
      className="custom-sheet-modal"
    >
      <IonContent className="ion-padding">
        <div className="px-2 pt-2 pb-12 bg-white h-full">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-slate-900 m-0 tracking-tight">Preferences</h2>
          </div>

          {/* View Layout Section */}
                  {mode === 'showcase' && (
                      <div className="mb-10">
                          <div className="flex items-center gap-2 mb-4 text-slate-400 uppercase text-[11px] font-bold tracking-widest">
                              <LayoutGrid size={14} />
                              <span>Layout View</span>
                          </div>

                          <div className="bg-slate-100 p-1.5 rounded-2xl flex gap-1">
                              <button
                                  onClick={() => onViewModeChange?.('list')}
                                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${viewMode === 'list'
                                          ? 'bg-white text-slate-900 shadow-sm'
                                          : 'text-slate-500 hover:text-slate-700'
                                      }`}
                              >
                                  <Smartphone size={18} />
                                  <span>Cards</span>
                              </button>
                              <button
                                  onClick={() => onViewModeChange?.('grid')}
                                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${viewMode === 'grid'
                                          ? 'bg-white text-slate-900 shadow-sm'
                                          : 'text-slate-500 hover:text-slate-700'
                                      }`}
                              >
                                  <LayoutGrid size={18} />
                                  <span>Grid</span>
                              </button>
                          </div>
                      </div>
                  )}

          {/* Sort Order Section */}
                  {mode === 'showcase' && (
                      <div className="mb-10">
                          <div className="flex items-center gap-2 mb-4 text-slate-400 uppercase text-[11px] font-bold tracking-widest">
                              <ArrowDownNarrowWide size={14} />
                              <span>Sort Order</span>
                          </div>

                          <div className="flex flex-col gap-3">
                              {[
                                  { id: 'featured', label: 'Featured', sub: 'Recommended for you', icon: Sparkles },
                                  { id: 'price-asc', label: 'Price: Low to High', sub: 'Best deals first', icon: ArrowUpNarrowWide },
                                  { id: 'price-desc', label: 'Price: High to Low', sub: 'Luxury & Premium', icon: ArrowDownNarrowWide },
                                  { id: 'year-desc', label: 'Newest Models', sub: 'Latest arrivals', icon: Calendar },
                              ].map((item) => (
                                  <button
                                      key={item.id}
                        onClick={() => onSortChange?.(item.id as SortOption)}
                        className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all duration-200 active:scale-[0.98] ${sortOption === item.id
                                ? 'bg-slate-50 shadow-sm ring-1 ring-black/5'
                                : 'bg-white hover:bg-slate-50'
                            }`}
                    >
                        <div className="flex items-center gap-4">
                            <div className={`p-2.5 rounded-full transition-colors ${sortOption === item.id
                                    ? 'bg-slate-900 text-white'
                                    : 'bg-slate-100 text-slate-500'
                                }`}>
                                <item.icon size={20} strokeWidth={2} />
                            </div>
                            <div className="text-left">
                                <p className={`font-bold text-sm ${sortOption === item.id ? 'text-slate-900' : 'text-slate-600'}`}>
                                    {item.label}
                                </p>
                                <p className="text-xs font-medium text-slate-400">
                                    {item.sub}
                                </p>
                            </div>
                        </div>
                        {sortOption === item.id && (
                            <div className="bg-green-50 text-green-600 p-1.5 rounded-full">
                                <Check size={18} strokeWidth={3} />
                            </div>
                        )}
                    </button>
                ))}
                          </div>
                      </div>
                  )}

          {/* Language Section */}
                  {mode === 'home' && (
                      <div className="mb-10">
                          <div className="flex items-center gap-2 mb-4 text-slate-400 uppercase text-[11px] font-bold tracking-widest">
                              <Globe size={14} />
                              <span>Region & Language</span>
                          </div>

                          <div className="flex flex-col gap-3">
                              <button className="w-full flex items-center justify-between p-4 rounded-2xl bg-slate-50 shadow-sm ring-1 ring-black/5 transition-all">
                  <div className="flex items-center gap-4">
                                      <span className="text-2xl">🇺🇸</span>
                                      <div className="text-left">
                                          <p className="font-bold text-sm text-slate-900">English (US)</p>
                                          <p className="text-xs font-medium text-slate-400">United States</p>
                                      </div>
                  </div>
                  <div className="bg-green-50 text-green-600 p-1.5 rounded-full">
                                      <Check size={18} strokeWidth={3} />
                  </div>
                              </button>

                              <button className="w-full flex items-center justify-between p-4 rounded-2xl bg-white hover:bg-slate-50 transition-all opacity-60 hover:opacity-100">
                  <div className="flex items-center gap-4">
                                      <span className="text-2xl">🇲🇽</span>
                                      <div className="text-left">
                                          <p className="font-bold text-sm text-slate-600">Español (MX)</p>
                                          <p className="text-xs font-medium text-slate-400">México</p>
                                      </div>
                  </div>
                              </button>
                          </div>
                      </div>
                  )}

          {/* Currency Section */}
                  {mode === 'home' && (
                      <div>
                          <div className="flex items-center gap-2 mb-4 text-slate-400 uppercase text-[11px] font-bold tracking-widest">
                              <Wallet size={14} />
                              <span>Currency</span>
                          </div>

                          <div className="flex flex-col gap-3">
                              <button className="w-full flex items-center justify-between p-4 rounded-2xl bg-slate-50 shadow-sm ring-1 ring-black/5 transition-all">
                  <div className="flex items-center gap-4">
                                      <div className="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center font-bold text-lg">$</div>
                                      <div className="text-left">
                                          <p className="font-bold text-sm text-slate-900">USD - US Dollar</p>
                                          <p className="text-xs font-medium text-slate-400">United States</p>
                                      </div>
                  </div>
                  <div className="bg-green-50 text-green-600 p-1.5 rounded-full">
                                      <Check size={18} strokeWidth={3} />
                  </div>
                              </button>

                              <button className="w-full flex items-center justify-between p-4 rounded-2xl bg-white hover:bg-slate-50 transition-all opacity-60 hover:opacity-100">
                  <div className="flex items-center gap-4">
                                      <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center font-bold text-lg">$</div>
                                      <div className="text-left">
                                          <p className="font-bold text-sm text-slate-600">MXN - Mexican Peso</p>
                                          <p className="text-xs font-medium text-slate-400">Mexico</p>
                                      </div>
                  </div>
                              </button>
                          </div>
                      </div>
                  )}
          
        </div>
      </IonContent>
    </IonModal>
  );
};

export default PreferencesModal;
