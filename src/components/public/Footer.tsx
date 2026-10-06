"use client";

import Link from 'next/link';
import { Facebook, Instagram, MessageCircle, Mail, Phone, MapPin } from 'lucide-react';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import WhatsAppConversionLink, { isWhatsAppUrl } from './WhatsAppConversionLink';
import { fetchSettingsCached } from '@/lib/settings-cache';
import { replaceLegacyBrand } from '@/lib/brand';

interface SocialLink {
  icon: any;
  href: string;
  label: string;
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

  const socialLinks: SocialLink[] = (settings?.socialLinks || [])
    .filter((social: { url?: string }) => Boolean(social.url))
    .map((social: { platform: string; url: string }) => ({
      icon: social.platform === 'facebook'
        ? Facebook
        : social.platform === 'instagram'
          ? Instagram
          : MessageCircle,
      href: social.platform === 'whatsapp' && !/^https?:\/\//i.test(social.url)
        ? `https://wa.me/${social.url.replace(/\D/g, '')}`
        : social.url,
      label: social.platform[0].toUpperCase() + social.platform.slice(1),
    }));

  if (!socialLinks.some((social) => social.label === 'WhatsApp') && settings?.contactInfo?.whatsapp) {
    socialLinks.push({
      icon: MessageCircle,
      href: `https://wa.me/${settings.contactInfo.whatsapp.replace(/\D/g, '')}`,
      label: 'WhatsApp',
    });
  }

  const quickLinks = [
    { label: 'Pacotes', href: '/passeios' },
    { label: 'Blog', href: '/blog' },
    { label: 'Transfers', href: '/transfer' },
    { label: 'Política', href: '/politica-de-privacidade' },
    { label: 'Contato', href: '/contato' },
  ];

  return (
    <footer className="bg-gray-900 text-white" role="contentinfo">
      <div className="container mx-auto px-4 pt-12 pb-[calc(3rem+env(safe-area-inset-bottom))]">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-5">
          {/* About Section */}
          <div>
            <Link href="/" className="mb-4 flex items-center space-x-2">
              {settings?.headerLogo ? (
                <div className="relative h-10 w-10">
                  <Image
                    src={settings.headerLogo}
                    alt={replaceLegacyBrand(settings.headerLogoAlt || 'Transfer Fortaleza Tur')}
                    fill
                    className="object-contain"
                  />
                </div>
              ) : (
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-600">
                  <span className="text-xl font-bold text-white">PL</span>
                </div>
              )}
              <span className="text-xl font-bold">
                {replaceLegacyBrand(settings?.companyName || 'Transfer Fortaleza Tur')}
              </span>
            </Link>
            <p className="text-gray-400 text-sm">
              {replaceLegacyBrand(settings?.footerText || 'Descubra os melhores passeios e transfers com conforto, segurança e experiências únicas de turismo.')}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Links Rápidos</h2>
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

          {/* External trust links */}
          <div>
            <h2 className="mb-4 text-lg font-semibold">Avaliações e segurança</h2>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://www.tripadvisor.com.br/UserReviewEdit-g23379655-d34005292-Transfer_Fortaleza_Tur-Porto_Das_Dunas_Aquiraz_State_of_Ceara.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-gray-400 transition-colors hover:text-white"
                >
                  Avalie no TripAdvisor
                </a>
              </li>
              <li>
                <a
                  href="https://transparencyreport.google.com/safe-browsing/search?url=transferfortalezatur.com.br&hl=pt_BR"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-gray-400 transition-colors hover:text-white"
                >
                  Verificação Google Safe Browsing
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Contato</h2>
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
            <h2 className="text-lg font-semibold mb-4">Redes Sociais</h2>
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
          <p>&copy; {currentYear} Transfer Fortaleza Tur. Todos os direitos reservados.</p>
          <p className="mt-1">CNPJ: 64.042.188/0001-13</p>
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
