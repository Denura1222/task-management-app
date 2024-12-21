import React from "react";
import Image from 'next/image'



export default function NavBar() {
  return (
    <div className="w-screen bg-white h-20 shadow-3xl p-2">
      <div className="flex items-center gap-2">
        <Image
          width={50}
          height={50}
          src="/logo.png" alt="logo" />
        <Image
          width={150}
          height={150}
          src="/logoName.png" alt="logo" />
      </div>

    </div>
  )
}
