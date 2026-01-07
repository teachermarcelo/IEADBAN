
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

// Singleton robusto
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const db: Database = getDatabase(app);

/**
 * Monitora o status da conexão física com o Firebase
 */
export const monitorConnection = (callback: (online: boolean) => void) => {
  const connectedRef = ref(db, ".info/connected");
  return onValue(connectedRef, (snap) => {
    callback(snap.val() === true);
  });
};

/**
 * Salva dados na nuvem
 */
export const syncToCloud = async (key: string, data: any) => {
  try {
    const dbRef = ref(db, 'churchData/' + key);
    await set(dbRef, data);
    localStorage.setItem(`ieadban_${key}`, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error(`Erro ao sincronizar ${key}:`, error);
    return false;
  }
};

/**
 * Escuta mudanças em tempo real
 */
export const subscribeToCloud = (key: string, callback: (data: any) => void) => {
  const dbRef = ref(db, 'churchData/' + key);
  const unsubscribe = onValue(dbRef, (snapshot) => {
    const data = snapshot.val();
    if (data !== null) {
      callback(data);
      localStorage.setItem(`ieadban_${key}`, JSON.stringify(data));
    }
  });
  return () => off(dbRef, 'value', unsubscribe);
};
