import React, { useState } from 'react';
import { 
  IonContent, 
  IonHeader, 
  IonPage, 
  IonButtons,
  IonBackButton,
  IonToolbar,
    IonIcon,
    IonModal,
    IonItem,
    IonInput,
    IonRange,
    IonSpinner
} from '@ionic/react';
import { heart, shareSocial, call, calendar, cashOutline, personOutline, mailOutline, phonePortraitOutline, closeOutline, carSport, home, sync } from 'ionicons/icons';
import { useParams, useHistory } from 'react-router-dom';
import { Fuel, Gauge, SlidersHorizontal, MapPin, Calculator } from 'lucide-react';
import { useCarDetail } from '../hooks/useCarDetail';
import { motion } from 'framer-motion';
import { fadeInUp, staggerContainer } from '../animations';
import { createQuote } from '../services/api/quotes';
import { useAuthStore } from '../store/authStore';
import Swal from 'sweetalert2';
import Car3DViewer from '../components/Car3DViewer';

const CarDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const history = useHistory();
    const { user } = useAuthStore();
    const { car, similarCars, loading, formatPrice, getCarImage } = useCarDetail(id);

    // Tab Navigation State
    const [activeTab, setActiveTab] = useState<'resumen' | 'especificaciones' | 'galeria'>('resumen');
    const [activeGalleryTab, setActiveGalleryTab] = useState<'exterior' | 'interior' | '360'>('exterior');

    // Image Zoom State
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [showImageModal, setShowImageModal] = useState(false);

    const handleImageClick = (imageUrl: string) => {
        setSelectedImage(imageUrl);
        setShowImageModal(true);
    };

    // Quote State
    const [showQuoteModal, setShowQuoteModal] = useState(false);
    const [isSubmittingQuote, setIsSubmittingQuote] = useState(false);
    const [quoteForm, setQuoteForm] = useState({
        customerName: user?.name || '',
        email: user?.email || '',
        phone: '',
        downPayment: 20,
        term: 48
    });

    const handleQuoteSubmit = async () => {
        if (!quoteForm.customerName || !quoteForm.email || !quoteForm.phone) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Por favor completa todos los campos de contacto.',
                confirmButtonColor: '#0f172a',
                heightAuto: false
            });
            return;
        }

        setIsSubmittingQuote(true);
        try {
            await createQuote({
                carId: car?.id || (car as any)._id || '',
                ...quoteForm
            });

            Swal.fire({
                icon: 'success',
                title: '¡Cotización Enviada!',
                text: 'Recibirás un correo con el PDF detallado en unos momentos.',
                confirmButtonColor: '#0f172a',
                heightAuto: false
            }).then(() => {
                setShowQuoteModal(false);
            });
        } catch (error: any) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.message || 'No se pudo procesar la cotización. Revisa los datos.',
                confirmButtonColor: '#0f172a',
                heightAuto: false
            });
        } finally {
            setIsSubmittingQuote(false);
        }
    };

    const calculateMonthly = () => {
        if (!car) return 0;
        const price = car.price || 0;
        const downPaymentAmount = (price * (quoteForm.downPayment)) / 100;
        const financedAmount = price - downPaymentAmount;
        const interestRate = 0.15;
        const monthlyInterest = interestRate / 12;
        const months = quoteForm.term;
        const monthlyPayment = (financedAmount * monthlyInterest) / (1 - Math.pow(1 + monthlyInterest, -months));
        return Math.round(monthlyPayment);
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
              <div className="relative w-full h-[50vh] overflow-hidden">
                  <motion.img
                      initial={{ scale: 1.15 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                      src={getCarImage(car)}
                      alt={car.model}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Content Container (Overlapping) */}
              <motion.div
                  initial={{ y: 60, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ type: "spring", damping: 25, stiffness: 100, delay: 0.1 }}
                  className="relative -mt-14 px-6 pb-32 bg-white rounded-t-[0.5rem] shadow-[0_-20px_40px_rgba(0,0,0,0.05)] pt-10"
              >

            {/* Header Info */}
                  <div className="mb-6">
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

                  {/* Main Tabs */}
                  <div className="mb-6 -mx-6 px-6">
                      <div className="flex gap-2 !bg-slate-50 !p-1.5 !rounded-[1.5rem]">
                          {[
                              { id: 'resumen' as const, label: 'Resumen' },
                              { id: 'especificaciones' as const, label: 'Especificaciones' },
                              { id: 'galeria' as const, label: 'Galería' }
                          ].map(tab => (
                              <button
                                  key={tab.id}
                                  onClick={() => setActiveTab(tab.id)}
                                  className={`flex-1 !py-3 !px-4 !text-xs !font-bold !transition-all !relative !rounded-[1.2rem] ${activeTab === tab.id
                                      ? '!bg-white !text-slate-900 !shadow-lg !shadow-slate-900/10'
                                      : '!bg-transparent !text-slate-400'
                                      }`}
                              >
                                  {tab.label}
                              </button>
                          ))}
                      </div>
                  </div>

                  {/* Gallery Sub-Tabs (only visible when Galería is active) */}
                  {activeTab === 'galeria' && (
                      <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mb-6 -mx-6 px-6"
                      >
                          <div className="flex gap-2.5">
                              {[
                                  { id: 'exterior' as const, label: 'Exterior', icon: carSport },
                                  { id: 'interior' as const, label: 'Interior', icon: home },
                                  { id: '360' as const, label: '360°', icon: sync }
                              ].map(tab => (
                                  <button
                                      key={tab.id}
                                      onClick={() => setActiveGalleryTab(tab.id)}
                                      className={`flex-1 !py-3 !px-4 !rounded-[1.2rem] !text-xs !font-bold !transition-all !border-2 ${activeGalleryTab === tab.id
                                          ? '!bg-slate-900 !text-white !shadow-xl !shadow-slate-900/30 !border-slate-900 !scale-[1.02]'
                                          : '!bg-white !text-slate-500 !border-slate-100 hover:!border-slate-200'
                                          }`}
                                  >
                                      <IonIcon icon={tab.icon} className="!mr-1.5 !text-base" />
                                      {tab.label}
                                  </button>
                              ))}
                          </div>
                      </motion.div>
                  )}

                  {/* Tab Content */}
                  <motion.div
                      key={activeTab}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3 }}
                  >
                      {/* Resumen Tab */}
                      {activeTab === 'resumen' && (
                          <div className="space-y-8">
                              {/* Specs Grid */}
                  <motion.div
                      variants={staggerContainer}
                      initial="hidden"
                      whileInView="show"
                      viewport={{ once: true }}
                                  className="grid grid-cols-3 gap-4"
                  >
                      <motion.div variants={fadeInUp} className="bg-slate-50 p-4 rounded-[2rem] flex flex-col items-center justify-center text-center gap-2 aspect-[4/5]">
                                      <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm text-slate-900 mb-1">
                                          <Gauge size={20} strokeWidth={2} />
                                      </div>
                                      <div>
                                          <span className="block text-slate-900 font-bold text-sm leading-tight mb-1">
                                              {car.class ? car.class.split(' ')[0] : 'Sedan'}
                                          </span>
                                          <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Class</span>
                                      </div>
                      </motion.div>

                      <motion.div variants={fadeInUp} className="bg-slate-50 p-4 rounded-[2rem] flex flex-col items-center justify-center text-center gap-2 aspect-[4/5]">
                                      <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm text-slate-900 mb-1">
                                          <Fuel size={20} strokeWidth={2} />
                                      </div>
                                      <div>
                                          <span className="block text-slate-900 font-bold text-sm leading-tight mb-1 capitalize truncate w-full">
                                              {car.fuel_type || 'Gas'}
                                          </span>
                                          <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Fuel</span>
                                      </div>
                      </motion.div>

                      <motion.div variants={fadeInUp} className="bg-slate-50 p-4 rounded-[2rem] flex flex-col items-center justify-center text-center gap-2 aspect-[4/5]">
                                      <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm text-slate-900 mb-1">
                                          <SlidersHorizontal size={20} strokeWidth={2} />
                                      </div>
                                      <div>
                                          <span className="block text-slate-900 font-bold text-sm leading-tight mb-1 capitalize">
                                              {car.transmission === 'a' ? 'Auto' : (car.transmission || 'Auto')}
                                          </span>
                                          <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Trans</span>
                                      </div>
                      </motion.div>
                  </motion.div>

                              {/* Description */}
                              <div>
                                  <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                                      About this vehicle
                                  </h3>
                                  <p className="text-slate-500 leading-relaxed text-sm font-medium">
                                      {car.description || `Experience the power and luxury of this ${car.year} ${car.make} ${car.model}. A perfect blend of style and performance, ready for your next adventure.`}
                                  </p>
                              </div>

                              {/* Similar Vehicles */}
                              {similarCars.length > 0 && (
                                  <div className="pt-6 border-t border-slate-50">
                                      <h3 className="text-lg font-bold text-slate-900 mb-4">Similar Vehicles</h3>
                                      <div className="flex gap-4 overflow-x-auto pb-4 -mx-6 px-6 scrollbar-hide">
                                          {similarCars.map((sCar: any) => (
                                              <motion.div
                                                  key={sCar.id || sCar._id}
                                                  whileTap={{ scale: 0.95 }}
                                                  onClick={() => history.push(`/car/${sCar.id || sCar._id}`)}
                                                  className="flex-shrink-0 w-40 bg-white rounded-2xl border border-slate-100/10 shadow-sm overflow-hidden transition-transform"
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
                                              </motion.div>
                                          ))}
                                      </div>
                                  </div>
                              )}
                          </div>
                      )}

                      {/* Especificaciones Tab */}
                      {activeTab === 'especificaciones' && (
                          <div className="space-y-6">
                              <div>
                                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Technical Specs</h3>
                                  <div className="space-y-3">
                                      {[
                                          { label: 'Engine', value: car.displacement ? `${car.displacement}L` : 'V6 Turbo' },
                                          { label: 'Cylinders', value: car.cylinders || '6' },
                                          { label: 'City MPG', value: car.city_mpg || '21' },
                                          { label: 'Hwy MPG', value: car.highway_mpg || '28' },
                                          { label: 'Transmission', value: car.transmission === 'a' ? 'Automatic' : (car.transmission || 'Automatic') },
                                          { label: 'Fuel Type', value: car.fuel_type || 'Gasoline' },
                                      ].map((item, i) => (
                                          <div key={i} className="flex justify-between items-center py-3 border-b border-slate-50 last:border-0">
                                              <span className="text-slate-500 text-sm font-medium">{item.label}</span>
                                              <span className="font-bold text-slate-900 text-sm">{item.value}</span>
                                          </div>
                                      ))}
                                  </div>
                              </div>
                          </div>
                      )}

                      {/* Galería Tab */}
                      {activeTab === 'galeria' && (
                          <motion.div
                              key={activeGalleryTab}
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ duration: 0.3 }}
                              className="space-y-4"
                          >
                              {activeGalleryTab === 'exterior' && (
                                  <div className="grid grid-cols-2 gap-4">
                                      {[1, 2, 3, 4].map(i => (
                                          <div
                                              key={i}
                                              className="aspect-[4/3] bg-slate-100 rounded-2xl overflow-hidden cursor-pointer active:scale-95 transition-transform"
                                              onClick={() => handleImageClick(getCarImage(car))}
                                          >
                                              <img
                                                  src={getCarImage(car)}
                                                  alt={`Exterior ${i}`}
                                                  className="w-full h-full object-cover"
                                              />
                                          </div>
                                      ))}
                                  </div>
                              )}

                              {activeGalleryTab === 'interior' && (
                                  <div className="space-y-4">
                                      <div
                                          className="aspect-video bg-slate-100 rounded-2xl overflow-hidden cursor-pointer active:scale-95 transition-transform"
                                          onClick={() => handleImageClick('https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=1200&q=90')}
                                      >
                                          <img
                                              src="https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&q=80"
                                              alt="Interior principal"
                                              className="w-full h-full object-cover"
                                          />
                                      </div>
                                      <div className="grid grid-cols-3 gap-3">
                                          <div
                                              className="aspect-square bg-slate-100 rounded-xl overflow-hidden cursor-pointer active:scale-95 transition-transform"
                                              onClick={() => handleImageClick('https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=90')}
                                          >
                                              <img
                                                  src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400&q=80"
                                                  alt="Interior - Dashboard"
                                                  className="w-full h-full object-cover"
                                              />
                                          </div>
                                          <div
                                              className="aspect-square bg-slate-100 rounded-xl overflow-hidden cursor-pointer active:scale-95 transition-transform"
                                              onClick={() => handleImageClick('https://images.unsplash.com/photo-1542362567-b07e54358753?w=800&q=90')}
                                          >
                                              <img
                                                  src="https://images.unsplash.com/photo-1542362567-b07e54358753?w=400&q=80"
                                                  alt="Interior - Steering Wheel"
                                                  className="w-full h-full object-cover"
                                              />
                                          </div>
                                          <div
                                              className="aspect-square bg-slate-100 rounded-xl overflow-hidden cursor-pointer active:scale-95 transition-transform"
                                              onClick={() => handleImageClick('https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800&q=90')}
                                          >
                                              <img
                                                  src="https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=400&q=80"
                                                  alt="Interior - Seats"
                                                  className="w-full h-full object-cover"
                                              />
                                          </div>
                                      </div>
                                  </div>
                              )}

                              {activeGalleryTab === '360' && (
                                  <div className="aspect-video bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl overflow-hidden">
                                      <Car3DViewer />
                                  </div>
                              )}
                          </motion.div>
                      )}
                  </motion.div>

              </motion.div>
      </IonContent>

      {/* Floating Action Bar */}
          <motion.div
              initial={{ y: 100 }}
              animate={{ y: 0 }}
              transition={{ type: "spring", damping: 20, stiffness: 100, delay: 0.3 }}
              className="fixed bottom-0 inset-x-0 bg-white/90 backdrop-blur-xl border-t border-slate-100/50 p-3 z-30"
          >
              <div className="flex gap-2.5 max-w-sm mx-auto">
                  <button
                      onClick={() => setShowQuoteModal(true)}
                      className="flex-1 !bg-white !border !border-indigo-100 !text-slate-900 !font-bold !py-2.5 !px-4 !rounded-full flex items-center justify-center gap-2 shadow-sm transition-all active:scale-95 group"
                  >
                      <div className="w-6 h-6 bg-indigo-50 rounded-full flex items-center justify-center group-active:scale-110 transition-transform">
                          <IonIcon icon={cashOutline} className="text-xs text-indigo-600" />
                      </div>
                      <span className="text-[12px] tracking-wide">Get Quote</span>
                  </button>
                  <button className="flex-[1.2] !bg-slate-900 !text-white !font-bold !py-2.5 !px-4 !rounded-full flex items-center justify-center gap-2 shadow-md transition-all active:scale-95">
                      <IonIcon icon={call} className="text-base" />
                      <span className="text-[12px] tracking-wide">Contact Dealer</span>
                  </button>
              </div>
          </motion.div>

          {/* Quote Modal */}
          <IonModal
              isOpen={showQuoteModal}
              onDidDismiss={() => setShowQuoteModal(false)}
              className="quote-modal"
              initialBreakpoint={0.9}
              breakpoints={[0, 0.9, 1]}
          >
              <div className="h-full bg-white flex flex-col">
                  {/* Header */}
                  <div className="flex items-center justify-between p-6 border-b border-slate-50">
                      <div>
                          <h2 className="text-2xl font-black text-slate-900 leading-none mb-1 text-uppercase">Cotizador</h2>
                          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest leading-none">Tu Financiamiento ideal</p>
                      </div>
                      <button
                          onClick={() => setShowQuoteModal(false)}
                          className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 active:scale-90 transition-transform"
                      >
                          <IonIcon icon={closeOutline} className="text-2xl" />
                      </button>
                  </div>

                  <IonContent className="ion-padding">
                      <div className="space-y-8 pb-10">
                          {/* Car Summary Card */}
                          <div className="bg-slate-900 rounded-[2.5rem] p-6 text-white overflow-hidden relative shadow-xl shadow-indigo-900/20">
                              <div className="relative z-10 flex items-center gap-4">
                                  <div className="w-20 h-20 rounded-2xl overflow-hidden border border-white/10 flex-shrink-0">
                                      <img src={getCarImage(car)} className="w-full h-full object-cover" alt={car.model} />
                                  </div>
                                  <div>
                                      <h3 className="text-lg font-bold leading-tight">{car.make} {car.model}</h3>
                                      <p className="text-indigo-400 font-bold">{formatPrice(car.price)}</p>
                                  </div>
                              </div>
                              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
                          </div>

                          {/* Financing Options */}
                          <div className="space-y-6">
                              <div>
                                  <div className="flex justify-between items-center mb-4">
                                      <h4 className="text-sm font-bold text-slate-900 uppercase tracking-widest flex items-center gap-2">
                                          <IonIcon icon={cashOutline} className="text-indigo-500" />
                                          Enganche
                                      </h4>
                                      <span className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full text-xs font-bold font-mono">
                                          {quoteForm.downPayment}% ({formatPrice((car.price * quoteForm.downPayment) / 100)})
                                      </span>
                                  </div>
                                  <IonRange
                                      min={10}
                                      max={80}
                                      step={5}
                                      value={quoteForm.downPayment}
                                      pin={true}
                                      className="financing-range !p-0"
                                      color="primary"
                                      onIonChange={e => setQuoteForm({ ...quoteForm, downPayment: e.detail.value as number })}
                                  />
                              </div>

                              <div>
                                  <div className="flex justify-between items-center mb-4">
                                      <h4 className="text-sm font-bold text-slate-900 uppercase tracking-widest flex items-center gap-2">
                                          <IonIcon icon={calendar} className="text-indigo-500" />
                                          Plazo
                                      </h4>
                                      <span className="bg-slate-50 text-slate-600 px-3 py-1 rounded-full text-xs font-bold font-mono">
                                          {quoteForm.term} Meses
                                      </span>
                                  </div>
                                  <div className="grid grid-cols-4 gap-2">
                                      {[12, 24, 36, 48, 60, 72].map(t => (
                                          <button
                                              key={t}
                                              onClick={() => setQuoteForm({ ...quoteForm, term: t })}
                                              className={`py-3 rounded-2xl text-xs font-bold transition-all ${quoteForm.term === t
                                                  ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/20'
                                                  : 'bg-slate-50 text-slate-400 hover:bg-slate-100'
                                                  }`}
                                          >
                                              {t}m
                                          </button>
                                      ))}
                                  </div>
                              </div>
                          </div>

                          {/* Monthly Result Card */}
                          <div className="bg-indigo-50 rounded-[2.5rem] p-8 flex flex-col items-center justify-center text-center border border-indigo-100/50">
                              <p className="text-indigo-400 text-[10px] font-bold uppercase tracking-[0.2em] mb-2 leading-none">Mensualidad Estimada</p>
                              <div className="flex items-start gap-1">
                                  <span className="text-indigo-600 text-xl font-bold mt-1">$</span>
                                  <span className="text-5xl font-black text-indigo-600 tracking-tighter tabular-nums leading-none">
                                      {calculateMonthly().toLocaleString()}
                                  </span>
                              </div>
                              <div className="mt-4 flex items-center gap-2 text-[11px] font-bold text-indigo-400 bg-white/50 px-4 py-2 rounded-full backdrop-blur-sm">
                                  <Calculator size={14} />
                                  <span>Tasa fija 15% anual</span>
                              </div>
                          </div>

                          {/* Contact Form */}
                          <div className="space-y-4 pt-4">
                              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 px-2">Información de Contacto</h4>

                              <div className="bg-slate-50 rounded-3xl p-1.5 border border-slate-100/50">
                                  <IonItem lines="none" className="--background: transparent">
                                      <IonIcon icon={personOutline} slot="start" className="text-slate-400 text-lg mr-2" />
                                      <IonInput
                                          placeholder="Nombre Completo"
                                          value={quoteForm.customerName}
                                          className="font-bold text-sm"
                                          onIonInput={e => setQuoteForm({ ...quoteForm, customerName: e.detail.value! })}
                                      />
                                  </IonItem>
                              </div>

                              <div className="bg-slate-50 rounded-3xl p-1.5 border border-slate-100/50">
                                  <IonItem lines="none" className="--background: transparent">
                                      <IonIcon icon={mailOutline} slot="start" className="text-slate-400 text-lg mr-2" />
                                      <IonInput
                                          type="email"
                                          placeholder="Correo Electrónico"
                                          value={quoteForm.email}
                                          className="font-bold text-sm"
                                          onIonInput={e => setQuoteForm({ ...quoteForm, email: e.detail.value! })}
                                      />
                                  </IonItem>
                              </div>

                              <div className="bg-slate-50 rounded-3xl p-1.5 border border-slate-100/50">
                                  <IonItem lines="none" className="--background: transparent">
                                      <IonIcon icon={phonePortraitOutline} slot="start" className="text-slate-400 text-lg mr-2" />
                                      <IonInput
                                          type="tel"
                                          placeholder="Teléfono"
                                          value={quoteForm.phone}
                                          className="font-bold text-sm"
                                          onIonInput={e => setQuoteForm({ ...quoteForm, phone: e.detail.value! })}
                                      />
                                  </IonItem>
                              </div>
                          </div>

                          <button
                              onClick={handleQuoteSubmit}
                              disabled={isSubmittingQuote}
                              className="w-full !bg-indigo-600 !text-white !font-bold !py-5 !px-8 !rounded-[2rem] active:scale-[0.98] transition-all !shadow-2xl !shadow-indigo-600/30 flex items-center justify-center gap-3 disabled:opacity-50 disabled:active:scale-100"
                          >
                              {isSubmittingQuote ? <IonSpinner name="crescent" /> : (
                                  <>
                                      <span className="tracking-wide">Solicitar Cotización Oficial</span>
                                      <IonIcon icon={cashOutline} className="text-xl" />
                                  </>
                              )}
                          </button>

                          <p className="text-center text-[10px] text-slate-400 font-medium px-8 leading-relaxed">
                              * Esta es una cotización informativa sujeta a aprobación de crédito y verificación de datos.
                          </p>
                      </div>
                  </IonContent>
              </div>
          </IonModal>

          {/* Image Zoom Modal */}
          <IonModal
              isOpen={showImageModal}
              onDidDismiss={() => setShowImageModal(false)}
              className="image-zoom-modal"
          >
              <div className="h-full w-full bg-black flex flex-col">
                  {/* Close Button */}
                  <div className="absolute top-0 right-0 z-50 p-4 pt-12">
                      <button
                          onClick={() => setShowImageModal(false)}
                          className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white active:scale-90 transition-transform"
                      >
                          <IonIcon icon={closeOutline} className="text-2xl" />
                      </button>
                  </div>

                  {/* Image Container */}
                  <div className="flex-1 flex items-center justify-center p-4">
                      {selectedImage && (
                          <motion.img
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ duration: 0.3 }}
                              src={selectedImage}
                              alt="Imagen ampliada"
                              className="max-w-full max-h-full object-contain rounded-2xl"
                          />
                      )}
                  </div>

                  {/* Hint Text */}
                  <div className="p-6 text-center">
                      <p className="text-white/60 text-xs font-medium">
                          Pellizca para hacer zoom • Toca para cerrar
                      </p>
                  </div>
              </div>
          </IonModal>
    </IonPage>
  );
};

export default CarDetail;

