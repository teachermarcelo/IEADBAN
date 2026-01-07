
import { initializeApp, getApps, getApp } from "firebase/app";
import { getDatabase, ref, set, onValue, off } from "firebase/database";

// Chaves validadas do projeto IEADBAN
const firebaseConfig = {
  apiKey: "AIzaSyAzs8uxN3_umHX3CIS4iEhZwbEGoXCJNKU",
  authDomain: "ieadban-app.firebaseapp.com",
  databaseURL: "https://ieadban-app-default-rtdb.firebaseio.com",
  projectId: "ieadban-app",
  storageBucket: "ieadban-app.appspot.com",
  messagingSenderId: "831897280604",
  appId: "1:831897280604:web:0b08931be8d0f12dbdc699"
};

// Inicializa o Firebase apenas se ainda não houver um app ativo
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const db = getDatabase(app);

/**
 * Salva dados na nuvem e atualiza o cache local simultaneamente.
 * @param key Nome da coleção (ex: 'members', 'events')
 * @param data Conteúdo a ser salvo
 */
export const syncToCloud = async (key: string, data: any) => {
  try {
    const dbRef = ref(db, 'churchData/' + key);
    await set(dbRef, data);
    
    // Mantém backup local para funcionamento offline instantâneo
    localStorage.setItem(`ieadban_${key}`, JSON.stringify(data));
  } catch (error) {
    console.error(`Erro ao sincronizar [${key}]:`, error);
  }
};

/**
 * Escuta mudanças em tempo real no banco de dados.
 * @param key Nome da coleção
 * @param callback Função que recebe os dados atualizados
 */
export const subscribeToCloud = (key: string, callback: (data: any) => void) => {
  const dbRef = ref(db, 'churchData/' + key);
  
  // O onValue do Firebase dispara automaticamente na primeira vez e em cada mudança
  onValue(dbRef, (snapshot) => {
    const data = snapshot.val();
    if (data) {
      callback(data);
      localStorage.setItem(`ieadban_${key}`, JSON.stringify(data));
    }
  }, (error) => {
    console.warn(`Atenção: Acesso offline ou permissão negada para [${key}].`, error);
  });
  
  return () => off(dbRef);
};
