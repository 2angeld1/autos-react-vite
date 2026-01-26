import React from 'react';
import { 
  IonContent, 
  IonHeader, 
  IonPage, 
  IonIcon
} from '@ionic/react';
import { heart } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';

const Favorites: React.FC = () => {
  const history = useHistory();
  // Placeholder state - in real implementation this would come from Context/LocalStorage
  const favorites: any[] = []; 

  return (
    <IonPage>
      <IonHeader className="ion-no-border bg-white shadow-none">
        <div className="px-6 pt-6 pb-2 bg-white">
          <h1 className="text-3xl font-extrabold text-slate-900">Saved Cars</h1>
          <p className="text-slate-500 font-medium">Your dream collection</p>
        </div>
      </IonHeader>

      <IonContent fullscreen className="bg-slate-50">
        {favorites.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center p-6 text-center">
             <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-6 text-slate-300">
               <IonIcon icon={heart} className="text-4xl" />
             </div>
             <h2 className="text-xl font-bold text-slate-900 mb-2">No favorites yet</h2>
             <p className="text-slate-400 mb-8 max-w-xs">Start exploring and save the cars you love to see them here.</p>
             <button 
               onClick={() => history.push('/home')}
               className="!bg-slate-900 !text-white !font-bold !py-4 !px-8 !rounded-full shadow-lg shadow-slate-900/20 active:scale-95 transition-transform"
             >
               Explore Cars
             </button>
          </div>
        ) : (
          <div className="p-4 grid gap-4">
             {/* List would go here */}
          </div>
        )}
      </IonContent>
    </IonPage>
  );
};

export default Favorites;
