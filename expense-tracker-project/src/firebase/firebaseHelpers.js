import { signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail, sendEmailVerification} from 'firebase/auth';
import { getDatabase, ref, set, push, onValue, remove, update, get } from 'firebase/database';
import { auth, database } from './firebase'; // or firebaseConfig

const db = getDatabase();

/**
 * =====================
 * AUTH HELPERS
 * =====================
 */

/** Sign up user and send verification email */

export async function writeUserProfile(userId, profile) {
  await set(ref(db, "users/" + userId + "/profile"), profile);
}

// Read user profile
export async function readUserProfile(userId) {
  const snapshot = await get(ref(db, "users/" + userId + "/profile"));
  if (snapshot.exists()) {
    return snapshot.val();
  } else {
    return null;
  }
}

export async function signup(email, password){
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  await sendEmailVerification(userCredential.user);
  return userCredential;
}

/** Login user */
export async function login(email, password){
  return await signInWithEmailAndPassword(auth, email, password);
}

/** Reset password */
export async function resetPassword(email){
  return await sendPasswordResetEmail(auth, email);
}

/**
 * =====================
 * USER PROFILE HELPERS
 * =====================
 */

/** Write or update user profile */


/** Save or update profile for currently authenticated user */
export const saveUserProfile = async (profileData) => {
  if (!auth.currentUser) throw new Error("No authenticated user");
  const uid = auth.currentUser.uid;
  await set(ref(db, `users/${uid}/profile`), profileData);
};

/** Fetch user profile */
export const fetchUserProfile = async () => {
  if (!auth.currentUser) throw new Error("No authenticated user");
  const uid = auth.currentUser.uid;
  const snapshot = await get(ref(db, `users/${uid}/profile`));
  return snapshot.exists() ? snapshot.val() : null;
};

/**
 * =====================
 * EXPENSE HELPERS
 * =====================
 */

/** Add expense for any UID */
export function addExpenseToDB(uid, expense){
  const expensesRef = ref(db, `users/${uid}/expenses`);
  const newRef = push(expensesRef);
  return set(newRef, expense);
}

/** Add expense for currently authenticated user */
export const addExpense = async (expenseData) => {
  if (!auth.currentUser) throw new Error("No authenticated user");
  const uid = auth.currentUser.uid;
  const expenseRef = ref(db, `users/${uid}/expenses`);
  const newExpenseRef = push(expenseRef);
  await set(newExpenseRef, expenseData);
};

/** Listen to expenses changes for any UID */
export function listenExpenses(uid, callback){
  const expensesRef = ref(db, `users/${uid}/expenses`);
  return onValue(expensesRef, snapshot => {
    const val = snapshot.val() || {};
    const list = Object.keys(val).map(key => ({ id: key, ...val[key] }));
    callback(list);
  });
}

/** Fetch all expenses for currently authenticated user */
export const fetchExpenses = async () => {
  if (!auth.currentUser) throw new Error("No authenticated user");
  const uid = auth.currentUser.uid;
  const snapshot = await get(ref(db, `users/${uid}/expenses`));
  return snapshot.exists() ? snapshot.val() : {};
};

/** Delete an expense for any UID */
export function removeExpenseFromDB(uid, expenseId){
  return remove(ref(db, `users/${uid}/expenses/${expenseId}`));
}

/** Delete an expense for currently authenticated user */
export const deleteExpense = async (expenseId) => {
  if (!auth.currentUser) throw new Error("No authenticated user");
  const uid = auth.currentUser.uid;
  await remove(ref(db, `users/${uid}/expenses/${expenseId}`));
};

/** Update expense for any UID */
export function updateExpenseInDB(uid, expenseId, data){
  return update(ref(db, `users/${uid}/expenses/${expenseId}`), data);
}
