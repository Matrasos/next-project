'use client'

import { onAuthStateChanged } from 'firebase/auth'
import { auth, db } from "@/config/firebase";
import { async } from "@firebase/util";
import { useEffect, useState } from "react";
import { getDocs, collection, addDoc } from "firebase/firestore";

export default function Home() {
  const [user, setUser] = useState(null);
  const [isRegistered, setIsRegistered] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className='border border-solid border-t-black p-[12px]'>
      {user ? (
        <>
          <h2 className='text-green-500 text-[32px] font-semibold'>Вы вошли в систему</h2>
          <div className='mt-[20px]'>
            <p>
              <span className='font-medium inline-block mr-[12px]'>Email:</span>
              {user.email}
            </p>
            <p>
              <span className='font-medium inline-block mr-[12px]'>UID:</span>
              {user.uid}
            </p>
          </div>
        </>
      ) : (
        <p>Вы не вошли в систему</p>
      )}
    </div>
  )
}
