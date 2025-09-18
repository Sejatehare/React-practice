import React, { useEffect } from 'react';
import ExpenseTracker from '../components/ExpenseTracker';
import { useSelector, useDispatch } from 'react-redux';
import { setUser } from '../store/auth-slice';
import { auth } from '../firebase/firebase';
import { onAuthStateChanged } from 'firebase/auth';

export default function HomePage(){
  const dispatch = useDispatch();
  useEffect(()=>{
    const unsub = onAuthStateChanged(auth, user => {
      if(user) dispatch(setUser({ uid: user.uid, email: user.email }));
      else dispatch(setUser(null));
    });
    return unsub;
  },[dispatch]);

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Dashboard</h1>
      <ExpenseTracker />
    </div>
  )
}
