
/**
 * IEADBAN - Conexão Nuvem
 * 
 * Para ativar a sincronização real entre dispositivos:
 * 1. Crie um projeto em console.firebase.google.com
 * 2. Substitua os valores abaixo pelas suas chaves do Firebase
 */
export const firebaseConfig = {
  apiKey: "COLE_AQUI_SUA_API_KEY",
  authDomain: "ieadban-app.firebaseapp.com",
  databaseURL: "https://ieadban-app-default-rtdb.firebaseio.com",
  projectId: "ieadban-app",
  storageBucket: "ieadban-app.appspot.com",
  messagingSenderId: "SEU_ID",
  appId: "SEU_APP_ID"
};

// Interface para o serviço de sincronização
export const syncToCloud = async (key: string, data: any) => {
  try {
    // Aqui o código enviaria para o Firebase:
    // set(ref(database, 'churchData/' + key), data);
    
    // Enquanto você não configura as chaves, usamos o BroadcastChannel
    // para sincronizar entre abas abertas no mesmo dispositivo/navegador
    const channel = new BroadcastChannel('ieadban_global_sync');
    channel.postMessage({ key, data });
    
    // Mantemos o backup no localStorage por segurança
    localStorage.setItem(`ieadban_${key}`, JSON.stringify(data));
  } catch (error) {
    console.error("Erro na sincronização:", error);
  }
};
