'use client'

import Image from "next/image";
import {Colors} from "@/constants/colors";
import React from "react";
import {formatDateFromTimestamp} from "@/app/utils/timeParser";
import {TickCircle} from "iconsax-react";
import { motion } from "motion/react"
import TaskDrawer from "@/app/tasks/components/TaskDrawer";
import {useDisclosure} from "@nextui-org/react";
import {Task} from "@/app/store/store";


export default function TaskCard({ Task, isDragging }: { Task: Task; isDragging?: boolean }) {
  const {isOpen, onOpen, onOpenChange} = useDisclosure();

  const handleMouseUp = () => {
    onOpen()
  };
  return (
    <>
      <TaskDrawer taskId={Task.taskId} isOpenDrawer={isOpen} action={onOpenChange} taskStage={Task.status}/>
    <motion.div
      onMouseUp={handleMouseUp}
      initial={{rotate: 0}}
      animate={{rotate: isDragging ? 5 : 0}}
      transition={{type: "spring", stiffness: 300, damping: 20}} whileHover={{ scale: 1.1 }} className="border-2 border-dark50 rounded-lg bg-white mb-3">
      <div>
        <div className="flex items-center gap-3 p-4">
          <TickCircle
            size="21"
            color={Colors.Dark300}
          />
          <div className="font-bold text-2xl w-96 text-start">{Task.TaskName}</div>
        </div>

        <div className="border-t-1 border-dark50 p-4 h-full">
          <div className="text-start mt-1 mb-1 text-lg text-dark300">
            {Task.description}
          </div>
          <div className="flex items-center justify-between gap-3 mt-2">
          <div className="flex gap-3 items-center mt-2">
            <Image src='/avatar.png' alt="..." width={40} height={40} className="rounded-full"/>
            <div>
              <div className="text-sm text-blue1 bg-blue2 p-1.5">
                {formatDateFromTimestamp(Task.dueDate)}
              </div>
            </div>
          </div>
          <div>
            <div>
              {Task.priority === 'High' && (
                <div className="flex gap-2 items-center bg-red2 p-1 rounded-s">
                  <div className="bg-red-500 h-2 w-2 rounded-full"/>
                  <p className="text-red-500 font-bold text-sm">High</p>
                </div>
              )}
              {Task.priority === 'Low' && (
                <div className="flex gap-2 items-center bg-blue2 p-1 rounded-s">
                  <div className="bg-blue-700 h-2 w-2 rounded-full"/>
                  <p className="text-blue-700 font-bold text-sm">Low</p>
                </div>
              )}
              {Task.priority === 'Medium' && (
                <div className="flex gap-2 items-center bg-yellow2 p-1 rounded-s">
                  <div className="bg-yellow-400 h-2 w-2 rounded-full"/>
                  <p className="text-yellow-400 font-bold text-sm">Medium</p>
                </div>
              )}
            </div>
          </div>
          </div>
        </div>
      </div>
    </motion.div>
    </>
  )
}