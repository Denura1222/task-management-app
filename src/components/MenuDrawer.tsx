import Link from "next/link";
import React from "react";
import {TaskSquare} from "iconsax-react";
import {Colors} from "@/constants/colors";

export default function MenuDrawer() {

  const menuItems= [
    {name:"Tasks",route:"tasks" },
  ]

  return (
    <div className="w-52 h-screen flex flex-col bg-white p-4">
      {menuItems.map(menuItem => (
        <Link href={`/${menuItem.route}`} key={menuItem.name}  className="flex items-center gap-2 mt-3 text-black bg-light1 p-2 rounded-md">
          <TaskSquare
            size="25"
            color={Colors.Dark400}
          />
          <div className="text-lg text-dark400">{menuItem.name}</div>
        </Link>
      ))}
    </div>
  )

}

