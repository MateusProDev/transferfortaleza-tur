"use client";

import { Share2 } from 'lucide-react';

interface ShareButtonsProps {
  title: string;
}

export default function ShareButtons({ title }: ShareButtonsProps) {
  const shareToFacebook = () => {
    if (typeof window !== 'undefined') {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank');
    }
  };

  const shareToTwitter = () => {
    if (typeof window !== 'undefined') {
      window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(title)}`, '_blank');
    }
  };

  const shareToWhatsApp = () => {
    if (typeof window !== 'undefined') {
      window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(`${title} - ${window.location.href}`)}`, '_blank');
    }
  };

  return (
    <div className="mt-12 pt-8 border-t flex items-center justify-between flex-wrap gap-4">
      <div className="flex items-center gap-2">
        <Share2 size={20} className="text-gray-600" />
        <span className="text-gray-600 font-medium">Compartilhar</span>
      </div>
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={shareToFacebook}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Facebook
        </button>
        <button
          onClick={shareToTwitter}
          className="px-4 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors"
        >
          Twitter
        </button>
        <button
          onClick={shareToWhatsApp}
          className="px-4 py-2 bg-[#0b5d3a] text-white rounded-lg hover:bg-[#0a4b31] transition-colors"
        >
          WhatsApp
        </button>
      </div>
    </div>
  );
}
