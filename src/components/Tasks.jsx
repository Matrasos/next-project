'use client'

const Tasks = ({ tasks, completed, onEditClick, onMarkAsCompletedClick, onUnmarkAsCompletedClick }) => {
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
          >
            <li>Название задачи: {task.name}</li>
            <li>Описание задачи: {task.description}</li>
            <li className={task.isCompleted ? 'text-green-500' : 'text-red-500'}>
              Статус задачи: {task.isCompleted ? 'Выполнено' : 'Не выполнено'}
            </li>
            {/* Добавляем кнопку редактирования */}
            <button
              onClick={() => onEditClick(task.id)}
              className='bg-yellow-500 text-white p-[8px] rounded-[8px] mt-[8px]'>
              Редактировать
            </button>
            {/* Добавляем кнопку "Выполнено" */}
            {!task.isCompleted && (
              <button
                onClick={() => onMarkAsCompletedClick(task.id)}
                className='bg-green-500 text-white p-[8px] rounded-[8px] mt-[8px] ml-[10px]'>
                Завершить
              </button>
            )}
            {/* Добавляем кнопку "Отменить выполнение" */}
            {task.isCompleted && (
              <button
                onClick={() => onUnmarkAsCompletedClick(task.id)}
                className='bg-red-500 text-white p-[8px] rounded-[8px] mt-[8px] ml-[10px]'>
                Отменить завершение
              </button>
            )}
          </div>
        ))}
      </ul>
    </div>
  );
};

export default Tasks;
