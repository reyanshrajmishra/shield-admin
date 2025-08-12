import { initializeApp } from "firebase/app";
import { getFirestore, collection } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const feedsCollection = collection(db, "feeds");
const usersCollection = collection(db, "users");
const wantedsCollection = collection(db, "wanteds");
const employeesCollection = collection(db, "employees");

export { db, feedsCollection, usersCollection, wantedsCollection, employeesCollection };
