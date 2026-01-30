import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

export const IronLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="min-h-screen bg-gray-50 font-sans text-gray-900 overflow-x-hidden selection:bg-[#FFD700] selection:text-black">
            <Header />
            <main>{children}</main>
            <Footer />
        </div>
    );
};
