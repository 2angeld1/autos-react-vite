import React from 'react';
import { 
  IonContent, 
  IonPage, 
  IonIcon
} from '@ionic/react';
import { person, settings, logOut, carSport, card, notifications } from 'ionicons/icons';

const Profile: React.FC = () => {
  return (
    <IonPage>
       <IonContent fullscreen className="bg-slate-50">
          {/* Header Background */}
          <div className="bg-slate-900 h-48 relative overflow-hidden">
             <div className="absolute top-0 right-0 p-32 bg-slate-800 rounded-full -mr-16 -mt-16 opacity-50" />
             <div className="absolute bottom-0 left-0 p-24 bg-slate-800 rounded-full -ml-12 -mb-12 opacity-50" />
          </div>

          {/* Profile Card */}
          <div className="px-6 -mt-12 mb-6">
             <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100 text-center relative">
                <div className="w-24 h-24 bg-slate-200 rounded-full mx-auto border-4 border-white shadow-sm -mt-16 mb-4 overflow-hidden relative">
                   <IonIcon icon={person} className="text-5xl text-slate-400 mt-4 translate-y-2" />
                </div>
                <h1 className="text-xl font-extrabold text-slate-900">Guest User</h1>
                <p className="text-slate-500 text-sm font-medium">Miami, FL</p>
                
                <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-slate-50">
                   <div>
                      <span className="block text-xl font-bold text-slate-900">0</span>
                      <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Saved</span>
                   </div>
                   <div>
                      <span className="block text-xl font-bold text-slate-900">0</span>
                      <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Test Drives</span>
                   </div>
                </div>
             </div>
          </div>

          {/* Menu Options */}
          <div className="px-6 pb-20 space-y-4">
             <div className="bg-white rounded-[2rem] p-2 shadow-sm border border-slate-100">
                {[
                  { icon: carSport, label: 'My Requests', badge: '2' },
                  { icon: card, label: 'Payment Methods' },
                  { icon: notifications, label: 'Notifications', badge: 'New' },
                  { icon: settings, label: 'Settings' },
                ].map((item, i) => (
                   <button key={i} className="w-full flex items-center justify-between p-4 rounded-xl hover:bg-slate-50 transition-colors group">
                      <div className="flex items-center gap-4">
                         <div className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center text-slate-600 group-hover:bg-white group-hover:shadow-sm transition-all">
                            <IonIcon icon={item.icon} />
                         </div>
                         <span className="font-bold text-slate-700 text-sm">{item.label}</span>
                      </div>
                      {item.badge && (
                         <span className="bg-red-50 text-red-500 text-[10px] font-bold px-2 py-1 rounded-full">{item.badge}</span>
                      )}
                   </button>
                ))}
             </div>

             <button className="w-full !bg-white !text-red-500 !font-bold !py-4 !rounded-full shadow-sm !border !border-slate-100 flex items-center justify-center gap-2 active:scale-95 transition-transform">
                <IonIcon icon={logOut} />
                Log Out
             </button>
             
             <p className="text-center text-xs text-slate-400 font-medium py-4">VeloDrive v1.0.0</p>
          </div>
       </IonContent>
    </IonPage>
  );
};

export default Profile;
