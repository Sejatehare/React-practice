import React, { useState } from 'react';
import { signup, login } from '../firebase/firebaseHelpers';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { setUser } from '../store/auth-slice';

export default function AuthPage(){
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();

  async function submit(e){
    e.preventDefault();
    try{
      if(isLogin){
        const cred = await login(email, password);
        dispatch(setUser({ uid: cred.user.uid, email: cred.user.email }));
        toast.success('Logged in');
      } else {
        const cred = await signup(email, password);
        dispatch(setUser({ uid: cred.user.uid, email: cred.user.email }));
        toast.success('Signup successful — verification email sent');
      }
    } catch(err){
      toast.error(err.message);
    }
  }

  return (
    <div className="max-w-md mx-auto bg-white/80 dark:bg-gray-800/80 p-6 rounded-md shadow">
      <h2 className="text-xl font-medium mb-4">{isLogin ? 'Login' : 'Sign up'}</h2>
      <form onSubmit={submit} className="space-y-3">
        <input className="w-full p-2 rounded border" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input type="password" className="w-full p-2 rounded border" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} />
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 bg-indigo-600 text-white rounded">{isLogin ? 'Login' : 'Sign up'}</button>
          <button type="button" onClick={()=>setIsLogin(v=>!v)} className="px-3 py-2 border rounded">{isLogin ? 'Switch to Sign up' : 'Switch to Login'}</button>
        </div>
      </form>
    </div>
  )
}
