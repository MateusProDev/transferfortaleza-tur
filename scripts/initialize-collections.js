// Script para inicializar coleções do Firebase
// Baseado no exemplo de projeto React bem-sucedido
// Execute com: node scripts/initialize-collections.js

const { initializeApp } = require('firebase/app');
const { getFirestore, collection, doc, setDoc, getDocs, query, where } = require('firebase/firestore');

// Firebase Configuration (substitua com suas credenciais reais)
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "SUA_API_KEY",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "SEU_PROJETO.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "passeiolegal",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "SEU_PROJETO.appspot.com",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "SEU_SENDER_ID",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "SEU_APP_ID",
};

console.log('🚀 Inicializando Firebase...');
console.log('📍 Projeto:', firebaseConfig.projectId);

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Estrutura de dados inicial para cada coleção
const collectionsData = {
  banners: {
    description: "Banners do site",
    initialData: []
  },
  tours: {
    description: "Passeios e excursões",
    initialData: []
  },
  transfers: {
    description: "Serviços de transfer",
    initialData: []
  },
  testimonials: {
    description: "Depoimentos de clientes",
    initialData: []
  },
  blog: {
    description: "Posts do blog",
    initialData: []
  },
  faq: {
    description: "Perguntas frequentes",
    initialData: []
  }
};

async function initializeCollection(collectionName, data) {
  try {
    console.log(`\n📦 Inicializando coleção: ${collectionName}`);
    console.log(`   Descrição: ${data.description}`);
    
    // Verificar se a coleção já existe
    const collectionRef = collection(db, collectionName);
    const snapshot = await getDocs(collectionRef);
    
    if (snapshot.empty) {
      console.log(`   ✅ Coleção ${collectionName} criada (vazia)`);
      
      // Criar documento inicial para garantir que a coleção exista
      const initDocRef = doc(collectionRef, "_init");
      await setDoc(initDocRef, {
        _initialized: true,
        _timestamp: new Date().toISOString(),
        _description: data.description
      });
      
      console.log(`   📝 Documento _init criado`);
    } else {
      console.log(`   ℹ️  Coleção ${collectionName} já existe com ${snapshot.size} documentos`);
    }
    
    return true;
  } catch (error) {
    console.error(`   ❌ Erro ao inicializar ${collectionName}:`, error.message);
    return false;
  }
}

async function initializeAllCollections() {
  console.log('\n' + '='.repeat(50));
  console.log('🎯 INICIALIZAÇÃO DAS COLEÇÕES FIREBASE');
  console.log('='.repeat(50));
  
  const results = {};
  
  for (const [collectionName, data] of Object.entries(collectionsData)) {
    results[collectionName] = await initializeCollection(collectionName, data);
  }
  
  console.log('\n' + '='.repeat(50));
  console.log('📊 RESUMO DA INICIALIZAÇÃO');
  console.log('='.repeat(50));
  
  let successCount = 0;
  let failCount = 0;
  
  for (const [collectionName, success] of Object.entries(results)) {
    if (success) {
      console.log(`✅ ${collectionName}`);
      successCount++;
    } else {
      console.log(`❌ ${collectionName}`);
      failCount++;
    }
  }
  
  console.log('\n' + '-'.repeat(50));
  console.log(`Total: ${successCount} sucesso(s), ${failCount} falha(s)`);
  console.log('-'.repeat(50));
  
  if (failCount === 0) {
    console.log('\n🎉 Todas as coleções foram inicializadas com sucesso!');
    console.log('🌐 Acesse https://console.firebase.google.com para verificar');
    process.exit(0);
  } else {
    console.log('\n⚠️  Algumas coleções falharam. Verifique os erros acima.');
    process.exit(1);
  }
}

initializeAllCollections().catch(error => {
  console.error('\n❌ Erro fatal na inicialização:', error);
  console.error('\n💡 Dicas de solução:');
  console.error('   1. Verifique se as variáveis de ambiente estão configuradas');
  console.error('   2. Verifique se o projeto Firebase existe');
  console.error('   3. Verifique se o Firestore está ativado no console Firebase');
  console.error('   4. Verifique as regras de segurança do Firestore');
  process.exit(1);
});
