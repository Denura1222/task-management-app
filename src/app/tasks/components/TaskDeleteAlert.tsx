import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@nextui-org/react";
import {Task} from "@/app/tasks/page";
import { ToastContainer, toast } from 'react-toastify';

export default function TaskDeleteAlert({isOpen, onOpenChange,taskId}: {isOpen: boolean, onOpenChange: (isOpen: boolean) => void,taskId: string | undefined}) {

  const deleteTask =(onClose: () => void)=> {
    const storedTasks = localStorage.getItem('tasks');
    if(storedTasks) {
      const parsedTasks = JSON.parse(storedTasks) as Task[];
      const updatedTasks = parsedTasks.filter((task) => task.taskId !== taskId);
      localStorage.setItem('tasks', JSON.stringify(updatedTasks));
      toast('successfully deleted task');
      onClose()
      setTimeout(() => {
        window.location.reload();
      }, 3000)
    }
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
      <Modal size={"lg"} isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Are you sure you want to delete selected task?</ModalHeader>
              <ModalBody>
                This will permanently delete the selected task. These items will no longer be accessible to you. This action is irreversible.
              </ModalBody>
              <ModalFooter>
                <Button  variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button color="danger" onPress={()=>{deleteTask(onClose)}}>
                  Yes, delete
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}