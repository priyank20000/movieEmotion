import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  addDoc, 
  query, 
  where, 
  getDocs,
  updateDoc,
  doc 
} from 'firebase/firestore';
import { CryptoPredict } from '../types/movie';

const firebaseConfig = {
  // Add your Firebase config here
  apiKey: "YOUR_API_KEY",
  authDomain: "your-app.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-app.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export const createPrediction = async (prediction: CryptoPredict) => {
  try {
    const docRef = await addDoc(collection(db, 'predictions'), prediction);
    return docRef.id;
  } catch (error) {
    console.error('Error creating prediction:', error);
    throw error;
  }
};

export const getMoviePredictions = async (movieId: number) => {
  try {
    const q = query(
      collection(db, 'predictions'),
      where('movieId', '==', movieId)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error fetching predictions:', error);
    throw error;
  }
};

export const updateUserBalance = async (userId: string, newBalance: number) => {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      balance: newBalance
    });
  } catch (error) {
    console.error('Error updating user balance:', error);
    throw error;
  }
};