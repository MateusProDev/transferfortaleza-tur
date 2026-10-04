import dynamicImport from "next/dynamic";
import { Metadata } from "next";
import Header from "@/components/public/Header";
import Hero from "@/components/public/Hero";
import AnimatedCounter from "@/components/public/AnimatedCounter";
import { bannerService, tourService, transferService, testimonialService, blogService, faqService, settingsService } from "@/lib/firestore";
import { getSiteUrl } from "@/lib/site-url";

const Tours = dynamicImport(() => import("@/components/public/Tours"), {
  loading: () => <div className="h-[420px] w-full" />,
});

const Transfers = dynamicImport(() => import("@/components/public/Transfers"), {
  loading: () => <div className="h-[420px] w-full" />,
});

const Testimonials = dynamicImport(() => import("@/components/public/Testimonials"), {
  loading: () => <div className="h-[320px] w-full" />,
});

const Blog = dynamicImport(() => import("@/components/public/Blog"), {
  loading: () => <div className="h-[360px] w-full" />,
});

const FAQ = dynamicImport(() => import("@/components/public/FAQ"), {
  loading: () => <div className="h-[280px] w-full" />,
});

const Footer = dynamicImport(() => import("@/components/public/Footer"), {
  loading: () => <div className="h-[220px] w-full" />,
});

// Cache the homepage briefly to keep content fresh without rendering it on every request.
export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  const baseUrl = getSiteUrl();

  return {
    title: "Passeios e Transfers em Fortaleza e Região",
    description: "Reserve passeios e transfers em Fortaleza com conforto e segurança. Praias, dunas, buggy e muito mais. Garanta sua vaga!",
    keywords: ["passeios fortaleza", "tours fortaleza", "transfer fortaleza", "turismo ceará", "passeio legal", "passeios praias", "transfer aeroporto fortaleza", "turismo nordeste", "excursões fortaleza", "viagens ceará"],
    openGraph: {
      type: "website",
      locale: "pt_BR",
      url: baseUrl,
      title: "Passeio Legal - Tours e Transfers em Fortaleza",
      description: "Descubra os melhores passeios turísticos e serviços de transfer em Fortaleza e região com a Passeio Legal.",
      siteName: "Passeio Legal",
      images: [
        {
          url: `${baseUrl}/OG.png`,
          width: 1200,
          height: 630,
          alt: "Passeio Legal - Tours e Transfers",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "Passeio Legal - Tours e Transfers",
      description: "Descubra os melhores passeios turísticos e serviços de transfer em Fortaleza",
      images: [`${baseUrl}/OG.png`],
    },
    alternates: {
      canonical: baseUrl,
    },
  };
}

async function getPageData() {
  try {
    const [banners, tours, transfers, testimonials, blogPosts, faqs, settings] = await Promise.all([
      bannerService.getAll(),
      tourService.getAll(false),
      transferService.getAll(true),
      testimonialService.getAll(),
      blogService.getAll(false),
      faqService.getAll(),
      settingsService.get(),
    ]);

    return {
      banners,
      tours,
      transfers,
      testimonials,
      blogPosts,
      faqs,
      settings,
    };
  } catch (error) {
    console.error("Error fetching page data:", error);
    return {
      banners: [],
      tours: [],
      transfers: [],
      testimonials: [],
      blogPosts: [],
      faqs: [],
      settings: null,
    };
  }
}

export default async function Home() {
  const { banners, tours, transfers, testimonials, blogPosts, faqs, settings } = await getPageData();
  
  const toursEnabled = settings?.sections?.toursEnabled ?? true;
  const transfersEnabled = settings?.sections?.transfersEnabled ?? true;
  const aboutSection = settings?.aboutSection;
  const aboutStats = aboutSection?.stats || [
    { value: 4, label: "Anos de Experiência" },
    { value: 2000, label: "Clientes Satisfeitos" },
    { value: 20, label: "Destinos" },
  ];

  return (
    <main className="min-h-screen pt-20 sm:pt-24">
      <Header />
      
      <Hero banners={banners} />

      {toursEnabled && <Tours tours={tours} />}
      
      {transfersEnabled && <Transfers transfers={transfers} />}

      <section id="about" className="border-t border-gray-200 bg-white py-12 sm:py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10 sm:mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {aboutSection?.title || "Sobre a Passeio Legal"}
            </h2>
            <p className="text-gray-600 max-w-3xl mx-auto text-lg">
              {aboutSection?.description || "Há mais de 10 anos no mercado de turismo, oferecendo experiências únicas e memoráveis para nossos clientes. Nossa missão é proporcionar momentos inesquecíveis com segurança, conforto e profissionalismo."}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {aboutStats.map((stat) => (
              <div className="text-center" key={stat.label}>
                <AnimatedCounter target={stat.value} suffix="+" />
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      <Blog posts={blogPosts} />

      <Testimonials testimonials={testimonials} />
      
      <FAQ faqs={faqs} />
      
      <Footer />
    </main>
  );
}
