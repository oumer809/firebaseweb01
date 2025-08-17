    import { initializeApp } from "firebase/app";
    import { getAuth } from "firebase/auth";
    import { getFirestore } from "firebase/firestore";

    const firebaseConfig = {
  apiKey: "AIzaSyAzjR5mhxoNzVZvMAeTZ1rZv4jZe6hZ-s4",
  authDomain: "expense-tracker-4a84e.firebaseapp.com",
  projectId: "expense-tracker-4a84e",
  storageBucket: "expense-tracker-4a84e.firebasestorage.app",
  messagingSenderId: "339544845251",
  appId: "1:339544845251:web:097984e9cdd61057692b76"
};

    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    const db = getFirestore(app);

    export { auth, db };