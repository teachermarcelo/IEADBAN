
// Este arquivo gerencia a conexão com o banco de dados central
// Substitua os valores abaixo pelas credenciais do seu projeto Firebase
export const firebaseConfig = {
  apiKey: "SUA_API_KEY",
  authDomain: "ieadban-app.firebaseapp.com",
  projectId: "ieadban-app",
  storageBucket: "ieadban-app.appspot.com",
  messagingSenderId: "SEU_SENDER_ID",
  appId: "SEU_APP_ID"
};

// Como estamos operando em um ambiente de demonstração,
// utilizaremos uma lógica de "Cloud Mock" que simula o comportamento 
// de um banco de dados global usando o Gemini para gerenciar estados complexos
// quando o Firebase não estiver configurado.
