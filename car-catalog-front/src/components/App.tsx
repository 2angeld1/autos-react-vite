import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './layout/Header';
import Footer from './layout/Footer';
import Home from '../pages/Home';
import CarDetails from '../pages/CarDetails';
import Favorites from '../pages/Favorites';
import About from '../pages/About';
import NotFound from '../pages/NotFound';
import Promotions from '../pages/promotions/Promotions';
import Maintenance from '../pages/maintenance/Maintenance';

import { Toaster } from 'react-hot-toast';

import ThemeSwitcher from './common/ThemeSwitcher';

// IronTrail Module
import IronTrailHome from '../modules/irontrail/pages/HomePage';
import SuspensionesPage from '../modules/irontrail/pages/SuspensionesPage';
import AccesoriosPage from '../modules/irontrail/pages/AccesoriosPage';
import CatalogoPage from '../modules/irontrail/pages/CatalogoPage';
import DistribuidoresPage from '../modules/irontrail/pages/DistribuidoresPage';
import ProductDetailPage from '../modules/irontrail/pages/ProductDetailPage';
import LaMarcaPage from '../modules/irontrail/pages/LaMarcaPage';
import TecnologiaPage from '../modules/irontrail/pages/TecnologiaPage';

// LuxJewel Module
import LuxJewelHome from '../modules/luxjewel/pages/HomePage';
import LuxJewelCatalogo from '../modules/luxjewel/pages/CatalogoPage';
import LuxJewelProductDetail from '../modules/luxjewel/pages/ProductDetailPage';
import LuxJewelMaison from '../modules/luxjewel/pages/MaisonPage';
import LuxJewelAtelier from '../modules/luxjewel/pages/AtelierPage';
import LuxJewelContact from '../modules/luxjewel/pages/ContactPage';

// DecoHaus Module
import DecoHausHome from '../modules/decohaus/pages/HomePage';
import DecoHausCatalogo from '../modules/decohaus/pages/CatalogoPage';
import DecoHausProductDetail from '../modules/decohaus/pages/ProductDetailPage';

// Layout Independiente para el sitio principal (VeloDrive)
const MainLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="has-navbar-fixed-top">
    <Header />
    <main>{children}</main>
    <Footer />
    <ThemeSwitcher />
  </div>
);

const App: React.FC = () => {
  return (
    <Router>
      <Toaster position="top-right" />
      <Routes>
        {/* RUTAS IRONTRAIL (Layout propio encapsulado en IronLayout) */}
        <Route path="/irontrail" element={<IronTrailHome />} />
        <Route path="/irontrail/suspensiones" element={<SuspensionesPage />} />
        <Route path="/irontrail/accesorios" element={<AccesoriosPage />} />
        <Route path="/irontrail/catalogo" element={<CatalogoPage />} />
        <Route path="/irontrail/distribuidores" element={<DistribuidoresPage />} />
        <Route path="/irontrail/product/:id" element={<ProductDetailPage />} />
        <Route path="/irontrail/la-marca" element={<LaMarcaPage />} />
        <Route path="/irontrail/tecnologia" element={<TecnologiaPage />} />

        {/* RUTAS LUXJEWEL */}
        <Route path="/luxjewel" element={<LuxJewelHome />} />
        <Route path="/luxjewel/catalogo" element={<LuxJewelCatalogo />} />
        <Route path="/luxjewel/product/:id" element={<LuxJewelProductDetail />} />
        <Route path="/luxjewel/la-maison" element={<LuxJewelMaison />} />
        <Route path="/luxjewel/atelier" element={<LuxJewelAtelier />} />
        <Route path="/luxjewel/contacto" element={<LuxJewelContact />} />

        {/* RUTAS DECOHAUS */}
        <Route path="/decohaus" element={<DecoHausHome />} />
        <Route path="/decohaus/catalogo" element={<DecoHausCatalogo />} />
        <Route path="/decohaus/product/:id" element={<DecoHausProductDetail />} />

        {/* RUTAS PRINCIPALES (VeloDrive) - Envueltas en MainLayout */}
        <Route path="*" element={
          <MainLayout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/car/:id" element={<CarDetails />} />
              <Route path="/favorites" element={<Favorites />} />
              <Route path="/about" element={<About />} />
              <Route path="/promotions" element={<Promotions />} />
              <Route path="/maintenance" element={<Maintenance />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </MainLayout>
        } />
      </Routes>
    </Router>
  );
};

export default App;
