import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Política de Privacidade',
  description: 'Saiba como a Passeio Legal coleta e utiliza dados de navegação e atendimento.',
};

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-16 text-slate-800">
      <article className="mx-auto max-w-3xl rounded-xl bg-white p-6 shadow-sm sm:p-10">
        <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-[#0b5d3a]">Passeio Legal</p>
        <h1 className="mb-4 text-3xl font-bold text-slate-900">Política de Privacidade</h1>
        <p className="mb-8 text-sm text-slate-500">Última atualização: 15 de setembro de 2026</p>

        <div className="space-y-8 leading-7">
          <section>
            <h2 className="mb-2 text-xl font-semibold text-slate-900">1. Quais dados podem ser coletados</h2>
            <p>
              Quando você autoriza o uso de cookies, podemos registrar informações de navegação e origem do contato,
              como o código do clique do anúncio (<code>gclid</code>), parâmetros de campanha (<code>utm</code>),
              página de entrada, data e hora, navegador e um código de referência do atendimento.
            </p>
            <p className="mt-3">
              Ao clicar em um botão de WhatsApp, o código de referência pode ser incluído na mensagem preparada para
              facilitar a identificação do atendimento. A mensagem não é enviada automaticamente pelo site.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-xl font-semibold text-slate-900">2. Para que usamos esses dados</h2>
            <p>
              Usamos essas informações para melhorar a experiência de atendimento, identificar a origem dos contatos,
              medir o desempenho das campanhas e entender quais páginas geram interesse. O código de referência também
              ajuda nossa equipe a localizar o atendimento relacionado ao contato.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-xl font-semibold text-slate-900">3. Compartilhamento e armazenamento</h2>
            <p>
              Os dados podem ser processados pelos serviços necessários para funcionamento do site, registro dos leads,
              atendimento e medição de campanhas, incluindo Google Ads e serviços de infraestrutura utilizados pela
              Passeio Legal. Não vendemos esses dados.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-xl font-semibold text-slate-900">4. Suas escolhas</h2>
            <p>
              Você pode recusar o consentimento no aviso de cookies. O WhatsApp continuará disponível, mas o site não
              registrará os dados de rastreamento de campanha nem adicionará o código de referência à mensagem.
              Você também pode apagar os dados locais do navegador a qualquer momento.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-xl font-semibold text-slate-900">5. Contato</h2>
            <p>
              Para dúvidas ou solicitações relacionadas a privacidade e dados pessoais, entre em contato pelos canais
              disponíveis na página de contato da Passeio Legal.
            </p>
          </section>
        </div>
      </article>
    </main>
  );
}