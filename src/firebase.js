import { initializeApp } from "firebase/app";
import { getFirestore, collection } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.API_KEY,
  authDomain: process.env.AUTH_DOMAIN,
  projectId: process.env.PROJECT_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const feedsCollection = collection(db, "feeds");
const usersCollection = collection(db, "users");
const wantedsCollection = collection(db, "wanteds");
const employeesCollection = collection(db, "employees");

export { db, feedsCollection, usersCollection, wantedsCollection, employeesCollection };
