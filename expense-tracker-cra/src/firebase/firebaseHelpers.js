import { signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail, sendEmailVerification } from 'firebase/auth';
import { ref, set, push, onValue, remove, update } from 'firebase/database';
import { auth, database } from './firebase';

/**
 * Auth helpers
 */
export async function signup(email, password){
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  await sendEmailVerification(userCredential.user);
  return userCredential;
}

export async function login(email, password){
  return await signInWithEmailAndPassword(auth, email, password);
}

export async function resetPassword(email){
  return await sendPasswordResetEmail(auth, email);
}

/**
 * DB helpers (Realtime Database)
 * Structure: /users/{uid}/profile and /users/{uid}/expenses/{expenseId}
 */
export function writeUserProfile(uid, profile){
  return set(ref(database, `users/${uid}/profile`), profile);
}

export function addExpenseToDB(uid, expense){
  const expensesRef = ref(database, `users/${uid}/expenses`);
  const newRef = push(expensesRef);
  return set(newRef, expense);
}

export function listenExpenses(uid, callback){
  const expensesRef = ref(database, `users/${uid}/expenses`);
  return onValue(expensesRef, snapshot => {
    const val = snapshot.val() || {};
    const list = Object.keys(val).map(key => ({ id: key, ...val[key] }));
    callback(list);
  });
}

export function removeExpenseFromDB(uid, expenseId){
  return remove(ref(database, `users/${uid}/expenses/${expenseId}`));
}

export function updateExpenseInDB(uid, expenseId, data){
  return update(ref(database, `users/${uid}/expenses/${expenseId}`), data);
}
