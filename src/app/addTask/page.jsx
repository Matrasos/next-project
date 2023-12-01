'use client'

import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '@/config/firebase';
import { useState, useEffect } from 'react';
import { collection, addDoc } from 'firebase/firestore';

export default function Todos() {
  const [taskName, setTaskName] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [user, setUser] = useState(null);
  const [isRegistered, setIsRegistered] = useState(false);

  const addTask = async () => {
    try {
      if (!taskName.trim()) {
        // Проверка на пустое имя задачи
        alert('Введите название задачи');
        return;
      }

      const userId = auth.currentUser.uid; // Получаем идентификатор текущего пользователя

      // Добавляем задачу в коллекцию "todos"
      const todosCollection = collection(db, 'todos');
      const newTaskRef = await addDoc(todosCollection, {
        name: taskName,
        description: taskDescription,
        isCompleted: false,
        userId: userId,
      });

      // Очищаем поля ввода после добавления задачи
      setTaskName('');
      setTaskDescription('');

      // Выводим alert с сообщением об успешном добавлении
      alert(`Задача "${taskName}" успешно добавлена`);
    } catch (error) {
      console.error('Ошибка при добавлении задачи:', error);
      // Выводим alert с сообщением об ошибке
      alert('Произошла ошибка при добавлении задачи. Пожалуйста, попробуйте снова.');
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className='border border-solid border-t-black p-[12px]'>
      <h2 className='text-[32px] font-semibold'>Добавить задачу</h2>
      <div className='mt-[20px]'>
        <input
          type='text'
          value={taskName}
          onChange={(e) => setTaskName(e.target.value)}
          placeholder='Введите название задачи'
          className='w-full border border-solid border-black-400 p-[8px] rounded-[12px]'
        />
        <input
          type='text'
          value={taskDescription}
          onChange={(e) => setTaskDescription(e.target.value)}
          placeholder='Введите описание задачи'
          className='w-full border border-solid border-black-400 p-[8px] rounded-[12px] mt-[8px]'
        />
        <button
          onClick={addTask}
          className='w-full bg-blue-500 text-white p-[12px] rounded-[12px] mt-[8px]'>
          Добавить задачу
        </button>
      </div>
    </div>
  );
}
