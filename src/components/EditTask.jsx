'use client'

// EditTask.jsx
import { useState } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/config/firebase';

const EditTask = ({ taskId, name, description, onUpdate }) => {
  const [newName, setNewName] = useState(name);
  const [newDescription, setNewDescription] = useState(description);

  const handleUpdate = async () => {
    try {
      const taskRef = doc(db, 'todos', taskId);
      await updateDoc(taskRef, {
        name: newName,
        description: newDescription,
      });

      onUpdate(); // Обновляем родительский компонент после успешного обновления
    } catch (error) {
      console.error('Ошибка при обновлении задачи:', error);
    }
  };

  return (
    <div className='flex flex-col gap-[12px]'>
      <h3 className='font-bold text-[24px]'>Редактировать задачу</h3>
      <input
        type='text'
        value={newName}
        onChange={(e) => setNewName(e.target.value)}
        placeholder='Название задачи'
        className='border border-solid border-black-400 p-[8px] rounded-[12px]'
      />
      <textarea
        value={newDescription}
        onChange={(e) => setNewDescription(e.target.value)}
        placeholder='Описание задачи'
        className='border border-solid border-black-400 p-[8px] rounded-[12px]'
      />
      <button
        onClick={handleUpdate}
        className='bg-blue-500 text-white p-[12px] rounded-[12px] mt-[8px]'>
        Сохранить изменения
      </button>
    </div>
  );
};

export default EditTask;
