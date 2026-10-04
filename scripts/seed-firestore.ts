import { adminDb } from '../src/lib/firebase-admin';

// Sample data for seeding Firestore
const sampleBanners = [
  {
    title: 'Descubra o Paraíso',
    subtitle: 'Passeios inesquecíveis esperando por você',
    imageUrl: 'https://res.cloudinary.com/demo/image/upload/v1/banner1',
    imageAlt: 'Praia paradisíaca ao pôr do sol',
    buttonText: 'Explorar Agora',
    buttonLink: '#tours',
    order: 1,
    active: true,
  },
  {
    title: 'Conforto e Segurança',
    subtitle: 'Transfers premium para suas viagens',
    imageUrl: 'https://res.cloudinary.com/demo/image/upload/v1/banner2',
    imageAlt: 'Veículo de transfer luxuoso',
    buttonText: 'Ver Serviços',
    buttonLink: '#transfers',
    order: 2,
    active: true,
  },
];

const sampleTours = [
  {
    name: 'Passeio de Barco pela Costa',
    description: 'Um passeio inesquecível pelas praias mais bonitas da região.',
    longDescription: 'Desfrute de um passeio de barco completo com paradas para mergulho, almoço incluído e guia especializado.',
    mainImageUrl: 'https://res.cloudinary.com/demo/image/upload/v1/tour1',
    mainImageAlt: 'Barco navegando pelo mar',
    galleryImages: [],
    price: 299.90,
    duration: '8 horas',
    includesItems: ['Almoço', 'Equipamentos de mergulho', 'Guia especializado', 'Seguro'],
    excludesItems: ['Bebidas alcoólicas', 'Gastos pessoais'],
    featured: true,
    active: true,
  },
  {
    name: 'Trilha na Montanha',
    description: 'Explore trilhas deslumbrantes com vistas panorâmicas.',
    longDescription: 'Trilha guiada com nível moderado, ideal para quem busca aventura e contato com a natureza.',
    mainImageUrl: 'https://res.cloudinary.com/demo/image/upload/v1/tour2',
    mainImageAlt: 'Vista panorâmica da montanha',
    galleryImages: [],
    price: 149.90,
    duration: '4 horas',
    includesItems: ['Guia especializado', 'Seguro', 'Água e lanches'],
    excludesItems: ['Transporte até o local', 'Equipamentos pessoais'],
    featured: true,
    active: true,
  },
  {
    name: 'City Tour Histórico',
    description: 'Conheça a história e cultura da cidade em um passeio completo.',
    longDescription: 'Visita aos principais pontos turísticos históricos com guia especializado e transporte incluído.',
    mainImageUrl: 'https://res.cloudinary.com/demo/image/upload/v1/tour3',
    mainImageAlt: 'Centro histórico da cidade',
    galleryImages: [],
    price: 99.90,
    duration: '6 horas',
    includesItems: ['Transporte', 'Guia especializado', 'Ingressos', 'Seguro'],
    excludesItems: ['Almoço', 'Gastos pessoais'],
    featured: false,
    active: true,
  },
];

const sampleTransfers = [
  {
    name: 'Transfer Executivo',
    description: 'Serviço de transfer premium com motorista profissional.',
    imageUrl: 'https://res.cloudinary.com/demo/image/upload/v1/transfer1',
    imageAlt: 'Carro executivo',
    price: 150.00,
    vehicleType: 'Sedan Executivo',
    capacity: 4,
    active: true,
  },
  {
    name: 'Transfer Van',
    description: 'Transfer em van confortável para grupos.',
    imageUrl: 'https://res.cloudinary.com/demo/image/upload/v1/transfer2',
    imageAlt: 'Van de transfer',
    price: 250.00,
    vehicleType: 'Van',
    capacity: 8,
    active: true,
  },
];

const sampleTestimonials = [
  {
    clientName: 'Maria Silva',
    clientPhoto: 'https://res.cloudinary.com/demo/image/upload/v1/client1',
    clientPhotoAlt: 'Foto de Maria Silva',
    text: 'Experiência incrível! O passeio de barco foi o destaque da nossa viagem. Recomendo muito!',
    rating: 5,
    active: true,
  },
  {
    clientName: 'João Santos',
    clientPhoto: 'https://res.cloudinary.com/demo/image/upload/v1/client2',
    clientPhotoAlt: 'Foto de João Santos',
    text: 'Serviço de transfer impecável. Motorista muito profissional e pontual.',
    rating: 5,
    active: true,
  },
];

const sampleBlogPosts = [
  {
    title: '5 Destinos Imperdíveis para Visitar Este Ano',
    slug: '5-destinos-imperdíveis-para-visitar-este-ano',
    summary: 'Descubra os melhores destinos turísticos para suas próximas férias.',
    content: '<p>Confira nossa lista completa dos destinos mais incríveis...</p>',
    imageUrl: 'https://res.cloudinary.com/demo/image/upload/v1/blog1',
    imageAlt: 'Praia paradisíaca',
    author: 'Equipe Passeio Legal',
    published: true,
    publishedAt: new Date('2024-01-15'),
  },
  {
    title: 'Dicas para Viajar com Segurança',
    slug: 'dicas-para-viajar-com-segurança',
    summary: 'Aprenda como se manter seguro durante suas viagens.',
    content: '<p>Segurança é fundamental em qualquer viagem...</p>',
    imageUrl: 'https://res.cloudinary.com/demo/image/upload/v1/blog2',
    imageAlt: 'Viajante com mochila',
    author: 'Equipe Passeio Legal',
    published: true,
    publishedAt: new Date('2024-01-10'),
  },
];

const sampleFAQs = [
  {
    question: 'Como faço uma reserva?',
    answer: 'Você pode fazer uma reserva através do nosso site, entrando em contato pelo WhatsApp ou telefone. Nossa equipe irá confirmar a disponibilidade e enviar os detalhes do pagamento.',
    order: 1,
    active: true,
  },
  {
    question: 'Qual é a política de cancelamento?',
    answer: 'Cancelamentos feitos com até 48 horas de antecedência recebem reembolso integral. Cancelamentos entre 24 e 48 horas recebem 50% de reembolso. Cancelamentos com menos de 24 horas não são reembolsáveis.',
    order: 2,
    active: true,
  },
  {
    question: 'Os passeios incluem seguro?',
    answer: 'Sim, todos os nossos passeios incluem seguro básico. Também oferecemos opções de seguro adicional para maior tranquilidade.',
    order: 3,
    active: true,
  },
];

const sampleSettings = {
  headerLogo: 'https://res.cloudinary.com/demo/image/upload/v1/logo',
  headerLogoAlt: 'Logo Passeio Legal',
  menuLinks: [
    { id: '1', label: 'Início', url: '/', order: 1, active: true },
    { id: '2', label: 'Passeios', url: '#tours', order: 2, active: true },
    { id: '3', label: 'Transfers', url: '#transfers', order: 3, active: true },
    { id: '4', label: 'Blog', url: '#blog', order: 4, active: true },
    { id: '5', label: 'Contato', url: '#contact', order: 5, active: true },
  ],
  footerLogo: 'https://res.cloudinary.com/demo/image/upload/v1/logo',
  footerLogoAlt: 'Logo Passeio Legal',
  socialLinks: [
    { id: '1', platform: 'facebook', url: 'https://facebook.com/passeiolegal' },
    { id: '2', platform: 'instagram', url: 'https://instagram.com/passeiolegal' },
    { id: '3', platform: 'whatsapp', url: 'https://wa.me/5511999999999' },
  ],
  contactInfo: {
    email: 'contato@passeiolegal.com',
    phone: '+55 11 99999-9999',
    whatsapp: '+55 11 99999-9999',
    address: 'Rua Principal, 123',
    city: 'São Paulo',
    state: 'SP',
    zipCode: '01234-567',
  },
  seoSettings: {
    siteTitle: 'Passeio Legal - Tours e Transfers',
    siteDescription: 'Descubra os melhores passeios e transfers com a Passeio Legal',
    keywords: ['tours', 'transfers', 'travel', 'passeios', 'turismo'],
    ogImage: 'https://res.cloudinary.com/demo/image/upload/v1/og-image',
  },
  whatsappConfig: {
    number: '+5511999999999',
    defaultMessage: 'Olá! Gostaria de saber mais sobre os passeios.',
  },
  primaryColor: '#3b82f6',
  secondaryColor: '#8b5cf6',
};

async function seedFirestore() {
  if (!adminDb) {
    console.error('Firebase Admin not initialized');
    process.exit(1);
  }

  console.log('Starting Firestore seed...');

  try {
    // Seed Banners
    console.log('Seeding banners...');
    const bannersRef = adminDb.collection('banners');
    for (const banner of sampleBanners) {
      await bannersRef.add(banner);
    }
    console.log(`✓ Seeded ${sampleBanners.length} banners`);

    // Seed Tours
    console.log('Seeding tours...');
    const toursRef = adminDb.collection('tours');
    for (const tour of sampleTours) {
      await toursRef.add(tour);
    }
    console.log(`✓ Seeded ${sampleTours.length} tours`);

    // Seed Transfers
    console.log('Seeding transfers...');
    const transfersRef = adminDb.collection('transfers');
    for (const transfer of sampleTransfers) {
      await transfersRef.add(transfer);
    }
    console.log(`✓ Seeded ${sampleTransfers.length} transfers`);

    // Seed Testimonials
    console.log('Seeding testimonials...');
    const testimonialsRef = adminDb.collection('testimonials');
    for (const testimonial of sampleTestimonials) {
      await testimonialsRef.add(testimonial);
    }
    console.log(`✓ Seeded ${sampleTestimonials.length} testimonials`);

    // Seed Blog Posts
    console.log('Seeding blog posts...');
    const blogRef = adminDb.collection('blog');
    for (const post of sampleBlogPosts) {
      await blogRef.add(post);
    }
    console.log(`✓ Seeded ${sampleBlogPosts.length} blog posts`);

    // Seed FAQs
    console.log('Seeding FAQs...');
    const faqRef = adminDb.collection('faq');
    for (const faq of sampleFAQs) {
      await faqRef.add(faq);
    }
    console.log(`✓ Seeded ${sampleFAQs.length} FAQs`);

    // Seed Settings
    console.log('Seeding settings...');
    const settingsRef = adminDb.collection('settings');
    await settingsRef.add(sampleSettings);
    console.log(`✓ Seeded settings`);

    console.log('\n✅ Firestore seed completed successfully!');
  } catch (error) {
    console.error('Error seeding Firestore:', error);
    process.exit(1);
  }
}

// Run seed if executed directly
if (require.main === module) {
  seedFirestore()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

export { seedFirestore };
