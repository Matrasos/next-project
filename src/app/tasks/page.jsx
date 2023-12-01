'use client'

import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '@/config/firebase';
import { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, query, where, doc, updateDoc } from 'firebase/firestore';

const Tasks = ({ tasks, completed, onTaskClick }) => {
  if (tasks.length === 0) {
    return (
      <div className='flex flex-col gap-[12px]'>
        <h2 className='font-bold text-[28px]'>{completed ? 'Выполненные' : 'Невыполненные'}</h2>
        <p>Нет задач для отображения</p>
      </div>
    );
  }

  return (

    <div className='flex flex-col gap-[12px]'>
      <h2 className='font-bold text-[28px]'>{completed ? 'Выполненные' : 'Невыполненные'}</h2>
      <ul className={`p-[10px] border border-solid border-${completed ? 'green' : 'red'}-600 rounded-[12px]`}>
        {tasks.map((task) => (
          <div
            key={task.id}
            className={`p-[10px] mb-[10px] border border-solid border-b-gray-500 ${task.isCompleted ? 'cursor-not-allowed' : 'cursor-pointer'}`}
            onClick={() => !task.isCompleted && onTaskClick(task.id)}
          >
            <li>Название задачи: {task.name}</li>
            <li>Описание задачи: {task.description}</li>
            <li className={task.isCompleted ? 'text-green-500' : 'text-red-500'}>
              Статус задачи: {task.isCompleted ? 'Выполнено' : 'Не выполнено'}
            </li>
          </div>
        ))}
      </ul>
    </div>
  );
};


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

  const toggleTaskCompletion = async (taskId) => {
    try {
      const taskRef = doc(db, 'todos', taskId);
      await updateDoc(taskRef, {
        isCompleted: true, // Замените на !task.isCompleted, если хотите переключать между выполненным и невыполненным
      });

      // Обновляем локальное состояние задач
      setTasks((prevTasks) =>
        prevTasks.map((task) => (task.id === taskId ? { ...task, isCompleted: true } : task))
      );
    } catch (error) {
      console.error('Ошибка при обновлении статуса задачи:', error);
    }
  };

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
              <div className='flex flex-col gap-[30px]'>
                <Tasks tasks={tasks.filter((task) => !task.isCompleted)} completed={false} onTaskClick={toggleTaskCompletion} />
                <Tasks tasks={tasks.filter((task) => task.isCompleted)} completed={true} onTaskClick={toggleTaskCompletion} />
              </div>
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
