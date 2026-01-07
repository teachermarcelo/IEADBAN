
import { initializeApp, getApps, getApp } from "firebase/app";
import { getDatabase, ref, set, onValue, off, Database } from "firebase/database";

// Chaves do projeto IEADBAN
const firebaseConfig = {
  apiKey: "AIzaSyAzs8uxN3_umHX3CIS4iEhZwbEGoXCJNKU",
  authDomain: "ieadban-app.firebaseapp.com",
  databaseURL: "https://ieadban-app-default-rtdb.firebaseio.com",
  projectId: "ieadban-app",
  storageBucket: "ieadban-app.appspot.com",
  messagingSenderId: "831897280604",
  appId: "1:831897280604:web:0b08931be8d0f12dbdc699"
};

// Inicializa o Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

let db: Database;
try {
  db = getDatabase(app);
} catch (e) {
  console.error("Falha ao inicializar o Database Service:", e);
}

/**
 * Salva dados na nuvem e atualiza o cache local simultaneamente.
 */
export const syncToCloud = async (key: string, data: any) => {
  if (!db) return;
  try {
    const dbRef = ref(db, 'churchData/' + key);
    await set(dbRef, data);
    localStorage.setItem(`ieadban_${key}`, JSON.stringify(data));
  } catch (error) {
    console.error(`Erro ao sincronizar [${key}]:`, error);
  }
};

/**
 * Escuta mudanças em tempo real no banco de dados.
 */
export const subscribeToCloud = (key: string, callback: (data: any) => void) => {
  if (!db) return () => {};
  
  const dbRef = ref(db, 'churchData/' + key);
  
  const unsubscribe = onValue(dbRef, (snapshot) => {
    const data = snapshot.val();
    if (data) {
      callback(data);
      localStorage.setItem(`ieadban_${key}`, JSON.stringify(data));
    }
  }, (error) => {
    console.warn(`Erro de permissão ou conexão em [${key}]:`, error);
  });
  
  return () => off(dbRef, 'value', unsubscribe);
};
