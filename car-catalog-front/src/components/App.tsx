import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import Home from '../pages/Home';
import CarDetails from '../pages/CarDetails';
import Favorites from '../pages/Favorites';
import NotFound from '../pages/NotFound';

const App: React.FC = () => {
  return (
    <Router>
      <div className="has-navbar-fixed-top">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/car/:id" element={<CarDetails />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;