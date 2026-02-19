import React from 'react';
import DecoHeader from '../components/DecoHeader';
import DecoFooter from '../components/DecoFooter';

interface DecoLayoutProps {
    children: React.ReactNode;
}

export const DecoLayout = ({ children }: DecoLayoutProps) => (
    <div className="min-h-screen bg-[#F5F0EB] font-sans text-[#1a1a1a] overflow-x-hidden selection:bg-[#8B6F47] selection:text-white">
        <DecoHeader />
        <main>{children}</main>
        <DecoFooter />
    </div>
);
