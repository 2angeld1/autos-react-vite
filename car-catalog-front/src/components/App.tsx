import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import Home from '../pages/Home';
import CarDetails from '../pages/CarDetails';
import Favorites from '../pages/Favorites';
import About from '../pages/About';
import NotFound from '../pages/NotFound';
import Promotions from '../pages/promotions/Promotions';
import Maintenance from '../pages/maintenance/Maintenance';

import { Toaster } from 'react-hot-toast';

const App: React.FC = () => {
  return (
    <Router>
      <div className="has-navbar-fixed-top">
        <Toaster position="top-right" />
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/car/:id" element={<CarDetails />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/about" element={<About />} />
            <Route path="/promotions" element={<Promotions />} />
            <Route path="/maintenance" element={<Maintenance />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
