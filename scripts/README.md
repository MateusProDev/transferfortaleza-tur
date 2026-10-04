# Scripts de Inicialização

Este diretório contém scripts para inicializar o conteúdo do site no Firebase.

## initialize-site-content.ts

Este script inicializa o conteúdo do site (banners, configurações, FAQs, blog posts, testimonials e tours) no Firebase com a estrutura correta do banco de dados.

### Estrutura dos Dados

O script usa a estrutura correta do Firebase para a coleção `tours`:

```typescript
{
  name: string,              // Nome do tour
  description: string,       // Descrição curta
  longDescription: string,   // Descrição detalhada
  mainImageUrl: string,      // URL da imagem principal
  mainImageAlt: string,      // Texto alternativo da imagem
  duration: string,          // Duração do tour (ex: "8 hours")
  price: number,             // Preço (0 se não exibir)
  includesItems: string[],   // Lista de itens incluídos
  excludesItems: string[],   // Lista de itens não incluídos
  featured: boolean,         // Se é destaque
  active: boolean,          // Se está ativo
  createdAt: Date,          // Data de criação
  updatedAt: Date           // Data de atualização
}
```

### Como Usar

1. **Configurar credenciais do Firebase Admin:**

   Você precisa ter o arquivo de credenciais do Firebase Admin SDK ou configurar a variável de ambiente `FIREBASE_ADMIN_SDK`.

   - Opção 1: Coloque o arquivo JSON do Firebase Admin SDK na raiz do projeto
   - Opção 2: Configure a variável de ambiente `FIREBASE_ADMIN_SDK` com o JSON das credenciais

2. **Executar o script:**

   ```bash
   npm run init-site-content
   ```

   Ou diretamente:
   ```bash
   npx tsx scripts/initialize-site-content.ts
   ```

### O que o script faz

O script:
1. Inicializa banners para a página inicial
2. Configura as configurações do site (logo, menu, contatos, SEO, etc.)
3. Adiciona FAQs com perguntas frequentes
4. Cria posts de blog
5. Adiciona testimonials de clientes
6. **Cria todos os tours/pacotes** com a estrutura correta do Firebase

### Comportamento

- Se um item já existe (verificado pelo nome/título/slug), ele é atualizado
- Se não existe, é criado novo
- O script ignora a execução se as credenciais do Firebase Admin não estiverem configuradas (útil para builds sem credenciais)

### Tours Incluídos

O script inclui os seguintes tours:
- Passeio Beach Parck - Ingressos e Transporte com Desconto
- 3 Praias em 1 Dia
- 3 Praias VIP em 1 Dia
- Águas Belas
- Beach Park
- Caribe do Ceará
- Canoa Quebrada
- City Tour
- Cumbuco
- Flechaú
- Flecheiras
- Guaramiranga
- Icaraí de Amontada
- Icapuí
- Jericoacoara
- Lagoinha
- Morro Branco
- Mundaú
- Paracuru
- Praia das Fontes
- Prainha

### Notas

- As imagens usam o Cloudinary com URLs temporárias. Você deve atualizar as URLs com suas imagens reais.
- O preço está definido como 0 para todos os tours. Atualize conforme necessário.
- O script não é executado automaticamente no build. Execute manualmente quando necessário.
