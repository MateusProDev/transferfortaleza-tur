"use client";

import Link from 'next/link';
import { Facebook, Instagram, MessageCircle, Mail, Phone, MapPin } from 'lucide-react';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { metaPixelEvents } from '@/utils/metaPixel';
import WhatsAppConversionLink, { isWhatsAppUrl } from './WhatsAppConversionLink';
import { fetchSettingsCached } from '@/lib/settings-cache';

interface SocialLink {
  icon: any;
  href: string;
  label: string;
  onClick?: () => void;
}

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await fetchSettingsCached();
        setSettings(data ?? null);
      } catch (error) {
        console.error('Error fetching settings:', error);
      }
    };

    fetchSettings();
  }, []);

  const handleWhatsAppClick = () => {
    metaPixelEvents.contact({
      content_name: 'Footer WhatsApp',
      content_category: 'Contact'
    });
  };

  const socialLinks: SocialLink[] = [
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Instagram, href: '#', label: 'Instagram' },
    ...(settings?.contactInfo?.whatsapp
      ? [{
          icon: MessageCircle,
          href: `https://wa.me/${settings.contactInfo.whatsapp.replace(/\D/g, '')}`,
          label: 'WhatsApp',
          onClick: handleWhatsAppClick,
        }]
      : []),
  ];

  const quickLinks = [
    { label: 'Início', href: '/' },
    ...(settings?.sections?.toursEnabled !== false ? [{ label: 'Passeios', href: '/passeios' }] : []),
    ...(settings?.sections?.transfersEnabled !== false ? [{ label: 'Transfer', href: '/transfer' }] : []),
    { label: 'Blog', href: '/blog' },
    { label: 'Sobre', href: '/about' },
    { label: 'Contato', href: '/contact' },
  ];

  return (
    <footer className="bg-gray-900 text-white" role="contentinfo">
      <div className="container mx-auto px-4 pt-12 pb-[calc(3rem+env(safe-area-inset-bottom))]">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About Section */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              {settings?.headerLogo ? (
                <div className="relative w-10 h-10">
                  <Image
                    src={settings.headerLogo}
                    alt={settings.headerLogoAlt || 'Passeio Legal'}
                    fill
                    className="object-contain"
                  />
                </div>
              ) : (
                <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xl">PL</span>
                </div>
              )}
              <span className="text-xl font-bold">Passeio Legal</span>
            </div>
            <p className="text-gray-400 text-sm">
              Descubra os melhores passeios e transfers com conforto, segurança e experiências únicas de turismo.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Links Rápidos</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contato</h3>
            <ul className="space-y-3">
              {settings?.contactInfo?.phone && (
                <li className="flex items-center space-x-3 text-gray-400 text-sm">
                  <Phone size={18} />
                  <span>{settings.contactInfo.phone}</span>
                </li>
              )}
              {settings?.contactInfo?.email && (
                <li className="flex items-center space-x-3 text-gray-400 text-sm">
                  <Mail size={18} />
                  <span>{settings.contactInfo.email}</span>
                </li>
              )}
              {settings?.contactInfo?.whatsapp && (
                <li className="flex items-center space-x-3 text-gray-400 text-sm">
                  <MessageCircle size={18} />
                  <span>{settings.contactInfo.whatsapp}</span>
                </li>
              )}
              {settings?.contactInfo?.address && (
                <li className="flex items-center space-x-3 text-gray-400 text-sm">
                  <MapPin size={18} />
                  <span>{settings.contactInfo.address}</span>
                </li>
              )}
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Redes Sociais</h3>
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                isWhatsAppUrl(social.href) ? (
                  <WhatsAppConversionLink
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-primary-600 transition-colors"
                    aria-label={social.label}
                    onClick={social.onClick}
                    trackConversion={false}
                  >
                    <social.icon size={20} />
                  </WhatsAppConversionLink>
                ) : (
                  <a
                    key={social.label}
                    href={social.href}
                    className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-primary-600 transition-colors"
                    aria-label={social.label}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={social.onClick}
                  >
                    <social.icon size={20} />
                  </a>
                )
              ))}
            </div>
            <div className="mt-5 flex flex-col items-center gap-5 sm:flex-row sm:items-center sm:gap-2">
              <div className="order-1 w-full sm:relative sm:h-20 sm:w-44">
                <Image
                  src="/cadastur.png"
                  alt="Cadastur"
                  width={352}
                  height={240}
                  className="mx-auto block h-auto w-[70%] object-contain sm:absolute sm:inset-0 sm:h-full sm:w-full"
                />
              </div>
              <div className="order-3 w-full sm:relative sm:h-20 sm:w-44">
                <Image
                  src="/pagamentos.png"
                  alt="Formas de pagamento"
                  width={352}
                  height={240}
                  className="block h-auto w-full object-contain sm:absolute sm:inset-0 sm:h-full"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8 pb-4 text-center text-gray-400 text-sm">
          <p>&copy; {currentYear} Passeio Legal. Todos os direitos reservados.</p>
          <p className="mt-1">CNPJ: 33.175.859/0001-90</p>
          <a
            href="https://turvia.com.br"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-2 hover:text-white transition-colors"
          >
            Desenvolvido por TURVIA
          </a>
          <div className="mt-2 mx-auto w-[60%] max-w-[240px] sm:relative sm:h-20 sm:w-44">
            <Image
              src="/seguranca.png"
              alt="Site certificado e seguro"
              width={240}
              height={180}
              className="mx-auto block h-auto w-full object-contain"
            />
          </div>
        </div>
      </div>
    </footer>
  );
}
