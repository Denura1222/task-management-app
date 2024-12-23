// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
'use client'
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  useDisclosure,
  Popover,
  PopoverTrigger,
  PopoverContent, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Select, SelectItem, DrawerFooter, Button,
} from "@nextui-org/react";
import React, {useEffect} from "react";
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
import {useForm} from "react-hook-form";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {taskSchema} from "@/app/tasks/components/createTask";
import useTaskStore from "@/app/store/store";
import {toast, ToastContainer} from "react-toastify";

export default function TaskDrawer({isOpenDrawer, action,taskId,taskStage}: {taskId:string,isOpenDrawer: boolean, action: (isOpen: boolean) => void,taskStage:'todo' | 'inProgress' | 'completed'}) {
  const Tasks = useTaskStore((state) => state.tasks);

  const {isOpen, onOpen, onOpenChange} = useDisclosure();

  const {
    setValue,
    getValues,
    watch
  } = useForm<z.infer<typeof taskSchema>>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      taskId: taskId,
      status: taskStage,
    },
  })

  useEffect(() => {
    const tasks = Tasks[taskStage]

    const task = tasks.find(i=>i.taskId === taskId)

    if(task) {
      setValue('TaskName', task?.TaskName)
      setValue('status', task?.status);
      setValue('description', task?.description)
      setValue('priority', task?.priority)
      setValue('dueDate', task?.dueDate)
      setValue('assigneeId', task?.assigneeId)
    }
    
  }, [Tasks, setValue, taskId, taskStage]);


  const watchedFields = watch();

  const Submit = (onClose: () => void) => {
    const updatedTasks = {
      ...Tasks,
      [getValues('status')]: Tasks[getValues('status')]?.map((t) =>
        t.taskId === getValues('taskId') ? { ...t, ...watchedFields } : t
      ),
    };
    const tasksToSave = {
      state: { tasks: updatedTasks },
    };
    localStorage.setItem('task-store', JSON.stringify(tasksToSave));
    toast('Task Updated Successfully');
    setTimeout(() => {
      window.location.reload();
    }, 1300)
    onClose()
  }


  return (
    <>
      <ToastContainer
        position="top-center"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <TaskDeleteAlert isOpen={isOpen} onOpenChange={onOpenChange} taskId={taskId}/>
      <Drawer className="z-50" backdrop="opaque" hideCloseButton isOpen={isOpenDrawer} onOpenChange={action}>
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
                    {getValues('TaskName')}
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
                      {getValues('status') === 'inProgress' ? 'In Progress' : getValues('status')}
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
                            {watch('dueDate') ? (
                              <div className="flex items-center gap-2">
                                <div className="text-sm text-blue1 bg-blue2 p-1.5">
                                  {formatDateFromTimestamp(getValues('dueDate'))}
                                </div>
                                <div>
                                  <CloseCircle
                                    className="cursor-pointer"
                                    onClick={()=>setValue('dueDate',0)}
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
                            selected={getValues('dueDate')}
                            onSelect={(date) => setValue("dueDate", date)}
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
                            {watch('assigneeId') ? (
                              <div className="flex flex-row items-center gap-2">
                                <Image src='/avatar.png' alt="..." width={31} height={30} className="rounded-full"/>
                                <CloseCircle
                                  className="cursor-pointer"
                                  onClick={() => setValue('assigneeId','')}
                                  size="19"
                                  color={Colors.Dark300}
                                />
                              </div>
                            ) : (
                              <div className="flex flex-row items-center gap-2">
                                <div className="rounded-full border-dashed border-dark border-1 p-1.5">
                                  <User size="19" color={Colors.Dark300}/>
                                </div>
                                <div className="text-dark300">No assignee</div>
                              </div>
                            )}
                          </div>
                        </DropdownTrigger>
                        <DropdownMenu
                          disallowEmptySelection
                          aria-label="Single selection example"
                          selectionMode="single"
                          variant="flat"
                          selectedKeys={watch("assigneeId")}
                          onSelectionChange={(key) => setValue("assigneeId", key.anchorKey)}
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
                        defaultSelectedKeys={[watch("priority")]}
                        onChange={(e) => setValue("priority", e.target.value as "Low" | "Medium" | "High" )}
                        className="w-32"
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
                        value={watch("description")}
                        onChange={(e) => setValue("description", e.target.value)}
                        labelPlacement="outside"
                        placeholder="Enter your description"
                        variant="bordered"
                      />
                    </div>
                  </div>
                </div>
              </DrawerBody>
              <DrawerFooter>
                <Button color="primary" onPress={()=>Submit(onClose)}>
                  Update
                </Button>
              </DrawerFooter>
            </>
          )}
        </DrawerContent>
      </Drawer>
    </>
  );
}