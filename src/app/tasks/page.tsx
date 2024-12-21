// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
'use client';

import React, {useEffect, useState} from 'react';
import {DndContext, useDraggable, useDroppable,} from '@dnd-kit/core';
import {Add, Record} from "iconsax-react";
import {Colors} from "@/constants/colors";
import CreateTask from "@/app/tasks/components/createTask";
import TaskCard from "@/app/tasks/components/TaskCard";
import {useDisclosure} from "@nextui-org/react";
import TaskDrawer from "@/app/tasks/components/TaskDrawer";

export type Task = {
  taskId: string;
  TaskName:string,
  status: 'todo' | 'inProgress' | 'completed';
  dueDate: number;
  assigneeId: string;
  priority: 'Low' | 'Medium' | 'High';
  description?:string,
};

export default function Page() {
  const TasKStages: { id: string; name: 'todo' | 'inProgress' | 'completed' }[] = [
    { id: 'todo', name: 'todo' },
    { id: 'inProgress', name: 'inProgress' },
    { id: 'completed', name: 'completed' },
  ];
  const [isCreateTask,setIsCreateTask] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<'todo' | 'inProgress' | 'completed'>();
  const [Tasks, setTasks] = useState<{ todo: Task[]; inProgress: Task[]; completed: Task[];
  }>({
    todo: [],
    inProgress: [],
    completed: [],
  });

  useEffect(() => {
    const storedTasks = localStorage.getItem('tasks');
    if(storedTasks) {
      const parsedTasks = JSON.parse(storedTasks) as Task[];
      const taskGroup:{ todo: Task[]; inProgress: Task[]; completed: Task[] } = {
        todo: [],
        inProgress: [],
        completed: [],
      }
      parsedTasks.forEach((task) => {
        taskGroup[task.status].push(task);
      });
      setTasks(taskGroup);
    }
  }, []);


  const createTask = (taskStage: 'todo' | 'inProgress' | 'completed') => {
    setIsCreateTask(true);
    setSelectedStatus(taskStage);
  }

  function handleDragEnd(event: { active: { id: string }; over: { id: string } }) {
    const { active, over } = event;

    if (!over) return;

    const sourceContainer = Object.keys(Tasks).find((key) =>
      Tasks[key].some((task) => task.taskId === active.id)
    );

    if (sourceContainer && sourceContainer !== over.id) {
      // Move the item to the new container
      setTasks((prev) => {
        // Copy the tasks from the source and target containers
        const sourceItems = [...prev[sourceContainer]];
        const targetItems = [...prev[over.id]];

        // Find the task being dragged
        const draggedTask = sourceItems.find((task) => task.taskId === active.id);

        // If the task exists in the source container
        if (draggedTask) {
          // Remove the task from the source and add it to the target
          sourceItems.splice(sourceItems.indexOf(draggedTask), 1);
          draggedTask.status = over.id; // Update the task's status when it is moved
          targetItems.push(draggedTask); // Add the task to the target container
        }

        const updatedTasks = {
          ...prev,
          [sourceContainer]: sourceItems,
          [over.id]: targetItems,
        };
        const allTasks = [...updatedTasks.todo, ...updatedTasks.inProgress, ...updatedTasks.completed];
        localStorage.setItem('tasks', JSON.stringify(allTasks));

        return updatedTasks;
      });
    }
  }

  function Draggable({ id, children  }: { id: string; children: React.ReactNode }) {
    const { attributes, listeners, setNodeRef, transform, isDragging  } = useDraggable({
      id,
    });
    const {isOpen, onOpen, onOpenChange} = useDisclosure();

    const handleMouseUp = () => {
      onOpen()
    };

    const style = {
      transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
      zIndex: isDragging ? 10 : 1,
      cursor: 'grab',
    };

    return (
      <>
        <TaskDrawer taskId={id} isOpenDrawer={isOpen} onOpenDrawerChange={onOpenChange}/>
        <button
          ref={setNodeRef}
          style={style}
          {...listeners}
          {...attributes}
          onMouseUp={handleMouseUp}
        >
          {React.cloneElement(children as React.ReactElement, { isDragging })}
        </button>
      </>
    );
  }

  function Droppable({id}: { id: string }) {
    const {isOver, setNodeRef} = useDroppable({id});
    const style = {
      backgroundColor: isOver ? '#d3f9d8' : '#F6F6F6',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
    };

    return (
      <div ref={setNodeRef} style={style}>
        {(Tasks[id] || []).map((item: Task) => (
          <Draggable key={item.taskId} id={item.taskId}>
            <TaskCard Task={item}/>
          </Draggable>
        ))}
      </div>
    )
  }

  return (
    <div>
      <DndContext onDragEnd={handleDragEnd}>
        <div className="flex flex-row gap-4">
          {TasKStages.map((stage) => (
            <div key={stage.id}
                 className="p-5 flex flex-col flex-1 rounded-xl border-dashed border-2 border-dark h-screen">
              <div className="flex justify-between items-center bg-white p-4 rounded-lg mb-4">
                <div className="flex flex-row items-center gap-2">
                  {stage.name === 'todo' && (
                    <Record
                      size="20"
                      color={Colors.yellow1}
                    />
                )}
                {stage.name === 'inProgress' && (
                  <Record
                    size="20"
                    color={Colors.blue1}
                  />
                )}
                {stage.name === 'completed' && (
                  <Record
                    size="20"
                    color={Colors.green1}
                  />
                )}
                <div className="font-bold text-lg">
                  {stage?.name === 'inProgress' ? 'In Progress' : stage?.name}
                </div>
                <div className="text-blue1 font-bold text-center ml-3">
                  {Tasks[stage.name].length}
                </div>
              </div>
              <div>
                <button onClick={()=>createTask(stage.name)}>
                  <Add size="32" color={Colors.Dark500}/>
                </button>
              </div>
            </div>
            <div>
              {(isCreateTask && selectedStatus === stage.name) &&  (
                <CreateTask status={stage.name}/>
              )}
              {Tasks[stage.name].length === 0 && !isCreateTask && (
              <div className="flex justify-center mt-4">
                <button onClick={()=>createTask(stage.name)} className="flex items-center text-dark300 font-bold justify-center p-2 rounded-lg gap-3 hover:bg-gray-200 hover:transition ease-in duration-200">
                  <Add size="25" color={Colors.Dark300}/>
                  <span> Add task</span>
                </button>
              </div>
              )}
            </div>
              <Droppable key={stage.id} id={stage.id} />
            </div>
          ))}
        </div>
      </DndContext>
    </div>
  );
}
