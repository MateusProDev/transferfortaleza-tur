import type { Metadata } from 'next';
import { getCachedSiteSettings } from '@/lib/public-data-cache';
import { getSiteUrl } from '@/lib/site-url';
import { getHomepageOpenGraphImage, stripBrandSuffix, withBrandSuffix } from '@/lib/open-graph';
import EditableHeading, { getHeadingLevel, isCopyFieldEnabled } from '@/components/public/EditableHeading';

const baseUrl = getSiteUrl();

export const revalidate = 86400;

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getCachedSiteSettings();
  const copy = settings?.pageCopy?.privacy;
  const title = stripBrandSuffix(copy?.seoTitle || 'Política de Privacidade');
  const description = copy?.seoDescription || 'Saiba como a Transfer Fortaleza Tur coleta e utiliza dados de navegação e atendimento.';
  const image = await getHomepageOpenGraphImage();

  return {
    title,
    description,
    alternates: { canonical: `${baseUrl}/politica-de-privacidade` },
    openGraph: {
      type: 'website',
      locale: 'pt_BR',
      url: `${baseUrl}/politica-de-privacidade`,
      title: withBrandSuffix(title),
      description,
      siteName: "Transfer Fortaleza Tur",
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

export default async function PrivacyPolicyPage() {
  const copy = (await getCachedSiteSettings())?.pageCopy?.privacy;
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-16 text-slate-800">
      <article className="mx-auto max-w-3xl rounded-xl bg-white p-6 shadow-sm sm:p-10">
        <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-[#0b5d3a]">
          {copy?.brandLabel || 'Transfer Fortaleza Tur'}
        </p>
        {isCopyFieldEnabled(copy, "title") && <EditableHeading level={getHeadingLevel(copy, "title", "h1")} className="mb-4 text-3xl font-bold text-slate-900">
          {copy?.title || 'Política de Privacidade'}
        </EditableHeading>}
        <p className="mb-8 text-sm text-slate-500">
          {copy?.updatedLabel || 'Última atualização'}: {copy?.updatedDate || '15 de setembro de 2026'}
        </p>

        <div className="space-y-8 leading-7">
          {isCopyFieldEnabled(copy, "section1Section") && <section>
            {isCopyFieldEnabled(copy, "section1Title") && <EditableHeading level={getHeadingLevel(copy, "section1Title", "h2")} className="mb-2 text-xl font-semibold text-slate-900">{copy?.section1Title || '1. Quais dados podem ser coletados'}</EditableHeading>}
            {isCopyFieldEnabled(copy, "section1First") && <p>{copy?.section1First || 'Quando você autoriza o uso de cookies, podemos registrar informações de navegação e origem do contato, como o código do clique do anúncio (gclid), parâmetros de campanha (utm), página de entrada, data e hora, navegador e um código de referência do atendimento.'}</p>}
            {isCopyFieldEnabled(copy, "section1Second") && <p className="mt-3">{copy?.section1Second || 'Ao clicar em um botão de WhatsApp, o código de referência pode ser incluído na mensagem preparada para facilitar a identificação do atendimento. A mensagem não é enviada automaticamente pelo site.'}</p>}
          </section>}

          {isCopyFieldEnabled(copy, "section2Section") && <section>
            {isCopyFieldEnabled(copy, "section2Title") && <EditableHeading level={getHeadingLevel(copy, "section2Title", "h2")} className="mb-2 text-xl font-semibold text-slate-900">{copy?.section2Title || '2. Para que usamos esses dados'}</EditableHeading>}
            {isCopyFieldEnabled(copy, "section2Body") && <p>{copy?.section2Body || 'Usamos essas informações para melhorar a experiência de atendimento, identificar a origem dos contatos, medir o desempenho das campanhas e entender quais páginas geram interesse. O código de referência também ajuda nossa equipe a localizar o atendimento relacionado ao contato.'}</p>}
          </section>}

          {isCopyFieldEnabled(copy, "section3Section") && <section>
            {isCopyFieldEnabled(copy, "section3Title") && <EditableHeading level={getHeadingLevel(copy, "section3Title", "h2")} className="mb-2 text-xl font-semibold text-slate-900">{copy?.section3Title || '3. Compartilhamento e armazenamento'}</EditableHeading>}
            {isCopyFieldEnabled(copy, "section3Body") && <p>{copy?.section3Body || 'Os dados podem ser processados pelos serviços necessários para funcionamento do site, registro dos leads, atendimento e medição de campanhas, incluindo Google Ads, Google Analytics 4 via Google Tag Manager ou gtag.js e, quando configurado, Meta Pixel. Essas ferramentas só são carregadas após o consentimento. Também usamos serviços de infraestrutura necessários ao funcionamento da Transfer Fortaleza Tur. Não vendemos esses dados.'}</p>}
          </section>}

          {isCopyFieldEnabled(copy, "section4Section") && <section>
            {isCopyFieldEnabled(copy, "section4Title") && <EditableHeading level={getHeadingLevel(copy, "section4Title", "h2")} className="mb-2 text-xl font-semibold text-slate-900">{copy?.section4Title || '4. Suas escolhas'}</EditableHeading>}
            {isCopyFieldEnabled(copy, "section4Body") && <p>{copy?.section4Body || 'Você pode recusar o consentimento no aviso de cookies. O WhatsApp continuará disponível, mas o site não registrará os dados de rastreamento de campanha nem adicionará o código de referência à mensagem. Você também pode apagar os dados locais do navegador a qualquer momento.'}</p>}
          </section>}

          {isCopyFieldEnabled(copy, "section5Section") && <section>
            {isCopyFieldEnabled(copy, "section5Title") && <EditableHeading level={getHeadingLevel(copy, "section5Title", "h2")} className="mb-2 text-xl font-semibold text-slate-900">{copy?.section5Title || '5. Contato'}</EditableHeading>}
            {isCopyFieldEnabled(copy, "section5Body") && <p>{copy?.section5Body || 'Para dúvidas ou solicitações relacionadas a privacidade e dados pessoais, entre em contato pelos canais disponíveis na página de contato da Transfer Fortaleza Tur.'}</p>}
          </section>}
        </div>
      </article>
    </main>
  );
}
