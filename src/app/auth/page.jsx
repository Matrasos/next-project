'use client'

import { auth, googleProvider } from '../../config/firebase'
import { useRouter } from 'next/navigation';
import { createUserWithEmailAndPassword, signInWithPopup, onAuthStateChanged, signInWithEmailAndPassword } from 'firebase/auth'
import { useEffect, useState } from 'react'

const Auth = () => {
  const router = useRouter();
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isRegistered, setIsRegistered] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      // Пользователь зарегистрирован, если user не является null
      setIsRegistered(!!user);

      // Перенаправить пользователя, если он авторизован
      if (user) {
        router.push('/');
      }
    });

    // Очистка слушателя при размонтировании компонента
    return () => unsubscribe();
  }, []);

  const SignIn = async () => {
    try {
      if (password.length < 6) {
        setPasswordError("Пароль должен содержать не менее 6 символов");
        return;
      }

      await createUserWithEmailAndPassword(auth, email, password);
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        console.error('Email уже используется. Возможно, пользователь уже зарегистрирован.');
        alert('Пользователь с таким email уже зарегистрирован!');
      } else {
        console.error(error);
      }
    }
  }

  const SignInWithEmail = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      if (error.code === 'auth/invalid-credential') {
        console.error('Ошибка при отправке данных');
        alert('Неправильный логин или пароль');
      } else {
        console.error(error);
      }
    }
  };



  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider)
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className='flex flex-col gap-[15px] p-[12px]'>
      <h2 className='font-bold text-[32px]'>Форма авторизации</h2>
      <input
        onChange={(e) => {
          setEmail(e.target.value);
        }}
        className='border border-solid border-black-400 p-[8px] rounded-[12px]'
        type='text'
        placeholder='Email'
      />
      <input
        onChange={(e) => {
          setPassword(e.target.value);
        }}
        className='border border-solid border-black-400 p-[8px] rounded-[12px]'
        type='text'
        placeholder='Пароль'
      />
      <div className='w-full mt-[20px] flex gap-[20px]'>
        <button
          className='w-full bg-green-500 text-white p-[12px] rounded-[12px]'
          onClick={SignIn}>
          Зарегистрироваться
        </button>
        <button
          className='w-full bg-blue-500 text-white p-[12px] rounded-[12px]'
          onClick={SignInWithEmail}>
          Войти
        </button>
      </div>
      <p className='text-red-500'>{passwordError}</p>
      <button
        onClick={signInWithGoogle}
        className='mt-[100px] bg-cyan-300 text-black p-[12px] rounded-[12px]'>
        Авторизоваться с помощью Google
      </button>
    </div>
  );
}

export default Auth;