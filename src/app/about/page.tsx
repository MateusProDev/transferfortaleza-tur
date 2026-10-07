import { Metadata } from "next";
import Header from "@/components/public/Header";
import Footer from "@/components/public/Footer";
import AnimatedCounter from "@/components/public/AnimatedCounter";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { getCachedSiteSettings } from "@/lib/public-data-cache";
import { getSiteUrl } from "@/lib/site-url";
import { replaceLegacyBrand } from "@/lib/brand";
import EditableHeading, { getHeadingLevel, isCopyFieldEnabled } from "@/components/public/EditableHeading";

const baseUrl = getSiteUrl();

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getCachedSiteSettings();
  const about = settings?.aboutSection;
  const title = about?.title || "Sobre Nós";
  const description = about?.pageIntro || about?.description
    || "Conheça a Transfer Fortaleza Tur - oferecendo experiências únicas de turismo com conforto, segurança e profissionalismo.";

  return {
    title,
    description,
    alternates: { canonical: `${baseUrl}/sobre` },
    openGraph: {
      title: `${title} - Transfer Fortaleza Tur`,
      description,
      url: `${baseUrl}/sobre`,
      siteName: "Transfer Fortaleza Tur",
      images: [{ url: `${baseUrl}/OG.png`, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} - Transfer Fortaleza Tur`,
      description,
      images: [`${baseUrl}/OG.png`],
    },
  };
}

export const revalidate = 300;

export default async function AboutPage() {
  const settings = await getCachedSiteSettings();
  const aboutSection = settings?.aboutSection;
  const aboutStats = aboutSection?.stats || [
    { value: 10, label: "Anos de Experiência" },
    { value: 5000, label: "Clientes Satisfeitos" },
    { value: 100, label: "Destinos" },
  ];
  const values = aboutSection?.values?.filter(Boolean) || [
    "Segurança em primeiro lugar",
    "Qualidade e excelência no atendimento",
    "Transparência e honestidade",
    "Respeito ao meio ambiente e às comunidades locais",
    "Inovação constante em nossos serviços",
    "Paixão pelo que fazemos",
  ];
  const benefits = aboutSection?.benefits?.length ? aboutSection.benefits : [
    { title: "Guias Experientes", description: "Profissionais qualificados e apaixonados por mostrar o melhor de cada destino." },
    { title: "Veículos Confortáveis", description: "Frota moderna e bem conservada para garantir seu conforto durante as viagens." },
    { title: "Roteiros Exclusivos", description: "Passeios cuidadosamente planejados para oferecer experiências autênticas." },
    { title: "Atendimento 24h", description: "Suporte completo antes, durante e após sua viagem." },
  ];
  const breadcrumbItems = [
    { name: "Início", url: baseUrl },
    { name: "Sobre Nós", url: `${baseUrl}/sobre` },
  ];

  return (
    <main className="min-h-screen pt-24">
      <Header />
      
      <BreadcrumbJsonLd items={breadcrumbItems} />

      {/* Header */}
      <div className="bg-primary-600 text-white py-16">
        <div className="container mx-auto px-4">
          {isCopyFieldEnabled(aboutSection, "title") && <EditableHeading level={getHeadingLevel(aboutSection, "title", "h1")} className="text-4xl md:text-5xl font-bold mb-4">{replaceLegacyBrand(aboutSection?.title || "Sobre a Transfer Fortaleza Tur")}</EditableHeading>}
          {isCopyFieldEnabled(aboutSection, "pageIntro") && <p className="text-xl max-w-2xl">
            {replaceLegacyBrand(aboutSection?.pageIntro || "Conheça nossa história e compromisso com proporcionar experiências inesquecíveis")}
          </p>}
        </div>
      </div>

      {/* About Content */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {isCopyFieldEnabled(aboutSection, "historySection") && <div className="text-center mb-12">
              {isCopyFieldEnabled(aboutSection, "historyTitle") && <EditableHeading level={getHeadingLevel(aboutSection, "historyTitle", "h2")} className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {aboutSection?.historyTitle || "Nossa História"}
              </EditableHeading>}
              {isCopyFieldEnabled(aboutSection, "description") && <p className="text-gray-600 text-lg leading-relaxed">
                {replaceLegacyBrand(aboutSection?.description || "A Transfer Fortaleza Tur nasceu com a missão de proporcionar momentos inesquecíveis para nossos clientes. Somos uma empresa referência em passeios e transfers, sempre focada na qualidade, segurança e satisfação de quem nos escolhe.")}
              </p>}
            </div>}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              {isCopyFieldEnabled(aboutSection, "missionSection") && <div className="bg-gray-50 p-6 rounded-xl">
                {isCopyFieldEnabled(aboutSection, "missionTitle") && <EditableHeading level={getHeadingLevel(aboutSection, "missionTitle", "h3")} className="text-xl font-bold text-gray-900 mb-3">{aboutSection?.missionTitle || "Nossa Missão"}</EditableHeading>}
                {isCopyFieldEnabled(aboutSection, "missionText") && <p className="text-gray-600">
                  {replaceLegacyBrand(aboutSection?.missionText || "Proporcionar experiências turísticas únicas e memoráveis, com segurança, conforto e profissionalismo, superando as expectativas de nossos clientes em cada jornada.")}
                </p>}
              </div>}
              {isCopyFieldEnabled(aboutSection, "visionSection") && <div className="bg-gray-50 p-6 rounded-xl">
                {isCopyFieldEnabled(aboutSection, "visionTitle") && <EditableHeading level={getHeadingLevel(aboutSection, "visionTitle", "h3")} className="text-xl font-bold text-gray-900 mb-3">{aboutSection?.visionTitle || "Nossa Visão"}</EditableHeading>}
                {isCopyFieldEnabled(aboutSection, "visionText") && <p className="text-gray-600">
                  {replaceLegacyBrand(aboutSection?.visionText || "Ser reconhecidos como a melhor empresa de turismo da região, sinônimo de qualidade, confiança e experiências transformadoras.")}
                </p>}
              </div>}
            </div>

            {isCopyFieldEnabled(aboutSection, "valuesSection") && <div className="bg-gray-50 p-6 rounded-xl mb-12">
              {isCopyFieldEnabled(aboutSection, "valuesTitle") && <EditableHeading level={getHeadingLevel(aboutSection, "valuesTitle", "h3")} className="text-xl font-bold text-gray-900 mb-3">{aboutSection?.valuesTitle || "Nossos Valores"}</EditableHeading>}
              <ul className="space-y-2 text-gray-600">
                {values.map((value, index) => <li key={`${value}-${index}`}>• {value}</li>)}
              </ul>
            </div>}

            {isCopyFieldEnabled(aboutSection, "statsSection") && <div className="text-center mb-12">
              {isCopyFieldEnabled(aboutSection, "statsTitle") && <EditableHeading level={getHeadingLevel(aboutSection, "statsTitle", "h2")} className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">{aboutSection?.statsTitle || "Nossos Números"}</EditableHeading>}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                {aboutStats.map((stat) => (
                  <div className="text-center" key={stat.label}>
                    <AnimatedCounter target={stat.value} suffix="+" />
                    <div className="text-gray-600 mt-2">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>}

            {isCopyFieldEnabled(aboutSection, "benefitsSection") && <div className="text-center">
              {isCopyFieldEnabled(aboutSection, "whyChooseTitle") && <EditableHeading level={getHeadingLevel(aboutSection, "whyChooseTitle", "h2")} className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {replaceLegacyBrand(aboutSection?.whyChooseTitle || "Por Que Escolher a Transfer Fortaleza Tur?")}
              </EditableHeading>}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                {benefits.map((benefit) => (
                  <div className="flex items-start gap-4" key={benefit.title}>
                    <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-primary-600 text-xl">✓</span>
                    </div>
                    <div>
                      {isCopyFieldEnabled(aboutSection, "benefitTitle") && <EditableHeading level={getHeadingLevel(aboutSection, "benefitTitle", "h3")} className="font-bold text-gray-900 mb-1">{replaceLegacyBrand(benefit.title)}</EditableHeading>}
                      {isCopyFieldEnabled(aboutSection, "benefitDescription") && <p className="text-gray-600 text-sm">{replaceLegacyBrand(benefit.description)}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}