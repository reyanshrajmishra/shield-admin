import { initializeApp } from "firebase/app";
import { getFirestore, collection } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.API_KEY,
  authDomain  : import.meta.env.AUTH_DOMAIN,
  projectId: import.meta.env.PROJECT_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const feedsCollection = collection(db, "feeds");
const usersCollection = collection(db, "users");
const wantedsCollection = collection(db, "wanteds");
const employeesCollection = collection(db, "employees");

export { db, feedsCollection, usersCollection, wantedsCollection, employeesCollection };
