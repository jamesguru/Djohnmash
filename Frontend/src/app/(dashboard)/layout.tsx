"use client"

import Menu from "@/components/Menu";
import Navbar from "@/components/Navbar";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { useLayoutEffect } from "react";


export default function DashBoardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {


  useLayoutEffect(() =>{

    const storedUser = localStorage.getItem('user');
    console.log(storedUser)
    if(!storedUser){
      redirect("/sign-in")
    }
  }, [])


  return (
    <div className="h-screen flex">
      {/*LEFT*/}
      <div className="w-[14%] md:w-[8%] lg:w-[16%] xl:w-[14%]">
        <Link
          href="/"
          className="flex items-center justify-center lg:justify-start gap-2"
        >
          <Image src="/massage.png" alt="logo" width={50} height={50} />
          <span className="hidden lg:block font-bold">Djohnmash</span>
        </Link>
        <Menu />
      </div>
      {/*RIGHT*/}
      <div className="w-[86%] md:w-[92%] lg:w-[84%] xl:w-[86%] bg-[#F7F8FA] flex flex-col">
        <Navbar />
        {children}
      </div>
    </div>
  );
}
