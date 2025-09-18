import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { writeUserProfile } from '../firebase/firebaseHelpers';
import toast from 'react-hot-toast';
import { auth } from '../firebase/firebase';

export default function ProfilePage(){
  const user = useSelector(state => state.auth.user);
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');

  async function saveProfile(){
    if(!user) return toast.error('Not logged in');
    await writeUserProfile(user.uid, { name, mobile, email: user.email });
    toast.success('Profile saved');
  }

  return (
    <div className="max-w-md mx-auto bg-white/80 dark:bg-gray-800/80 p-6 rounded-md shadow">
      <h2 className="text-xl font-medium mb-4">Profile</h2>
      <div className="space-y-3">
        <input className="w-full p-2 rounded border" placeholder="Name" value={name} onChange={e=>setName(e.target.value)} />
        <input className="w-full p-2 rounded border" placeholder="Mobile" value={mobile} onChange={e=>setMobile(e.target.value)} />
        <div className="flex gap-3">
          <button onClick={saveProfile} className="px-4 py-2 bg-indigo-600 text-white rounded">Save</button>
          <button onClick={()=>auth.signOut()} className="px-4 py-2 border rounded">Sign out</button>
        </div>
      </div>
    </div>
  )
}
