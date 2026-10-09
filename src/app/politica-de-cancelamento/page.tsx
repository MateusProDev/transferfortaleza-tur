import type { Metadata } from 'next';
import { MessageCircle } from 'lucide-react';
import { getCachedSiteSettings } from '@/lib/public-data-cache';
import { getSiteUrl } from '@/lib/site-url';
import { getHomepageOpenGraphImage, stripBrandSuffix, withBrandSuffix } from '@/lib/open-graph';
import { normalizeBrazilianPhone } from '@/lib/phone';
import EditableHeading, { getHeadingLevel, isCopyFieldEnabled } from '@/components/public/EditableHeading';

const baseUrl = getSiteUrl();
const pagePath = '/politica-de-cancelamento';
const defaultTitle = 'Política de Cancelamento';
const defaultDescription = 'Consulte as condições para cancelamento e alteração de reservas da Transfer Fortaleza Tur.';

export const revalidate = 86400;

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getCachedSiteSettings();
  const copy = settings?.pageCopy?.cancellationPolicy;
  const title = stripBrandSuffix(copy?.seoTitle || defaultTitle);
  const description = copy?.seoDescription || defaultDescription;
  const image = await getHomepageOpenGraphImage();

  return {
    title,
    description,
    alternates: { canonical: `${baseUrl}${pagePath}` },
    openGraph: {
      type: 'website',
      locale: 'pt_BR',
      url: `${baseUrl}${pagePath}`,
      title: withBrandSuffix(title),
      description,
      siteName: 'Transfer Fortaleza Tur',
      images: [{ url: image, alt: 'Transfer Fortaleza Tur' }],
    },
    twitter: {
      card: 'summary_large_image',
      title: withBrandSuffix(title),
      description,
      images: [image],
    },
  };
}

export default async function CancellationPolicyPage() {
  const settings = await getCachedSiteSettings();
  const copy = settings?.pageCopy?.cancellationPolicy;
  const whatsappNumber = normalizeBrazilianPhone(
    settings?.whatsappConfig?.number || settings?.contactInfo?.whatsapp || '5585997314093',
  );
  const sections = [
    {
      number: 1,
      title: copy?.section1Title || '1. Solicitação de cancelamento',
      body: copy?.section1Body || 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. A solicitação de cancelamento deve ser encaminhada pelos canais oficiais de atendimento, com os dados utilizados na reserva e a identificação do serviço contratado.',
    },
    {
      number: 2,
      title: copy?.section2Title || '2. Prazos e condições',
      body: copy?.section2Body || 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. As condições e os prazos podem variar conforme o serviço, a data contratada e as regras informadas no momento da reserva. Confirme essas condições com nossa equipe.',
    },
    {
      number: 3,
      title: copy?.section3Title || '3. Reembolso e taxas',
      body: copy?.section3Body || 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. A existência de reembolso, eventuais taxas e o prazo de processamento dependem das condições aplicáveis à reserva e deverão ser confirmados antes da contratação.',
    },
    {
      number: 4,
      title: copy?.section4Title || '4. Alterações e reagendamento',
      body: copy?.section4Body || 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pedidos de alteração ou reagendamento estão sujeitos à disponibilidade e à confirmação da equipe responsável pelo atendimento.',
    },
    {
      number: 5,
      title: copy?.section5Title || '5. Contato',
      body: copy?.section5Body || 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Para solicitar um cancelamento ou esclarecer as condições da sua reserva, entre em contato pelos canais disponíveis na página de contato.',
    },
  ];

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-16 text-slate-800">
      <article className="mx-auto max-w-3xl rounded-xl bg-white p-6 shadow-sm sm:p-10">
        <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-[#0b5d3a]">
          {copy?.brandLabel || 'Transfer Fortaleza Tur'}
        </p>
        {isCopyFieldEnabled(copy, 'title') && (
          <EditableHeading
            level={getHeadingLevel(copy, 'title', 'h1')}
            className="mb-4 text-3xl font-bold text-slate-900"
          >
            {copy?.title || defaultTitle}
          </EditableHeading>
        )}
        <p className="mb-8 text-sm text-slate-500">
          {copy?.updatedLabel || 'Última atualização'}: {copy?.updatedDate || '09 de outubro de 2026'}
        </p>

        <div className="space-y-8 leading-7">
          {isCopyFieldEnabled(copy, 'introduction') && (
            <p>{copy?.introduction || 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Consulte as condições aplicáveis à sua reserva e, em caso de dúvida, fale com nossa equipe antes de confirmar o serviço.'}</p>
          )}
          {sections.map(({ number, title, body }) => (
            isCopyFieldEnabled(copy, `section${number}Section`) && (
              <section key={number}>
                {isCopyFieldEnabled(copy, `section${number}Title`) && (
                  <EditableHeading
                    level={getHeadingLevel(copy, `section${number}Title`, 'h2')}
                    className="mb-2 text-xl font-semibold text-slate-900"
                  >
                    {title}
                  </EditableHeading>
                )}
                {isCopyFieldEnabled(copy, `section${number}Body`) && <p>{body}</p>}
              </section>
            )
          ))}
        </div>
      </article>
      <a
        href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent('Olá! Gostaria de tirar uma dúvida sobre a política de cancelamento.')}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Fale conosco pelo WhatsApp"
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-green-300 motion-safe:animate-pulse"
      >
        <MessageCircle size={28} aria-hidden="true" />
      </a>
    </main>
  );
}
