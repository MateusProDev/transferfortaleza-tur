import Image from 'next/image';
import Link from 'next/link';
import { Info, Map, Menu, Newspaper, Phone, X, type LucideIcon } from 'lucide-react';
import { settingsService } from '@/lib/firestore';

interface MenuItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

const menuItems: MenuItem[] = [
  { label: 'Passeios', href: '/passeios', icon: Map },
  { label: 'Transfer', href: '/transfer', icon: Map },
  { label: 'Blog', href: '/blog', icon: Newspaper },
  { label: 'Sobre', href: '/about', icon: Info },
  { label: 'Contato', href: '/contact', icon: Phone },
];

export default async function Header() {
  const settings = await settingsService.get();
  const logoUrl = settings?.headerLogo;
  const logoAlt = settings?.headerLogoAlt || 'Passeio Legal';

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-primary-800/70 bg-gradient-to-r from-primary-700 via-primary-600 to-primary-500 shadow-md">
      <nav className="container mx-auto px-3 py-3 sm:px-4 sm:py-2" role="navigation" aria-label="Navegação principal">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center" aria-label="Passeio Legal - Página inicial">
            {logoUrl ? (
              <div className="flex h-[72px] w-[72px] items-center justify-center overflow-hidden rounded-full bg-white/0 transition-transform duration-200 hover:scale-105 sm:h-[64px] sm:w-[64px] lg:h-[80px] lg:w-[80px]">
                <Image
                  src={logoUrl}
                  alt={logoAlt}
                  width={96}
                  height={96}
                  className="h-full w-full object-contain"
                />
              </div>
            ) : (
              <div className="flex h-[72px] w-[72px] items-center justify-center rounded-full border border-white/40 bg-white/10 text-lg font-black text-white transition-transform duration-200 hover:scale-105 sm:h-[64px] sm:w-[64px] sm:text-xl lg:h-[80px] lg:w-[80px]">
                PL
              </div>
            )}
          </Link>

          <ul className="hidden md:flex items-center space-x-8" role="menubar">
            {menuItems.map((item) => (
              <li key={item.href} role="none">
                <Link
                  href={item.href}
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-white/20"
                  role="menuitem"
                >
                  <item.icon size={17} strokeWidth={2.2} />
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          <details className="group relative md:hidden">
            <summary className="list-none rounded-lg p-2 text-white transition-all duration-200 hover:bg-white/20 cursor-pointer">
              <span className="sr-only">Abrir menu</span>
              <span className="group-open:hidden block">
                <Menu size={26} strokeWidth={2.4} />
              </span>
              <span className="hidden group-open:block">
                <X size={26} strokeWidth={2.4} />
              </span>
            </summary>

            <div className="fixed inset-x-0 top-[90px] z-[60] h-[35vh] min-h-[260px] max-h-[40vh] border-t border-b border-white/10 bg-primary-700 p-3 shadow-2xl">
              <ul className="space-y-2 pt-1" role="menu">
                {menuItems.map((item) => (
                  <li key={item.href} role="none">
                    <Link
                      href={item.href}
                      className="flex items-center gap-3 px-4 py-3 text-base font-semibold text-white transition-colors hover:bg-white/15"
                      role="menuitem"
                    >
                      <item.icon size={18} strokeWidth={2.2} />
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </details>
        </div>
      </nav>
    </header>
  );
}
