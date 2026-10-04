import { adminDb } from '../src/lib/firebase-admin';

// Dados dos passeios fornecidos
const tourPackages = [
  {
    name: '3 Praias em 1 Dia',
    description: 'O melhor passeio de buggy do Ceará! Venha conhecer e se encantar com essas 3 lindas praias do litoral leste do Ceará. Seja no modo privativo ou excursão, você vai adorar esse roteiro, que tem tudo o que um bom aventureiro procura.',
    longDescription: '3 Praias em 1 Dia - O melhor passeio de buggy do Ceará! Venha conhecer e se encantar com essas 3 lindas praias do litoral leste do Ceará. Seja no modo privativo ou excursão, você vai adorar esse roteiro, que tem tudo o que um bom aventureiro procura.',
    mainImageUrl: 'https://res.cloudinary.com/demo/image/upload/v1/3-praias-1-dia',
    mainImageAlt: '3 Praias em 1 Dia - Passeio de buggy no Ceará',
    galleryImages: [],
    price: 0,
    duration: 'Dia todo',
    includesItems: ['Passeio de buggy', 'Paradas nas praias', 'Guia especializado'],
    excludesItems: ['Alimentação', 'Bebidas', 'Gastos pessoais'],
    featured: true,
    active: true,
  },
  {
    name: '3 Praias VIP em 1 Dia',
    description: 'Este passeio junta o melhor do passeio de 3 Praias em 1 Dia com o exuberante Caribe do Ceará. Você vai conhecer uma paisagem incrível de encontro do rio com o mar, formando piscinas naturais de águas quentes e tranquilas.',
    longDescription: '3 Praias VIP em 1 Dia - Este passeio junta o melhor do passeio de 3 Praias em 1 Dia com o exuberante Caribe do Ceará. Você vai conhecer uma paisagem incrível de encontro do rio com o mar, formando piscinas naturais de águas quentes e tranquilas.',
    mainImageUrl: 'https://res.cloudinary.com/demo/image/upload/v1/3-praias-vip',
    mainImageAlt: '3 Praias VIP em 1 Dia - Caribe do Ceará',
    galleryImages: [],
    price: 0,
    duration: 'Dia todo',
    includesItems: ['Passeio de buggy', 'Caribe do Ceará', 'Piscinas naturais', 'Guia especializado'],
    excludesItems: ['Alimentação', 'Bebidas', 'Gastos pessoais'],
    featured: true,
    active: true,
  },
  {
    name: 'Águas Belas',
    description: 'Águas Belas é uma praia muito apreciada do litoral leste, com águas claras e quentinhas. Você vai aproveitar as piscinas naturais na praia, ou ainda desfrutar do Rio Malcozinhado se optar pelo passeio opcional de buggy no nosso ponto de apoio, que possui uma excelente estrutura e gastronomia muito elogiada.',
    longDescription: 'Águas Belas - Praia muito apreciada do litoral leste, com águas claras e quentinhas. Você vai aproveitar as piscinas naturais na praia, ou ainda desfrutar do Rio Malcozinhado se optar pelo passeio opcional de buggy no nosso ponto de apoio.',
    mainImageUrl: 'https://res.cloudinary.com/demo/image/upload/v1/aguas-belas',
    mainImageAlt: 'Águas Belas - Praia do litoral leste do Ceará',
    galleryImages: [],
    price: 0,
    duration: 'Dia todo',
    includesItems: ['Acesso à praia', 'Piscinas naturais', 'Ponto de apoio'],
    excludesItems: ['Alimentação', 'Bebidas', 'Passeio de buggy opcional'],
    featured: false,
    active: true,
  },
  {
    name: 'Beach Park',
    description: 'Este passeio tem na modalidade privativo e excursão com saída de Fortaleza as 09:00 e regresso as 17:00 horas. O Beach Park é o maior parque aquático da América Latina e está localizado na cidade de Aquiraz no Ceará, na praia do Porto das Dunas, muito apreciada por sua beleza, segurança, limpeza e tranquilidade.',
    longDescription: 'Beach Park - O maior parque aquático da América Latina, localizado em Aquiraz no Ceará. Modalidade privativo e excursão com saída de Fortaleza às 09:00 e regresso às 17:00 horas.',
    mainImageUrl: 'https://res.cloudinary.com/demo/image/upload/v1/beach-park',
    mainImageAlt: 'Beach Park - Maior parque aquático da América Latina',
    galleryImages: [],
    price: 0,
    duration: '09:00 - 17:00',
    includesItems: ['Ingresso Beach Park', 'Transporte', 'Guia'],
    excludesItems: ['Alimentação', 'Bebidas', 'Gastos pessoais'],
    featured: true,
    active: true,
  },
  {
    name: 'Caribe do Ceará',
    description: 'O passeio oferece paradas no Centro de Artesanato de Aquiraz, onde você poderá ver a maior Renda de Bilro sendo elaborada, e também na Estação Nordestina, onde você encontra a Maior Rapadura do mundo, inclusive com degustação de rapaduras com até 50 sabores variados e cachaças artesanais.',
    longDescription: 'Caribe do Ceará - Paradas no Centro de Artesanato de Aquiraz e na Estação Nordestina. Visite a maior Renda de Bilro e a Maior Rapadura do mundo com degustação.',
    mainImageUrl: 'https://res.cloudinary.com/demo/image/upload/v1/caribe-ceara',
    mainImageAlt: 'Caribe do Ceará - Centro de Artesanato e Estação Nordestina',
    galleryImages: [],
    price: 0,
    duration: 'Dia todo',
    includesItems: ['Centro de Artesanato', 'Estação Nordestina', 'Degustação de rapaduras', 'Transporte'],
    excludesItems: ['Alimentação', 'Bebidas', 'Gastos pessoais'],
    featured: true,
    active: true,
  },
  {
    name: 'Canoa Quebrada',
    description: 'Um lugar mágico e de mar verde, Canoa Quebrada é um dos pontos mais visitados do Ceará. A sua beleza que conquistou os europeus é um dos destaques desse passeio. Possui um excelente ponto de apoio, com ótima estrutura e o melhor da culinária regional.',
    longDescription: 'Canoa Quebrada - Lugar mágico e de mar verde, um dos pontos mais visitados do Ceará. Beleza que conquistou os europeus. Excelente ponto de apoio com ótima estrutura e culinária regional.',
    mainImageUrl: 'https://res.cloudinary.com/demo/image/upload/v1/canoa-quebrada',
    mainImageAlt: 'Canoa Quebrada - Mar verde e dunas',
    galleryImages: [],
    price: 0,
    duration: 'Dia todo',
    includesItems: ['Transporte', 'Ponto de apoio', 'Guia especializado'],
    excludesItems: ['Alimentação', 'Bebidas', 'Gastos pessoais'],
    featured: true,
    active: true,
  },
  {
    name: 'City Tour',
    description: 'Nosso City Tour privativo tem uma duração média de 5h, com horário flexível e ajustado de acordo com os seus pontos de interesse. Entre os principais destaques temos a Praia do Futuro e a sua impressionante estrutura que recebe e acolhe o turista, a imponente Catedral Metropolitana, o Centro Cultural Dragão do Mar, o Museu da Cultura Cearense, o lindíssimo Teatro José de Alencar, a Estátua de Iracema, o Mercado dos Peixes, a belíssima orla de Fortaleza, formada pelas praias de Iracema, Meireles e Mucuripe.',
    longDescription: 'City Tour privativo com duração média de 5h, horário flexível. Destaques: Praia do Futuro, Catedral Metropolitana, Centro Cultural Dragão do Mar, Museu da Cultura Cearense, Teatro José de Alencar, Estátua de Iracema, Mercado dos Peixes, orla de Fortaleza.',
    mainImageUrl: 'https://res.cloudinary.com/demo/image/upload/v1/city-tour',
    mainImageAlt: 'City Tour Fortaleza - Pontos turísticos',
    galleryImages: [],
    price: 0,
    duration: '5 horas',
    includesItems: ['Transporte privativo', 'Guia especializado', 'Ingressos'],
    excludesItems: ['Alimentação', 'Bebidas', 'Gastos pessoais'],
    featured: false,
    active: true,
  },
  {
    name: 'Cumbuco',
    description: 'Point do kitesurf e do surf, Cumbuco também ostenta o título de passeio de buggy mais radical do Ceará, com suas dunas e lagoas fascinantes, onde você poderá curtir atrações como tirolesa, skibunda, jet-ski, banana boat, jangada, quadriciclo e passeio à cavalo pela praia (opcionais).',
    longDescription: 'Cumbuco - Point do kitesurf e do surf, passeio de buggy mais radical do Ceará. Dunas e lagoas fascinantes com atrações como tirolesa, skibunda, jet-ski, banana boat, jangada, quadriciclo e passeio à cavalo.',
    mainImageUrl: 'https://res.cloudinary.com/demo/image/upload/v1/cumbuco',
    mainImageAlt: 'Cumbuco - Dunas e lagoas para kitesurf',
    galleryImages: [],
    price: 0,
    duration: 'Dia todo',
    includesItems: ['Acesso à praia', 'Ponto de apoio', 'Transporte'],
    excludesItems: ['Atrações opcionais', 'Alimentação', 'Bebidas'],
    featured: true,
    active: true,
  },
  {
    name: 'Flechaú',
    description: 'Esse passeio está disponível no modo privativo, com saída sugerida entre 7h e 8h da manhã e combina o que há de melhor entre Flecheiras (Piscinas Naturais) e Mundaú (Passeio de Catamarã pelo Rio Mundaú).',
    longDescription: 'Flechaú - Passeio privativo com saída entre 7h e 8h. Combina Flecheiras (Piscinas Naturais) e Mundaú (Passeio de Catamarã pelo Rio Mundaú).',
    mainImageUrl: 'https://res.cloudinary.com/demo/image/upload/v1/flechau',
    mainImageAlt: 'Flechaú - Flecheiras e Mundaú',
    galleryImages: [],
    price: 0,
    duration: 'Dia todo',
    includesItems: ['Piscinas naturais', 'Passeio de catamarã', 'Transporte'],
    excludesItems: ['Alimentação', 'Bebidas', 'Gastos pessoais'],
    featured: false,
    active: true,
  },
  {
    name: 'Flecheiras',
    description: 'Flecheiras é uma praia do litoral oeste do Ceará de beleza sem igual, tem águas claras e piscinas naturais que formam uma paisagem incrível. Você vem a Flecheiras e fica encantado com a beleza do lugar, sem dúvida é um cartão postal, onde você pode se desligar de tudo.',
    longDescription: 'Flecheiras - Praia do litoral oeste do Ceará de beleza sem igual. Águas claras e piscinas naturais que formam uma paisagem incrível. Cartão postal onde você pode se desligar de tudo.',
    mainImageUrl: 'https://res.cloudinary.com/demo/image/upload/v1/flecheiras',
    mainImageAlt: 'Flecheiras - Praia do litoral oeste do Ceará',
    galleryImages: [],
    price: 0,
    duration: 'Dia todo',
    includesItems: ['Acesso à praia', 'Piscinas naturais', 'Transporte'],
    excludesItems: ['Alimentação', 'Bebidas', 'Gastos pessoais'],
    featured: false,
    active: true,
  },
  {
    name: 'Guaramiranga',
    description: 'Conheça Guaramiranga, a Cidade das Flores! Um roteiro explorando a região do Maciço de Baturité, e essa charmosa cidade, que apresenta um clima agradável, com temperaturas amenas e diversos cenários encantadores, sendo também conhecida como a Suíça Cearense.',
    longDescription: 'Guaramiranga - A Cidade das Flores! Roteiro explorando a região do Maciço de Baturité. Clima agradável, temperaturas amenas e diversos cenários encantadores. Conhecida como a Suíça Cearense.',
    mainImageUrl: 'https://res.cloudinary.com/demo/image/upload/v1/guaramiranga',
    mainImageAlt: 'Guaramiranga - Cidade das Flores, Suíça Cearense',
    galleryImages: [],
    price: 0,
    duration: 'Dia todo',
    includesItems: ['Transporte', 'Guia especializado', 'Visitação a pontos turísticos'],
    excludesItems: ['Alimentação', 'Bebidas', 'Gastos pessoais'],
    featured: false,
    active: true,
  },
  {
    name: 'Icaraí de Amontada',
    description: 'Icaraizinho, ou Icaraí de Amontada é uma praia linda e tranquila no litoral oeste do Ceará, com localização privilegiada e é conhecida mundialmente por ser um point dos esportes de vento, especialmente do kitesurf e do windsurf.',
    longDescription: 'Icaraí de Amontada - Praia linda e tranquila no litoral oeste do Ceará. Localização privilegiada, conhecida mundialmente como point dos esportes de vento, especialmente kitesurf e windsurf.',
    mainImageUrl: 'https://res.cloudinary.com/demo/image/upload/v1/icarai-amontada',
    mainImageAlt: 'Icaraí de Amontada - Point de kitesurf e windsurf',
    galleryImages: [],
    price: 0,
    duration: 'Dia todo',
    includesItems: ['Acesso à praia', 'Transporte', 'Ponto de apoio'],
    excludesItems: ['Alimentação', 'Bebidas', 'Gastos pessoais'],
    featured: false,
    active: true,
  },
  {
    name: 'Icapuí',
    description: 'Um dos destinos mais charmosos e exclusivos do litoral Cearense. Que tal aquele mergulho rodeado pelos mais belos e coloridos peixinhos? Encante-se com Icapuí e seus verdes coqueiros, praias, dunas e, LAGOSTAS, sim, Icapuí e conhecida como a Terra da Lagosta, devido à sua abundante presença, essa iguaria tem aqui o melhor preço do Ceará.',
    longDescription: 'Icapuí - Um dos destinos mais charmosos e exclusivos do litoral Cearense. Mergulho rodeado por belos peixinhos. Verdes coqueiros, praias, dunas. Conhecida como a Terra da Lagosta, com melhor preço do Ceará.',
    mainImageUrl: 'https://res.cloudinary.com/demo/image/upload/v1/icapui',
    mainImageAlt: 'Icapuí - Terra da Lagosta, litoral cearense',
    galleryImages: [],
    price: 0,
    duration: 'Dia todo',
    includesItems: ['Acesso à praia', 'Transporte', 'Ponto de apoio'],
    excludesItems: ['Alimentação', 'Bebidas', 'Gastos pessoais'],
    featured: false,
    active: true,
  },
  {
    name: 'Jericoacoara',
    description: 'Este passeio está disponível na modalidade privativo, com saída à combinar, e excursão com saída às 03:00 da manhã e retorno às 18:00h. Jericoacoara é simplesmente a praia mais visitada e mais bela do Ceará.',
    longDescription: 'Jericoacoara - A praia mais visitada e mais bela do Ceará. Modalidade privativo (saída a combinar) e excursão (saída às 03:00, retorno às 18:00h).',
    mainImageUrl: 'https://res.cloudinary.com/demo/image/upload/v1/jericoacoara',
    mainImageAlt: 'Jericoacoara - A praia mais bela do Ceará',
    galleryImages: [],
    price: 0,
    duration: 'Dia todo',
    includesItems: ['Transporte', 'Guia especializado', 'Acesso a pontos turísticos'],
    excludesItems: ['Alimentação', 'Bebidas', 'Gastos pessoais'],
    featured: true,
    active: true,
  },
  {
    name: 'Lagoinha',
    description: 'Você que vem para Lagoinha pode curtir esse passeio que é muito apreciado, o 3 em 1, sendo um trajeto percorrido de buggy pelas dunas, nascentes de água doce, mirante central da praia, além das lagoas do Jegue e das Almécegas, onde começa a etapa no catamarã que tem parada para banho.',
    longDescription: 'Lagoinha - Passeio 3 em 1 muito apreciado. Trajeto de buggy pelas dunas, nascentes de água doce, mirante central da praia, lagoas do Jegue e das Almécegas. Etapa no catamarã com parada para banho.',
    mainImageUrl: 'https://res.cloudinary.com/demo/image/upload/v1/lagoinha',
    mainImageAlt: 'Lagoinha - Passeio 3 em 1 com buggy e catamarã',
    galleryImages: [],
    price: 0,
    duration: 'Dia todo',
    includesItems: ['Passeio de buggy', 'Catamarã', 'Paradas para banho', 'Transporte'],
    excludesItems: ['Alimentação', 'Bebidas', 'Gastos pessoais'],
    featured: false,
    active: true,
  },
  {
    name: 'Morro Branco',
    description: 'Morro Branco tem a sua beleza natural nas falésias que a cerca, sendo lar das areias coloridas e artesanatos locais. Morro Branco é ideal para você que procura descanso e um pouco de natureza. Temos como opcional no local o mais elogiado passeio de buggy, no qual você poderá conhecer mais 2 praias e uma linda lagoa, sempre com parada para aquele banho refrescante e divertir-se também no famoso Skibunda.',
    longDescription: 'Morro Branco - Beleza natural nas falésias, lar das areias coloridas e artesanatos locais. Ideal para descanso e natureza. Opcional: passeio de buggy para conhecer mais 2 praias e uma lagoa, com parada para banho e Skibunda.',
    mainImageUrl: 'https://res.cloudinary.com/demo/image/upload/v1/morro-branco',
    mainImageAlt: 'Morro Branco - Falésias e areias coloridas',
    galleryImages: [],
    price: 0,
    duration: 'Dia todo',
    includesItems: ['Acesso à praia', 'Transporte'],
    excludesItems: ['Passeio de buggy opcional', 'Alimentação', 'Bebidas'],
    featured: false,
    active: true,
  },
  {
    name: 'Mundaú',
    description: 'Mundaú fica no litoral oeste do Ceará e é um lugar incrível para se conhecer, é diversão garantida para você, com belas paisagens e um passeio de catamarã pelo Rio Mundaú, com duração de 1:30h, paradas para banho e comtemplação desse paraíso natural.',
    longDescription: 'Mundaú - Litoral oeste do Ceará, lugar incrível para conhecer. Diversão garantida com belas paisagens e passeio de catamarã pelo Rio Mundaú (1:30h), paradas para banho e contemplação.',
    mainImageUrl: 'https://res.cloudinary.com/demo/image/upload/v1/mundau',
    mainImageAlt: 'Mundaú - Catamarã pelo Rio Mundaú',
    galleryImages: [],
    price: 0,
    duration: 'Dia todo',
    includesItems: ['Passeio de catamarã', 'Paradas para banho', 'Transporte'],
    excludesItems: ['Alimentação', 'Bebidas', 'Gastos pessoais'],
    featured: false,
    active: true,
  },
  {
    name: 'Paracuru',
    description: 'A praia central de Paracuru é um dos principais pontos turísticos da região e é um verdadeiro cartão postal, descrita como linda, deserta e paradisíaca. Com o famoso farol em frente ao mar verde-esmeralda, ao seu lado fica um deck de onde você pode apreciar esta vista exuberante.',
    longDescription: 'Paracuru - Praia central, um dos principais pontos turísticos e verdadeiro cartão postal. Linda, deserta e paradisíaca. Farol em frente ao mar verde-esmeralda com deck para apreciar a vista.',
    mainImageUrl: 'https://res.cloudinary.com/demo/image/upload/v1/paracuru',
    mainImageAlt: 'Paracuru - Praia central com farol',
    galleryImages: [],
    price: 0,
    duration: 'Dia todo',
    includesItems: ['Acesso à praia', 'Transporte', 'Ponto de apoio'],
    excludesItems: ['Alimentação', 'Bebidas', 'Gastos pessoais'],
    featured: false,
    active: true,
  },
  {
    name: 'Praia das Fontes',
    description: 'Este passeio está disponível para quem vai conhecer Morro Branco. Essa é uma das mais belas praias do Ceará, possuindo grutas, fontes naturais de água doce e uma praia de águas quentes e areia fofa.',
    longDescription: 'Praia das Fontes - Disponível para quem vai conhecer Morro Branco. Uma das mais belas praias do Ceará, com grutas, fontes naturais de água doce, praia de águas quentes e areia fofa.',
    mainImageUrl: 'https://res.cloudinary.com/demo/image/upload/v1/praia-das-fontes',
    mainImageAlt: 'Praia das Fontes - Grutas e fontes naturais',
    galleryImages: [],
    price: 0,
    duration: 'Dia todo',
    includesItems: ['Acesso à praia', 'Transporte'],
    excludesItems: ['Alimentação', 'Bebidas', 'Gastos pessoais'],
    featured: false,
    active: true,
  },
  {
    name: 'Prainha',
    description: 'Prainha está localizada na primeira capital do Ceará, em Aquiraz. Tem seu artesanato forte e dunas perfeitas para o passeio de buggy, onde você pode explorar as dunas e uma descida radical no chamado insano natural.',
    longDescription: 'Prainha - Localizada na primeira capital do Ceará, em Aquiraz. Artesanato forte e dunas perfeitas para passeio de buggy. Explore as dunas e faça descida radical no insano natural.',
    mainImageUrl: 'https://res.cloudinary.com/demo/image/upload/v1/prainha',
    mainImageAlt: 'Prainha - Dunas e insano natural em Aquiraz',
    galleryImages: [],
    price: 0,
    duration: 'Dia todo',
    includesItems: ['Passeio de buggy', 'Transporte'],
    excludesItems: ['Alimentação', 'Bebidas', 'Gastos pessoais'],
    featured: false,
    active: true,
  },
];

async function initializeTourPackages() {
  if (!adminDb) {
    console.error('Firebase Admin not initialized');
    process.exit(1);
  }

  console.log('Starting tour packages initialization...');

  try {
    const toursRef = adminDb.collection('tours');
    let addedCount = 0;
    let updatedCount = 0;

    for (const tour of tourPackages) {
      // Check if tour already exists by name
      const existingTour = await toursRef.where('name', '==', tour.name).get();
      
      if (existingTour.empty) {
        // Add new tour
        await toursRef.add({
          ...tour,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
        addedCount++;
        console.log(`✓ Added: ${tour.name}`);
      } else {
        // Update existing tour
        const docId = existingTour.docs[0].id;
        await toursRef.doc(docId).update({
          ...tour,
          updatedAt: new Date(),
        });
        updatedCount++;
        console.log(`✓ Updated: ${tour.name}`);
      }
    }

    console.log(`\n✅ Tour packages initialization completed!`);
    console.log(`   Added: ${addedCount} tours`);
    console.log(`   Updated: ${updatedCount} tours`);
    console.log(`   Total: ${tourPackages.length} tours`);
  } catch (error) {
    console.error('Error initializing tour packages:', error);
    process.exit(1);
  }
}

// Run initialization if executed directly
if (require.main === module) {
  initializeTourPackages()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

export { initializeTourPackages };