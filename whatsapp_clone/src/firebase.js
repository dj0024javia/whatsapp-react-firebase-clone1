import firebase from "firebase";

const firebaseConfig = {
  apiKey: "AIzaSyB1E0sXePGdYAteUztjuOUD2gyAHOnV_rI",
  authDomain: "whatsapp-clone-5fe20.firebaseapp.com",
  databaseURL: "https://whatsapp-clone-5fe20.firebaseio.com",
  projectId: "whatsapp-clone-5fe20",
  storageBucket: "whatsapp-clone-5fe20.appspot.com",
  messagingSenderId: "622928434860",
  appId: "1:622928434860:web:deba2887449e71714c7109",
  measurementId: "G-THZTHQRJDH",
};

const firebaseApp = firebase.initializeApp(firebaseConfig);

const db = firebaseApp.firestore();
const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();

export { auth, provider };
export default db;
