import React from 'react';
import JewelHeader from '../components/JewelHeader';
import JewelFooter from '../components/JewelFooter';

interface JewelLayoutProps {
    children: React.ReactNode;
}

export const JewelLayout = ({ children }: JewelLayoutProps) => (
    <div className="min-h-screen bg-[#0a090c] font-serif text-white overflow-x-hidden selection:bg-[#C9A84C] selection:text-black">
        <JewelHeader />
        <main>{children}</main>
        <JewelFooter />
    </div>
);
