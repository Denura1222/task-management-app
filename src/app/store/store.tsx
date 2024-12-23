import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Task = {
  taskId: string;
  TaskName: string,
  status: Status;
  dueDate: number;
  assigneeId: string;
  priority: 'Low' | 'Medium' | 'High';
  description:string,
};

type Status = 'todo' | 'inProgress' | 'completed';

type TaskStore = {
  tasks: Record<Status, Task[]>;
  addTask: (status: Status, task:Task) => void;
  getTaskById: (id: string,status:Status) => Task | undefined;
  deleteById: (id: string) => void;
};

const useTaskStore = create<TaskStore>()(
  persist(
    (set,get) => ({
      tasks: {
        todo: [],
        inProgress: [],
        completed: [],
      },
      addTask: (status, task) => {
        set((state) => ({
          tasks: {
            ...state.tasks,
            [status]: [...state.tasks[status], task],
          },
        }));
      },
      getTaskById: (id: string, status:Status) => {
        const task = get().tasks[status];
        return task.find((task) => task.taskId === id);
      },
      deleteById:(id: string) => {
        set((state) => {
          const updatedTasks = Object.fromEntries(
            Object.entries(state.tasks).map(([status, tasks]) => [
              status,
              tasks.filter((task) => task.taskId !== id),
            ])
          ) as Record<Status, Task[]>;

          return { tasks: updatedTasks };
        });
      }

    }),
    { name: 'task-store' }
  )
);

export default useTaskStore;
