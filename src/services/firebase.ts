import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyD4J8HZ-J7KjHZGqYqP3h3YqUkW9c3eXtY",
  authDomain: "moviemood-ai.firebaseapp.com",
  projectId: "moviemood-ai",
  storageBucket: "moviemood-ai.appspot.com",
  messagingSenderId: "850112067155",
  appId: "1:850112067155:web:9b3b9b9b3b9b9b3b3b9b9b"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);