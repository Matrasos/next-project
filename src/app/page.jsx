'use client'

import { onAuthStateChanged } from 'firebase/auth'
import { auth, db } from "@/config/firebase";
import { async } from "@firebase/util";
import { useEffect, useState } from "react";
import { getDocs, collection, addDoc } from "firebase/firestore";

export default function Home() {

  const [isRegistered, setIsRegistered] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsRegistered(!!user);
    });

    return () => unsubscribe();
  }, []);

  return (
    <>
      {isRegistered
        ? 'Вы вошли в систему'
        : 'Вы не вошли в систему'
      }
    </>
  )
}
