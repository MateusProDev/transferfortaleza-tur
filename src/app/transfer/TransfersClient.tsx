"use client";

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Car, Search, Users } from 'lucide-react';
import { BreadcrumbJsonLd } from '@/components/seo/JsonLd';
import { getSiteUrl } from '@/lib/site-url';

interface Transfer {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  imageAlt: string;
  vehicleType: string;
  capacity: number;
  active: boolean;
  slug?: string;
}

export default function TransfersClient() {
  const [transfers, setTransfers] = useState<Transfer[]>([]);
  const [filteredTransfers, setFilteredTransfers] = useState<Transfer[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sectionDisabled, setSectionDisabled] = useState(false);
  const baseUrl = getSiteUrl();
  const breadcrumbItems = [
    { name: 'Início', url: baseUrl },
    { name: 'Transfer', url: `${baseUrl}/transfer` },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [transfersResponse, settingsResponse] = await Promise.all([
          fetch('/api/transfers?active=true', { cache: 'no-store' }),
          fetch('/api/settings', { cache: 'no-store' }),
        ]);
        if (!transfersResponse.ok || !settingsResponse.ok) {
          throw new Error('Falha ao carregar os transfers.');
        }

        const [allTransfers, settingsData] = await Promise.all([
          transfersResponse.json(),
          settingsResponse.json(),
        ]);

        setTransfers(Array.isArray(allTransfers) ? allTransfers : []);
        setFilteredTransfers(Array.isArray(allTransfers) ? allTransfers : []);
        setSectionDisabled(settingsData?.sections?.transfersEnabled === false);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const normalizedSearch = searchTerm.toLowerCase();
    const filtered = transfers.filter((transfer) =>
      (transfer.name || '').toLowerCase().includes(normalizedSearch) ||
      (transfer.description || '').toLowerCase().includes(normalizedSearch)
    );
    setFilteredTransfers(filtered);
  }, [searchTerm, transfers]);

  if (sectionDisabled) {
    return (
      <main className="min-h-screen bg-gray-50 pt-24">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Seção Indisponível</h1>
            <p className="text-gray-600 mb-8">A seção de transfer está temporariamente desativada.</p>
            <Link href="/" className="inline-block bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg transition-colors">
              Voltar para a Página Inicial
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 pt-24">
      <BreadcrumbJsonLd items={breadcrumbItems} />
      <div className="bg-secondary-600 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Serviços de Transfer</h1>
          <p className="text-xl max-w-2xl">Conforto e segurança em seus deslocamentos com nossa frota moderna</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="bg-gray-50 rounded-xl shadow-lg p-6 mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Buscar transfers..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              className="w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-600"
            />
          </div>
          <div className="mt-4 text-sm text-gray-600">
            {filteredTransfers.length} {filteredTransfers.length === 1 ? 'transfer encontrado' : 'transfers encontrados'}
          </div>
        </div>

        {filteredTransfers.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">Nenhum transfer encontrado com os filtros selecionados.</p>
            <button onClick={() => setSearchTerm('')} className="mt-4 text-secondary-600 hover:text-secondary-700 font-medium">
              Limpar filtros
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredTransfers.map((transfer) => (
              <article key={transfer.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow flex flex-col">
                <div className="relative h-48 w-full">
                  {transfer.imageUrl ? (
                    <Image src={transfer.imageUrl} alt={transfer.imageAlt || transfer.name} fill className="object-cover" unoptimized />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-400">Sem imagem</span>
                    </div>
                  )}
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <h2 className="text-xl font-bold text-gray-900 mb-2">{transfer.name}</h2>
                  <p className="text-gray-600 mb-4 line-clamp-2 flex-1">{transfer.description}</p>
                  <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                    <div className="flex items-center space-x-1"><Car size={16} /><span>{transfer.vehicleType || 'Consulte'}</span></div>
                    <div className="flex items-center space-x-1"><Users size={16} /><span>{transfer.capacity > 0 ? `${transfer.capacity} pessoas` : 'Consulte'}</span></div>
                  </div>
                  <div className="flex items-center justify-end">
                    <Link
                      href={`/transfer/${transfer.slug || transfer.id}`}
                      className="bg-secondary-600 hover:bg-secondary-700 text-white px-4 py-2 rounded-lg transition-colors font-medium"
                      aria-label={`Ver detalhes de ${transfer.name}`}
                    >
                      Ver Detalhes
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}