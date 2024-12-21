// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  useDisclosure,
  Popover,
  PopoverTrigger,
  PopoverContent, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Select, SelectItem,
} from "@nextui-org/react";
import React, {useEffect, useState} from "react";
import {Task} from "@/app/tasks/page";
import {Colors} from "@/constants/colors";
import {
  ArrowRight,
  Calendar,
  Flag,
  Record,
  TickCircle,
  Trash,
  User,
  Document,
  CloseCircle,
} from "iconsax-react";
import {formatDateFromTimestamp} from "@/app/utils/timeParser";
import TaskDeleteAlert from "@/app/tasks/components/TaskDeleteAlert";
import {Calendars} from "@/components/ui/calendar";
import Image from "next/image";
import {Priority, Users} from "@/constants/dummy";
import {Textarea} from "@nextui-org/input";

export default function TaskDrawer({isOpenDrawer, onOpenDrawerChange,taskId}: {taskId:string,isOpenDrawer: boolean, onOpenDrawerChange: (isOpen: boolean) => void}) {
  const {isOpen, onOpen, onOpenChange} = useDisclosure();
  const [task, setTask] = useState<Task>();
  const [date, setDate] = useState<number | undefined>()
  const [assignee, setAssignee] = useState<string | undefined>()
  const [priority, setPriority] = useState<string | undefined>()
  const [description, setDescription] = useState<string | undefined>()

  useEffect(() => {
    const storedTasks = localStorage.getItem('tasks');
    if(storedTasks) {
      const parsedTasks = JSON.parse(storedTasks) as Task[];
      setTask(parsedTasks.find((i)=> i.taskId === taskId));
    }
  }, [taskId]);

  useEffect(() => {
    setDate(task?.dueDate)
    setAssignee(task?.assigneeId)
    setPriority(task?.priority)
    setDescription(task?.description)
  }, [task]);

  useEffect(() => {
    const taskData = {
      taskId: task?.taskId,
      TaskName: task?.TaskName,
      dueDate: date,
      priority: priority,
      assigneeId: assignee,
      description: description,
      status: task?.status,
    };

    const tasks = JSON.parse(localStorage.getItem("tasks") || "[]");
    const taskIndex = tasks.findIndex((existingTask: { taskId: string | undefined; }) => existingTask.taskId === task?.taskId);
    if (taskIndex !== -1) {
      tasks[taskIndex] = taskData;
    }
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [date, priority, description, assignee, task]);

  const handleSelectionChange = (value: string) => {
    setPriority(value);
  };


  return (
    <>
      <TaskDeleteAlert isOpen={isOpen} onOpenChange={onOpenChange} taskId={task?.taskId}/>
      <Drawer backdrop="opaque" hideCloseButton isOpen={isOpenDrawer} onOpenChange={onOpenDrawerChange}>
        <DrawerContent>
          {(onClose) => (
            <>
              <DrawerHeader>
               <div className="flex justify-between items-center w-full border-b-1 border-dark50 p-1 px-2 pb-5" >
                 <div className="flex gap-2 items-center border-dark border-1 p-1 rounded-md text-sm">
                   <TickCircle
                     size="21"
                     color={Colors.Dark300}
                   />
                   <div>
                     Mark Completed
                   </div>
                 </div>
                 <div className="flex gap-4 items-center">
                   <Trash
                     onClick={onOpen}
                     size="23"
                     color={Colors.Dark300}
                   />
                   <ArrowRight
                     className="cursor-pointer"
                     onClick={onClose}
                     size="21"
                     color={Colors.Dark300}
                   />
                 </div>
               </div>
              </DrawerHeader>
              <DrawerBody>
                <div>
                  <div className="border-1 border-dark50 p-3 font-bold text-2xl rounded-md mb-5">
                    {task?.TaskName}
                  </div>
                  <div className="flex gap-14 items-center mb-5">
                    <div className="flex gap-2 items-center text-dark300 w-24 max-w-24">
                      <Record
                        size="20"
                        color={Colors.Dark300}
                      />
                      <span>Status</span>
                    </div>
                    <div className="font-bold">
                      {task?.status === 'inProgress' ? 'In Progress' : task?.status}
                    </div>
                  </div>

                  <div className="flex gap-14 items-center mb-5">
                    <div className="flex gap-2 items-center text-dark300 w-24 max-w-24">
                      <Calendar
                        size="20"
                        color={Colors.Dark300}
                      />
                      <span>Due Date</span>
                    </div>
                    <div >
                      <Popover>
                        <PopoverTrigger>
                          <div className="text-blue1">
                            {date ? (
                              <div className="flex items-center gap-2">
                                <div className="text-sm text-blue1 bg-blue2 p-1.5">
                                  {formatDateFromTimestamp(date)}
                                </div>
                                <div>
                                  <CloseCircle
                                    className="cursor-pointer"
                                    onClick={()=>setDate(undefined)}
                                    size="19"
                                    color={Colors.Dark300}
                                  />
                                </div>
                              </div>
                            ) : (
                              <div className="flex flex-row items-center gap-2">
                                <div className="rounded-full border-dashed border-dark border-1 p-1.5">
                                  <Calendar
                                    size="19"
                                    color={Colors.Dark300}
                                  />
                                </div>
                                <div className="text-dark300">No due date</div>
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

                  <div className="flex gap-14 items-center mb-5">
                    <div className="flex gap-2 items-center text-dark300 w-24 max-w-24">
                      <span>Assignee</span>
                    </div>
                    <div>
                      <Dropdown>
                        <DropdownTrigger>
                          <div>
                            {assignee ? (
                              <div className="flex flex-row items-center gap-2">
                                <Image src='/avatar.png' alt="..." width={31} height={30} className="rounded-full"/>
                                <CloseCircle
                                  className="cursor-pointer"
                                  onClick={() => setAssignee(undefined)}
                                  size="19"
                                  color={Colors.Dark300}
                                />
                              </div>
                            ) : (
                              <div className="flex flex-row items-center gap-2">
                                <div className="rounded-full border-dashed border-dark border-1 p-1.5">
                                  <User size="19" color={Colors.Dark300}/>
                                </div>
                                <div className="text-dark300">No due date</div>
                              </div>
                            )}
                          </div>
                        </DropdownTrigger>
                        <DropdownMenu
                          disallowEmptySelection
                          aria-label="Single selection example"
                          selectedKeys={assignee}
                          selectionMode="single"
                          variant="flat"
                          onSelectionChange={setAssignee}
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
                    </div>
                  </div>

                  <div className="flex gap-14 items-center mb-5">
                    <div className="flex gap-2 items-center text-dark300 w-24 max-w-24">
                      <Flag
                        size="20"
                        color={Colors.Dark300}
                      />
                      <span>Priority</span>
                    </div>
                    <div>

                      <Select
                        className="w-32"
                        onChange={(e) => handleSelectionChange(e.target.value)}
                        size={Priority.length}
                      >
                        {Priority.map((item) => (
                          <SelectItem className="text-black" key={item.id} value={item.name}>{item.name}</SelectItem>
                        ))}
                      </Select>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 mb-5">
                    <div className="flex gap-2 items-center text-dark300 w-24 max-w-24">
                      <Document
                        size="20"
                        color={Colors.Dark300}
                      />
                      <span>Description</span>
                    </div>
                    <div>
                      <Textarea
                        size={"lg"}
                        value={description}
                        onValueChange={setDescription}
                        labelPlacement="outside"
                        placeholder="Enter your description"
                        variant="bordered"
                      />
                    </div>
                  </div>


                </div>
              </DrawerBody>
            </>
          )}
        </DrawerContent>
      </Drawer>
    </>
  );
}