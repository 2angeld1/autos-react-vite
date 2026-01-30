import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

interface IronLayoutProps {
    children: React.ReactNode;
    headerVariant?: 'default' | 'solid';
}

export const IronLayout = ({ children, headerVariant = 'default' }: IronLayoutProps) => {
    return (
        <div className="min-h-screen bg-gray-50 font-sans text-gray-900 overflow-x-hidden selection:bg-[#FFD700] selection:text-black">
            <Header variant={headerVariant} />
            <main>{children}</main>
            <Footer />
        </div>
    );
};
