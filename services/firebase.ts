
import { initializeApp, getApps, getApp } from "firebase/app";
import { getDatabase, ref, set, onValue, off, Database } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyAzs8uxN3_umHX3CIS4iEhZwbEGoXCJNKU",
  authDomain: "ieadban-app.firebaseapp.com",
  databaseURL: "https://ieadban-app-default-rtdb.firebaseio.com",
  projectId: "ieadban-app",
  storageBucket: "ieadban-app.appspot.com",
  messagingSenderId: "831897280604",
  appId: "1:831897280604:web:0b08931be8d0f12dbdc699"
};

// Singleton seguro
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const db: Database = getDatabase(app);

/**
 * Monitora o status da conexão física com o Firebase
 */
export const monitorConnection = (callback: (online: boolean) => void) => {
  const connectedRef = ref(db, ".info/connected");
  onValue(connectedRef, (snap) => {
    callback(snap.val() === true);
  });
};

/**
 * Salva dados na nuvem com confirmação
 */
export const syncToCloud = async (key: string, data: any) => {
  if (!db) {
    console.error("Database não inicializado.");
    return false;
  }
  try {
    const dbRef = ref(db, 'churchData/' + key);
    await set(dbRef, data);
    // Atualiza cache local apenas após sucesso na nuvem
    localStorage.setItem(`ieadban_${key}`, JSON.stringify(data));
    console.log(`[Firebase] Sincronizado com sucesso: ${key}`);
    return true;
  } catch (error: any) {
    console.error(`[Firebase] Erro ao sincronizar ${key}:`, error.message);
    if (error.message.includes("permission_denied")) {
      alert("Erro de Permissão: Verifique se as regras do Banco de Dados no Firebase estão como '.read: true, .write: true'");
    }
    return false;
  }
};

/**
 * Escuta mudanças em tempo real e garante a atualização do estado
 */
export const subscribeToCloud = (key: string, callback: (data: any) => void) => {
  if (!db) return () => {};
  
  const dbRef = ref(db, 'churchData/' + key);
  
  const unsubscribe = onValue(dbRef, (snapshot) => {
    const data = snapshot.val();
    if (data !== null && data !== undefined) {
      console.log(`[Firebase] Dados recebidos para ${key}`);
      callback(data);
      localStorage.setItem(`ieadban_${key}`, JSON.stringify(data));
    }
  }, (error) => {
    console.warn(`[Firebase] Falha na escuta de ${key}:`, error.message);
  });
  
  return () => off(dbRef, 'value', unsubscribe);
};
