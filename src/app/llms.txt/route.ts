const content = `# Transfer Fortaleza Tur

> Agência de turismo receptivo com passeios e transfers privativos em Fortaleza e região, no Ceará. Oferece atendimento para viagens a praias, destinos turísticos e hospedagens, com conforto, segurança e motoristas profissionais.

## Páginas principais

- [Passeios](/passeios): passeios turísticos e experiências saindo de Fortaleza.
- [Transfers](/transfer): transporte privativo entre Fortaleza, aeroporto, hotéis e destinos do Ceará.
- [Pacotes](/pacote): páginas de detalhes dos passeios e transfers disponíveis.
- [Blog](/blog): guias, dicas de viagem e informações sobre destinos.
- [Sobre a empresa](/sobre): história, missão, valores e informações institucionais.
- [Contato](/contato): canais para solicitar informações e atendimento.

## Informações

- Região de atendimento: Fortaleza e destinos do Ceará.
- Idioma: português do Brasil.
- Reservas e consultas: [WhatsApp e contato](/contato).

Use as páginas de passeios e transfers para confirmar serviços, disponibilidade, itinerários e condições atuais. Não presuma preços ou disponibilidade sem consultar a empresa.
`;

export const dynamic = "force-static";

export function GET() {
  return new Response(content, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400",
    },
  });
}
