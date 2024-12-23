// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
'use client'

import {useForm} from "react-hook-form"
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {Calendar, TickCircle, User} from "iconsax-react";
import {Calendars} from "@/components/ui/calendar"
import Image from "next/image";

import {Colors} from "@/constants/colors";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Popover,
  PopoverTrigger,
  PopoverContent
} from "@nextui-org/react";
import React, {useEffect, useRef, useState} from "react";
import {formatDateFromTimestamp} from "@/app/utils/timeParser";
import {v4 as uuidv4} from "uuid";
import {Priority, Users} from "@/constants/dummy";
import { motion } from "framer-motion";
import useTaskStore, {Task} from "@/app/store/store";

export const taskSchema = z.object({
  taskId:z.string().uuid(),
  TaskName: z.string().min(1, "Task name is required"),
  status:z.enum(["todo", "inProgress", "completed"]),
  description:z.string().min(1, "Task description is required").optional(),
  dueDate: z
    .number({invalid_type_error: "Due date must be a valid timestamp"})
    .int("Due date must be an integer")
    .positive("Due date must be a positive number"),
  priority: z.enum(["Low", "Medium", "High"]),
  assigneeId: z.string().uuid(),
});


export default function CreateTask({ status }: {status: 'todo' | 'inProgress' | 'completed' }) {
  const addTask = useTaskStore((state) => state.addTask);

  const [selectedAssignee, setSelectedAssignee] = useState(new Set([""]));
  const [selectedPriority, setSelectedPriority] = useState(new Set([""]));

  const [date, setDate] = useState<Date>()
  const newTaskId = uuidv4();

  const {
    register,
    setValue,
    getValues,
    watch,
  } = useForm<z.infer<typeof taskSchema>>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      taskId: newTaskId,
      status: status,
    },
  })
  const taskAdded = useRef(false);

  const watchFields = watch(["TaskName", "dueDate", "priority", "assigneeId"]);
  useEffect(() => {
    if (taskAdded.current) return;
    const allFieldsFilled = Object.values(watchFields).every((field) => field);

    if (allFieldsFilled) {
      const taskData:Task = {
        taskId: getValues('taskId'),
        TaskName: getValues('TaskName'),
        dueDate: getValues('dueDate'),
        priority: getValues('priority'),
        assigneeId: getValues('assigneeId'),
        description:'',
        status:status,
      };
      addTask(status, taskData);
      taskAdded.current = true;
      setTimeout(() => {
        window.location.reload();
      }, 1500)
    }
  }, [watchFields, status, getValues, addTask]);

  useEffect(() => {
    if (date) setValue("dueDate", date.getTime());
    if (selectedAssignee) {
      const assignee = Array.from(selectedAssignee).join("");
      setValue("assigneeId", assignee);
    }
    if (selectedPriority) {
      const priority = Array.from(selectedPriority).join("") as "Low" | "Medium" | "High";
      setValue("priority", priority);
    }

  }, [selectedAssignee, selectedPriority, date, setValue]);


  return (
    <motion.form
      initial={{ scale: 0.6, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
       exit={{ scale: 0.8, opacity: 0 }}
      transition={{
        type: "spring",
        stiffness: 600,
        damping: 20,
      }} className="border-2 border-dark50 rounded-lg bg-white h-24">
      <div className="flex gap-3 p-2">
        <TickCircle
          size="21"
          color={Colors.Dark300}
        />

        <input placeholder="Write a task name" className="w-full" {...register("TaskName", {required: true})} />
      </div>
      <div className="flex items-center justify-between gap-3 border-t-1 border-dark50 p-1 px-2">
        <div className="flex gap-1 mt-2">
          <Dropdown>
            <DropdownTrigger>
              <div>
                {getValues('assigneeId') ? (
                  <Image src='/avatar.png' alt="..." width={31} height={30} className="rounded-full"/>
                ) : (
                  <div className="rounded-full border-dashed border-dark border-1 p-1.5">
                    <User size="19" color={Colors.Dark300}/>
                  </div>
                )}
              </div>
            </DropdownTrigger>
            <DropdownMenu
              disallowEmptySelection
              aria-label="Single selection example"
              selectedKeys={selectedAssignee}
              selectionMode="single"
              variant="flat"
              onSelectionChange={setSelectedAssignee}
            >
              {Users.map((i) => (
                <DropdownItem
                  key={i.name}
                >
                  <div className="flex items-center font-medium">
                    <Image src='/avatar.png' alt="..." width={30} height={30} className="rounded-full mr-2"/>
                    <span>{i.name}</span>
                  </div>
                </DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>
          <div>
            <Popover>
              <PopoverTrigger>
                <div>
                  {getValues('dueDate') ? (
                    <div className="text-sm text-blue1 bg-blue2 p-1.5">
                      {formatDateFromTimestamp(getValues('dueDate'))}
                    </div>
                  ) : (
                    <div className="rounded-full border-dashed border-dark border-1 p-1.5">
                      <Calendar
                        size="19"
                        color={Colors.Dark300}
                      />
                    </div>
                  )}
                </div>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 z-20">
                <Calendars
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
        <div>
          <Dropdown>
            <DropdownTrigger>
              <div>
                {getValues('priority') ? (
                  <div>
                    {getValues('priority') === 'High' && (
                      <div className="flex gap-2 items-center bg-red2 p-1 rounded-s">
                        <div className="bg-red-500 h-2 w-2 rounded-full"/>
                        <p className="text-red-500 font-bold text-sm">High</p>
                      </div>
                    )}
                    {getValues('priority') === 'Low' && (
                      <div className="flex gap-2 items-center bg-blue2 p-1 rounded-s">
                        <div className="bg-blue-700 h-2 w-2 rounded-full"/>
                        <p className="text-blue-700 font-bold text-sm">Low</p>
                      </div>
                    )}
                    {getValues('priority') === 'Medium' && (
                      <div className="flex gap-2 items-center bg-yellow2 p-1 rounded-s">
                        <div className="bg-yellow-400 h-2 w-2 rounded-full"/>
                        <p className="text-yellow-400 font-bold text-sm">Medium</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div
                    className="h-6 rounded-md flex items-center text-sm text-dark300 border-dashed border-dark border-1 p-2">
                    Set priority
                  </div>
                )}
              </div>
            </DropdownTrigger>
            <DropdownMenu
              disallowEmptySelection
              aria-label="Single selection example"
              selectedKeys={selectedPriority}
              selectionMode="single"
              variant="flat"
              onSelectionChange={setSelectedPriority}
            >
              {Priority.map((i) => (
                <DropdownItem
                  key={i.name}
                >
                  <div className="flex items-center font-medium">
                    <span>{i.name}</span>
                  </div>
                </DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>
        </div>
      </div>
    </motion.form>
  )
}