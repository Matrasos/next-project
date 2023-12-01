'use client'

import { auth, googleProvider } from '../../config/firebase'
import { useRouter } from 'next/navigation';
import { createUserWithEmailAndPassword, signInWithPopup, onAuthStateChanged, signInWithEmailAndPassword, RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth'
import { useEffect, useState } from 'react'
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css'

const Auth = () => {
  const router = useRouter();
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isRegistered, setIsRegistered] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [phone, setPhone] = useState("")
  const [user, setUser] = useState(null)
  const [code, setCode] = useState("")

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

  const sendCode = async () => {

    try {
      const recaptcha = new RecaptchaVerifier(auth, "recaptcha", {})
      const confirmation = await signInWithPhoneNumber(auth, phone, recaptcha);
      setUser(confirmation)
    } catch (error) {
      console.error(error)
    }
  }

  const verifyCode = async () => {
    try {
      await user.confirm(code)
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
      <div className='w-full flex gap-[20px] items-center'>
        <PhoneInput
          className='h-[100%] flex-[20%]'
          country={'kz'}
          value={phone}
          onChange={(phone) => { setPhone("+" + phone) }}
        />
        <button onClick={sendCode} className='w-full flex-auto text-center bg-purple-500 text-white rounded-[12px] py-[8px]'>Отправить код</button>
        <div id='recaptcha'></div>
        <input onChange={(e) => { setCode(e.target.value) }} className='border border-solid border-black-400 p-[8px] rounded-[12px]' type='text' placeholder='Код' />
        <button onClick={verifyCode} className='w-full flex-auto text-center bg-purple-500 text-white rounded-[12px] py-[8px]'>Подтвердить</button>
      </div>
    </div>
  );
}

export default Auth;