import { Metadata } from "next";
import Header from "@/components/public/Header";
import Footer from "@/components/public/Footer";
import AnimatedCounter from "@/components/public/AnimatedCounter";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { settingsService } from "@/lib/firestore";
import { getSiteUrl } from "@/lib/site-url";

const baseUrl = getSiteUrl();

export const metadata: Metadata = {
  title: "Sobre Nós",
  description: "Conheça a Passeio Legal - Há mais de 10 anos oferecendo experiências únicas de turismo com conforto, segurança e profissionalismo.",
  openGraph: {
    title: "Sobre Nós - Passeio Legal",
    description: "Conheça a Passeio Legal - Há mais de 10 anos oferecendo experiências únicas de turismo",
    url: `${baseUrl}/about`,
  },
};

export const dynamic = "force-dynamic";

export default async function AboutPage() {
  const settings = await settingsService.get();
  const aboutSection = settings?.aboutSection;
  const aboutStats = aboutSection?.stats || [
    { value: 10, label: "Anos de Experiência" },
    { value: 5000, label: "Clientes Satisfeitos" },
    { value: 100, label: "Destinos" },
  ];
  const breadcrumbItems = [
    { name: "Início", url: baseUrl },
    { name: "Sobre Nós", url: `${baseUrl}/about` },
  ];

  return (
    <main className="min-h-screen pt-24">
      <Header />
      
      <BreadcrumbJsonLd items={breadcrumbItems} />

      {/* Header */}
      <div className="bg-primary-600 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{aboutSection?.title || "Sobre a Passeio Legal"}</h1>
          <p className="text-xl max-w-2xl">
            Conheça nossa história e compromisso com proporcionar experiências inesquecíveis
          </p>
        </div>
      </div>

      {/* About Content */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Nossa História
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed">
                {aboutSection?.description || "Há mais de 10 anos no mercado de turismo, a Passeio Legal nasceu com a missão de proporcionar momentos inesquecíveis para nossos clientes. O que começou como um pequeno sonho se transformou em uma empresa referência em passeios e transfers, sempre focada na qualidade, segurança e satisfação de quem nos escolhe."}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              <div className="bg-gray-50 p-6 rounded-xl">
                <h3 className="text-xl font-bold text-gray-900 mb-3">Nossa Missão</h3>
                <p className="text-gray-600">
                  Proporcionar experiências turísticas únicas e memoráveis, com segurança, conforto e profissionalismo, superando as expectativas de nossos clientes em cada jornada.
                </p>
              </div>
              <div className="bg-gray-50 p-6 rounded-xl">
                <h3 className="text-xl font-bold text-gray-900 mb-3">Nossa Visão</h3>
                <p className="text-gray-600">
                  Ser reconhecidos como a melhor empresa de turismo da região, sinônimo de qualidade, confiança e experiências transformadoras.
                </p>
              </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-xl mb-12">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Nossos Valores</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Segurança em primeiro lugar</li>
                <li>• Qualidade e excelência no atendimento</li>
                <li>• Transparência e honestidade</li>
                <li>• Respeito ao meio ambiente e às comunidades locais</li>
                <li>• Inovação constante em nossos serviços</li>
                <li>• Paixão pelo que fazemos</li>
              </ul>
            </div>

            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
                Nossos Números
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                {aboutStats.map((stat) => (
                  <div className="text-center" key={stat.label}>
                    <AnimatedCounter target={stat.value} suffix="+" />
                    <div className="text-gray-600 mt-2">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Por Que Escolher a Passeio Legal?
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-primary-600 text-xl">✓</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">Guias Experientes</h4>
                    <p className="text-gray-600 text-sm">Profissionais qualificados e apaixonados por mostrar o melhor de cada destino.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-primary-600 text-xl">✓</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">Veículos Confortáveis</h4>
                    <p className="text-gray-600 text-sm">Frota moderna e bem conservada para garantir seu conforto durante as viagens.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-primary-600 text-xl">✓</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">Roteiros Exclusivos</h4>
                    <p className="text-gray-600 text-sm">Passeios cuidadosamente planejados para oferecer experiências autênticas.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-primary-600 text-xl">✓</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">Atendimento 24h</h4>
                    <p className="text-gray-600 text-sm">Suporte completo antes, durante e após sua viagem.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}