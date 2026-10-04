"use client";

import { useState, useEffect } from 'react';
import { MessageCircle } from 'lucide-react';
import { metaPixelEvents } from '@/utils/metaPixel';
import WhatsAppConversionLink from './WhatsAppConversionLink';

interface TourConversionBarProps {
  tourName: string;
  whatsappNumber?: string;
}

export default function TourConversionBar({ tourName, whatsappNumber = "5585997314093" }: TourConversionBarProps) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollThreshold = 300;
      setIsScrolled(window.scrollY > scrollThreshold);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsScrolled(window.scrollY > 300);
  }, []);

  if (!isScrolled) return null;

  const whatsappMessage = encodeURIComponent(`Olá! Gostaria de reservar o passeio: ${tourName}`);
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  const handleWhatsAppClick = () => {
    metaPixelEvents.contact({
      content_name: tourName,
      content_category: 'Tour'
    });
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50 transition-transform duration-300">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate">{tourName}</p>
          </div>
          <WhatsAppConversionLink
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleWhatsAppClick}
            className="flex items-center gap-2 bg-[#0b5d3a] hover:bg-[#0a4b31] text-white px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap"
          >
            <MessageCircle size={18} />
            <span>Solicitar Orçamento</span>
          </WhatsAppConversionLink>
        </div>
      </div>
    </div>
  );
}
