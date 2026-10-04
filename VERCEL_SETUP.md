# 🚀 Configuração de Variáveis de Ambiente na Vercel

## ⚠️ ANTES DE INICIAR A CAMPANHA DE ADS

Configure estas variáveis de ambiente na Vercel **antes** de iniciar sua campanha de R$70/dia.

## 🔧 Variáveis Obrigatórias (Analytics)

### Google Analytics 4
1. Crie uma conta no [Google Analytics 4](https://analytics.google.com/)
2. Crie uma propriedade "Web"
3. Copie o "Measurement ID" (formato: `G-XXXXXXXXXX`)
4. Configure na Vercel:
   - **Nome**: `NEXT_PUBLIC_GA_ID`
   - **Valor**: `G-YCGK9Q04SP` (seu ID configurado)

### Meta Pixel (Facebook/Instagram)
1. Acesse [Meta Business Suite](https://business.facebook.com/)
2. Crie um novo Pixel
3. Copie o Pixel ID (formato: números apenas)
4. Configure na Vercel:
   - **Nome**: `NEXT_PUBLIC_META_PIXEL_ID`
   - **Valor**: `1373592994356766` (seu ID configurado)

### Conta de Anúncios Facebook
- **ID da Conta**: `1014705683732131`
- Use este ID ao configurar sua campanha de anúncios no Meta Ads Manager

## 🌐 Variáveis de URL

### Domínio Principal
- **Nome**: `NEXT_PUBLIC_APP_URL`
- **Valor**: `https://seudominio.com` (seu domínio real)

### Google Search Console
1. Adicione seu site no [Google Search Console](https://search.google.com/search-console/)
2. Copie o código de verificação
3. Configure na Vercel:
   - **Nome**: `GOOGLE_SITE_VERIFICATION`
   - **Valor**: `seu_codigo_verificacao`

## 🏢 Variáveis de Negócio (Schema.org)

Essas variáveis são usadas no SEO estruturado. Use dados REAIS da sua empresa:

- **Nome**: `NEXT_PUBLIC_BUSINESS_STREET`
- **Valor**: `Rua da Sua Empresa, 123`

- **Nome**: `NEXT_PUBLIC_BUSINESS_CITY`
- **Valor**: `Sua Cidade`

- **Nome**: `NEXT_PUBLIC_BUSINESS_STATE`
- **Valor**: `SP` (seu estado)

- **Nome**: `NEXT_PUBLIC_BUSINESS_ZIP`
- **Valor**: `01234-567` (seu CEP)

- **Nome**: `NEXT_PUBLIC_BUSINESS_PHONE`
- **Valor**: `+5511999999999` (seu telefone real)

## 🔥 Firebase e Cloudinary

Essas variáveis já devem estar configuradas se o projeto está funcionando:

### Firebase
- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`

### Cloudinary
- `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`
- `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`

## 📋 Como Configurar na Vercel

1. Acesse seu projeto na [Vercel](https://vercel.com/)
2. Vá em **Settings** → **Environment Variables**
3. Adicione cada variável uma por uma
4. Selecione os ambientes:
   - **Production**: obrigatório
   - **Preview**: recomendado
   - **Development**: opcional
5. Clique em **Save**
6. **Importante**: Faça um novo deploy após configurar as variáveis

## ✅ Checklist Antes da Campanha

### 📊 Analytics e IDs
- [✅] Google Analytics 4 ID configurado: `G-YCGK9Q04SP`
- [✅] Meta Pixel ID configurado: `1373592994356766`
- [✅] Conta de Anúncios Facebook ID: `1014705683732131`

### 🔧 Configuração na Vercel
- [✅] `NEXT_PUBLIC_GA_ID=G-YCGK9Q04SP` configurado na Vercel
- [✅] `NEXT_PUBLIC_META_PIXEL_ID=1373592994356766` configurado na Vercel
- [✅] Deploy realizado após configuração

### 🧪 Testes de Funcionamento
- [✅] GA4 está recebendo dados
- [✅] Meta Pixel está registrando eventos (PageView, ViewContent)

### 🏢 Dados da Empresa
- [✅] Dados reais da empresa no Schema.org

### 🌐 Configurações Adicionais (Opcionais)
- [ ] Domínio real configurado em `NEXT_PUBLIC_APP_URL`
- [ ] Google Search Console verificado
- [✅] Imagem OG criada (1200x630px) em `public/OG.png`

## 🎯 Teste de Analytics

Após configurar e fazer deploy:

1. **Teste GA4**:
   - Acesse seu site
   - Espere 5-10 minutos
   - Verifique no GA4 em "Relatórios → Tempo real"

2. **Teste Meta Pixel**:
   - Instale a extensão "Meta Pixel Helper"
   - Acesse seu site
   - Verifique se o Pixel está ativo e registrando PageView

## � Eventos do Meta Pixel Implementados

Seu projeto já tem um utilitário para rastreamento de eventos em `src/utils/metaPixel.ts`:

- **Contact** - Cliques no WhatsApp/formulário
- **Lead** - Envio de formulários de interesse
- **InitiateCheckout** - Início do processo de reserva
- **Purchase** - Conclusão de reserva
- **Search** - Pesquisas de passeios/transfers
- **Schedule** - Agendamento de passeios

**Uso:**
```typescript
import { metaPixelEvents } from '@/utils/metaPixel';

// Para contato via WhatsApp
metaPixelEvents.contact();

// Para envio de formulário
metaPixelEvents.lead();

// Para conclusão de compra
metaPixelEvents.purchase(valor, 'BRL');
```

## �🚨 IMPORTANTE

**Sem analytics configurados, você vai queimar R$70/dia sem saber:**
- Qual anúncio está funcionando
- Qual página gera mais conversões
- Custo por aquisição
- Retorno sobre investimento

Configure TUDO antes de ligar os anúncios!