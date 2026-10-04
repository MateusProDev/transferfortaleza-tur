"use client";

import { useEffect, useState } from "react";
import { MessageCircle } from "lucide-react";
import { metaPixelEvents } from "@/utils/metaPixel";
import WhatsAppConversionLink from "./WhatsAppConversionLink";

interface TransferConversionBarProps {
  transferName: string;
}

export default function TransferConversionBar({ transferName }: TransferConversionBarProps) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 300);
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!isScrolled) return null;

  const href = `https://wa.me/5585997314093?text=${encodeURIComponent(`Olá! Gostaria de solicitar um orçamento para o transfer: ${transferName}`)}`;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-200 bg-white shadow-lg">
      <div className="container mx-auto flex items-center justify-between gap-4 px-4 py-3">
        <p className="min-w-0 flex-1 truncate text-sm font-semibold text-gray-900">{transferName}</p>
        <WhatsAppConversionLink
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => metaPixelEvents.contact({ content_name: transferName, content_category: "Transfer" })}
          className="flex shrink-0 items-center gap-2 rounded-lg bg-[#0b5d3a] px-4 py-2 font-medium text-white transition-colors hover:bg-[#0a4b31]"
        >
          <MessageCircle size={18} />
          <span>Solicitar orçamento</span>
        </WhatsAppConversionLink>
      </div>
    </div>
  );
}