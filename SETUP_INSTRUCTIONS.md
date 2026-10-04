# Instruções de Setup - Passeio Legal

## 📋 Pré-requisitos

- Node.js 18+ e npm
- Conta Firebase com Firestore e Authentication habilitados
- Conta Cloudinary
- Git

## 🔧 Instalação

### 1. Instalar Dependências

```bash
npm install
```

### 2. Configurar Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto:

```bash
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Cloudinary Configuration
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Application
NEXT_PUBLIC_APP_NAME=Passeio Legal
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development

# Firebase Admin SDK (opcional - pode usar o arquivo JSON)
FIREBASE_ADMIN_SDK='{"type":"service_account","project_id":"...","private_key":"..."}'
```

### 3. Configurar Firebase

1. Acesse o [Firebase Console](https://console.firebase.google.com)
2. Crie um novo projeto ou use um existente
3. Habilite o **Firestore Database**
4. Habilite o **Authentication** (Email/Password)
5. Copie sua configuração Firebase para o `.env.local`

### 4. Configurar Cloudinary

1. Acesse o [Cloudinary Dashboard](https://cloudinary.com/console)
2. Copie seu Cloud Name e credenciais API
3. Crie um upload preset não assinado para uploads no cliente
4. Adicione ao `.env.local`

### 5. Criar Coleções do Firestore

Crie estas coleções no Firestore (coleções vazias são aceitas):
- `banners`
- `tours`
- `transfers`
- `testimonials`
- `blog`
- `faq`
- `settings`
- `activityLogs`
- `users`

### 6. Criar Usuário Admin

1. Vá ao Firebase Console → Authentication
2. Crie um usuário com email/senha
3. No Firestore, adicione um documento em `users/{uid}`:
```json
{
  "email": "admin@example.com",
  "role": "admin",
  "displayName": "Admin Name",
  "active": true
}
```

### 7. Popular Firestore com Dados de Exemplo

```bash
npm run seed
```

Este comando irá adicionar dados de exemplo para:
- 2 banners
- 3 tours
- 2 transfers
- 2 testemunhos
- 2 posts de blog
- 3 FAQs
- Configurações do site

## 🚀 Executar a Aplicação

### Desenvolvimento

```bash
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000) no navegador.

### Build de Produção

```bash
npm run build
npm start
```

### Linting

```bash
npm run lint
npm run type-check
```

## 🔐 Acesso ao Painel Admin

1. Acesse [http://localhost:3000/admin/login](http://localhost:3000/admin/login)
2. Faça login com o email e senha do usuário admin criado
3. Você será redirecionado para o dashboard

## 📝 Estrutura do Projeto

```
src/
├── app/
│   ├── admin/                  # Painel administrativo
│   ├── api/                    # API routes (Serverless functions)
│   ├── layout.tsx              # Layout raiz com SEO
│   ├── page.tsx                # Página inicial pública
│   ├── providers.tsx           # Providers globais
│   ├── robots.ts               # Robots.txt dinâmico
│   └── sitemap.ts              # Sitemap.xml dinâmico
├── components/
│   ├── public/                 # Componentes do site público
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── Hero.tsx
│   │   ├── Tours.tsx
│   │   ├── Transfers.tsx
│   │   ├── Testimonials.tsx
│   │   ├── Blog.tsx
│   │   ├── FAQ.tsx
│   │   └── Contact.tsx
│   ├── seo/                    # Componentes de SEO
│   │   └── JsonLd.tsx
│   └── ui/                     # Componentes UI reutilizáveis
├── lib/
│   ├── firebase.ts             # Configuração Firebase cliente
│   ├── firebase-admin.ts       # Configuração Firebase Admin
│   ├── firestore.ts            # Serviços Firestore
│   ├── cloudinary.ts           # Utilitários Cloudinary
│   ├── utils.ts                # Utilitários gerais
│   └── cn.ts                   # Helper de classes
├── hooks/
│   ├── useApi.ts               # Hooks de API
│   └── useAuth.tsx            # Hooks de autenticação
├── types/
│   └── index.ts                # Definições TypeScript
└── middleware.ts               # Middleware Next.js
```

## 🎨 Funcionalidades Implementadas

### SEO e Acessibilidade
- ✅ Tags semânticas HTML5 (header, main, section, article, nav, footer)
- ✅ Atributos `alt` para imagens
- ✅ Atributos `aria-label` para botões
- ✅ Link canonical em todas as páginas
- ✅ Sitemap.xml dinâmico
- ✅ Robots.txt dinâmico
- ✅ JSON-LD para dados estruturados (LocalBusiness, WebSite, etc.)
- ✅ Metadata completa (Open Graph, Twitter Cards)
- ✅ Indexação completa (sem noindex em rotas importantes)
- ✅ Middleware não bloqueia bots de busca

### Site Público
- ✅ Header responsivo com menu mobile
- ✅ Carrossel de banners com navegação
- ✅ Seção de passeios/tours com cards
- ✅ Seção de transfers
- ✅ Seção sobre com estatísticas
- ✅ Carrossel de testemunhos
- ✅ Seção de blog
- ✅ FAQ com accordion
- ✅ Formulário de contato
- ✅ Footer com informações e redes sociais

### Painel Admin
- ✅ Autenticação com Firebase
- ✅ Dashboard com estatísticas
- ✅ Gestão de banners (CRUD)
- ✅ Gestão de tours (CRUD + galeria)
- ✅ Gestão de transfers (CRUD)
- ✅ Gestão de testemunhos
- ✅ Gestão de blog
- ✅ Gestão de FAQ
- ✅ Configurações globais

## 🔧 Solução de Problemas

### Firebase Connection Issues
- Verifique as credenciais Firebase no `.env.local`
- Confirme que o Firestore está habilitado no Firebase Console
- Certifique-se de que as coleções foram criadas

### Cloudinary Upload Fails
- Verifique o Cloud Name e credenciais API
- Confirme que o upload preset foi criado no Cloudinary
- Verifique a configuração CORS

### Admin Login Not Working
- Limpe o cache e localStorage do navegador
- Verifique que o usuário existe no Firebase Authentication
- Confirme que o documento do usuário existe em `users` collection

### Build Errors
- Execute `npm install` para garantir dependências atualizadas
- Execute `npm run type-check` para verificar erros TypeScript
- Verifique que todas as variáveis de ambiente estão configuradas

## 📚 Tecnologias Utilizadas

- **Framework**: Next.js 14+
- **Linguagem**: TypeScript
- **Estilização**: Tailwind CSS
- **Backend**: Firebase Firestore
- **Autenticação**: Firebase Auth
- **Imagens**: Cloudinary
- **Formulários**: React Hook Form + Zod
- **Estado**: Zustand
- **Ícones**: Lucide React
- **Carrossel**: Swiper

## 🚢 Deploy para Vercel

1. Faça push do código para GitHub
2. Vá ao [Vercel Dashboard](https://vercel.com/dashboard)
3. Clique em "New Project"
4. Importe seu repositório
5. Configure as variáveis de ambiente
6. Deploy

## 📄 Variáveis de Ambiente de Produção

Lembre-se de configurar todas as variáveis de ambiente nas configurações do projeto Vercel:
- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`
- `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`
- `NEXT_PUBLIC_APP_URL` (URL de produção)
- `NODE_ENV=production`

## 🎯 Próximos Passos

O projeto está pronto para uso! Após a instalação e configuração:

1. Execute `npm install` para instalar dependências
2. Configure as variáveis de ambiente no `.env.local`
3. Configure o Firebase e Cloudinary
4. Execute `npm run seed` para popular com dados de exemplo
5. Execute `npm run dev` para iniciar o servidor de desenvolvimento
6. Acesse http://localhost:3000 para ver o site público
7. Acesse http://localhost:3000/admin/login para acessar o painel admin

---

**Feito com ❤️ para empresas de turismo**
