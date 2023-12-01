'use client'

import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '@/config/firebase';
import { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';

export default function Todos() {
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);

      // Получаем задачи пользователя при входе в систему
      if (user) {
        getTasks(user.uid);
      }
    });

    return () => unsubscribe();
  }, []);

  const getTasks = async (userId) => {
    try {
      // Формируем запрос к коллекции "todos" для конкретного пользователя
      const q = query(collection(db, 'todos'), where('userId', '==', userId));
      const querySnapshot = await getDocs(q);

      // Преобразуем данные из запроса в массив задач
      const tasksData = [];
      querySnapshot.forEach((doc) => {
        tasksData.push({ id: doc.id, ...doc.data() });
      });

      // Устанавливаем полученные задачи в состояние
      setTasks(tasksData);
    } catch (error) {
      console.error('Ошибка при получении задач:', error);
    }
  };

  return (
    <div>
      {user ? (
        <div className='border border-solid border-t-black p-[12px]'>
          <h2 className='text-[32px] font-semibold'>Задачи</h2>
          <div className='mt-[20px]'>
            {tasks.length > 0 ? (
              <ul className='p-[10px] border border-solid border-green-600 rounded-[12px]'>
                {tasks.map((task) => (
                  <div className='p-[10px] mb-[10px] border border-solid border-b-gray-500'>
                    <li key={task.id}>Название задачи: {task.name}</li>
                    <li key={task.id}>Описание задачи: {task.description}</li>
                    <li key={task.id} className={task.isCompleted ? 'text-green-500' : 'text-red-500'}>Статус задачи: {task.isCompleted ? 'Выполнено' : 'Не выполнено'}</li>
                  </div>
                ))}
              </ul>
            ) : (
              <p>Нет задач для отображения</p>
            )}
          </div>
        </div>
      ) : (
        <p>Вы не вошли в систему</p>
      )}
    </div>
  );
}
