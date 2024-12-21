'use client'

import {Button} from "@nextui-org/react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <div className="">
      <Button color="primary" onPress={()=>router.push("/tasks")}>Navigate to task page</Button>
    </div>
  );
}
