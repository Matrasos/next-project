'use client'

import Link from "next/link";
import { auth } from './../config/firebase'
import { signOut, onAuthStateChanged } from 'firebase/auth'
import { useEffect, useState } from "react";

const Navbar = () => {

  const [isRegistered, setIsRegistered] = useState(false);

  const logout = async () => {
    try {
      await signOut(auth)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsRegistered(!!user);
    });

    return () => unsubscribe();
  }, []);


  return (
    <div className="w-full p-[12px] flex justify-between">
      <Link href="/">Logo</Link>
      <div className="flex gap-[8px]">
        {isRegistered
          ? (<><Link href="/tasks">Задачи</Link> <button className="text-red-400" onClick={logout}>Выйти</button></>)
          : <Link href="/auth">Войти</Link>
        }
      </div>
    </div>
  );
}

export default Navbar;