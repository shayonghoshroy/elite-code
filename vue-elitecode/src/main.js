import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './assets/main.css'


// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
//import { getAnalytics } from "firebase/analytics";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA6VKJuKjL8tVqTAes35BhJugv8Vc4axNk",
  authDomain: "elite-code-e1e0f.firebaseapp.com",
  projectId: "elite-code-e1e0f",
  storageBucket: "elite-code-e1e0f.appspot.com",
  messagingSenderId: "595911758272",
  appId: "1:595911758272:web:440f85c9acee00ac66b825",
  measurementId: "G-K9W8EZ12QP"
};

// Initialize Firebase
initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);  // analytics is blocked

const app = createApp(App)
app.use(router)
app.mount('#app')
