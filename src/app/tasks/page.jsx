'use client'

import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '@/config/firebase';
import { useState, useEffect } from 'react';
import { collection, getDocs, query, where, getDoc, doc, updateDoc, } from 'firebase/firestore';
import EditTask from '@/components/EditTask'; // Импортируйте новый компонент
import Tasks from '@/components/Tasks';

const Todos = () => {
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [editingTaskId, setEditingTaskId] = useState(null); // Новое состояние для отслеживания редактирования

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

  const handleMarkAsCompleted = async (taskId) => {
    try {
      const taskRef = doc(db, 'todos', taskId);
      const taskSnapshot = await getDoc(taskRef);

      if (taskSnapshot.exists()) {
        await updateDoc(taskRef, {
          isCompleted: true, // Устанавливаем задачу как выполненную
        });

        // Обновляем локальное состояние задач
        setTasks((prevTasks) =>
          prevTasks.map((task) => (task.id === taskId ? { ...task, isCompleted: true } : task))
        );
      }
    } catch (error) {
      console.error('Ошибка при обновлении статуса задачи:', error);
    }
  };

  const handleUnmarkAsCompleted = async (taskId) => {
    try {
      const taskRef = doc(db, 'todos', taskId);
      const taskSnapshot = await getDoc(taskRef);

      if (taskSnapshot.exists()) {
        await updateDoc(taskRef, {
          isCompleted: false, // Устанавливаем задачу как невыполненную
        });

        // Обновляем локальное состояние задач
        setTasks((prevTasks) =>
          prevTasks.map((task) => (task.id === taskId ? { ...task, isCompleted: false } : task))
        );
      }
    } catch (error) {
      console.error('Ошибка при обновлении статуса задачи:', error);
    }
  };

  const toggleTaskCompletion = async (taskId) => {
    try {
      const taskRef = doc(db, 'todos', taskId);
      const taskSnapshot = await getDoc(taskRef);

      if (taskSnapshot.exists()) {
        const currentStatus = taskSnapshot.data().isCompleted;

        await updateDoc(taskRef, {
          isCompleted: !currentStatus, // Переключаем состояние выполнения задачи
        });

        // Обновляем локальное состояние задач
        setTasks((prevTasks) =>
          prevTasks.map((task) => (task.id === taskId ? { ...task, isCompleted: !currentStatus } : task))
        );
      }
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

  const handleEditClick = (taskId) => {
    setEditingTaskId(taskId);
  };

  const handleEditCancel = () => {
    setEditingTaskId(null);
  };

  const handleUpdate = () => {
    setEditingTaskId(null);
    try {
      getTasks(user.uid);
    } catch (error) {
      console.error('Ошибка при обновлении задачи:', error);
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
                <Tasks
                  tasks={tasks.filter((task) => !task.isCompleted)}
                  completed={false}
                  onEditClick={handleEditClick}
                  onMarkAsCompletedClick={handleMarkAsCompleted}
                />
                {/* Добавляем редактор задачи */}
                {editingTaskId !== null && (
                  <EditTask
                    taskId={editingTaskId}
                    name={tasks.find((task) => task.id === editingTaskId)?.name}
                    description={tasks.find((task) => task.id === editingTaskId)?.description}
                    onUpdate={handleUpdate}
                    onCancel={handleEditCancel}
                  />
                )}
                {/* Добавляем возможность снять отметку "Выполнено" */}
                <Tasks
                  tasks={tasks.filter((task) => task.isCompleted)}
                  completed={true}
                  onEditClick={handleEditClick}
                  onMarkAsCompletedClick={handleMarkAsCompleted}
                  onUnmarkAsCompletedClick={handleUnmarkAsCompleted}
                />
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
};

export default Todos;
