# Configuração do Firebase para Script de Inicialização

## Como configurar o Firebase Admin SDK

Para que o script `initialize-site-content.ts` funcione corretamente, você precisa configurar as credenciais do Firebase Admin SDK.

### Opção 1: Usar arquivo JSON do Firebase Admin SDK

1. Acesse o [Console do Firebase](https://console.firebase.google.com/)
2. Selecione seu projeto (passeiolegal)
3. Vá em Configurações do projeto > Contas de serviço
4. Clique em "Gerar nova chave privada"
5. Baixe o arquivo JSON
6. Coloque o arquivo na raiz do projeto com o nome: `passeiolegal-firebase-adminsdk-fbsvc-c63c5e50d2.json`
7. **IMPORTANTE:** Nunca commitar este arquivo no Git (já está no .gitignore)

### Opção 2: Usar variável de ambiente

1. Siga os passos 1-4 da Opção 1 para obter o arquivo JSON
2. Abra o arquivo JSON e copie todo o conteúdo
3. Crie uma variável de ambiente chamada `FIREBASE_ADMIN_SDK` com o conteúdo do JSON como string
4. Exemplo: `FIREBASE_ADMIN_SDK='{"type":"service_account","project_id":"passeiolegal",...}'`

### Configuração no Vercel (para deploy)

1. Acesse seu projeto no Vercel
2. Vá em Settings > Environment Variables
3. Adicione a variável `FIREBASE_ADMIN_SDK` com o conteúdo completo do JSON do Firebase Admin SDK
4. No script de build, ele será executado automaticamente (se configurado no postbuild)

### Como executar o script

Após configurar as credenciais:

```bash
npm run init-site-content
```

Ou diretamente:

```bash
npx tsx scripts/initialize-site-content.ts
```

### O que acontece sem credenciais?

Se as credenciais não estiverem configuradas, o script irá:
- Exibir um aviso de que o Firebase Admin não foi inicializado
- Pular a inicialização do conteúdo
- Continuar sem erros (útil para builds sem credenciais)

### Solução de problemas

**Erro: "Firebase Admin not initialized"**
- Verifique se o arquivo JSON está no local correto
- Verifique se a variável de ambiente FIREBASE_ADMIN_SDK está configurada
- Verifique se o JSON é válido

**Erro: "Permission denied"**
- Verifique se a conta de serviço tem permissões de Firestore Admin
- Regere a chave privada se necessário

**Tours não aparecem no site**
- Verifique se a coleção está sendo criada no Firebase Console
- Verifique se os documentos têm a estrutura correta
- Verifique se o campo `active` está como `true`
