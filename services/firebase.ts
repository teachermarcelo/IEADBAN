
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, onValue, off } from "firebase/database";

// SUBSTITUA ESTES VALORES PELOS DO SEU CONSOLE FIREBASE
const firebaseConfig = {
  apiKey: "SUA_API_KEY_AQUI",
  authDomain: "ieadban-app.firebaseapp.com",
  databaseURL: "https://ieadban-app-default-rtdb.firebaseio.com",
  projectId: "ieadban-app",
  storageBucket: "ieadban-app.appspot.com",
  messagingSenderId: "SEU_SENDER_ID",
  appId: "SEU_APP_ID"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export const syncToCloud = async (key: string, data: any) => {
  try {
    const dbRef = ref(db, 'churchData/' + key);
    await set(dbRef, data);
    
    // Backup local para funcionamento offline
    localStorage.setItem(`ieadban_${key}`, JSON.stringify(data));
  } catch (error) {
    console.error("Erro ao sincronizar com a nuvem:", error);
  }
};

export const subscribeToCloud = (key: string, callback: (data: any) => void) => {
  const dbRef = ref(db, 'churchData/' + key);
  onValue(dbRef, (snapshot) => {
    const data = snapshot.val();
    if (data) {
      callback(data);
      localStorage.setItem(`ieadban_${key}`, JSON.stringify(data));
    }
  });
  
  return () => off(dbRef);
};
