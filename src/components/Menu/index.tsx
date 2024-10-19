"use client";

import classNames from "classnames";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { PropsWithChildren } from "react";

function MenuLink({ href, index, children }: { href: string, index: number } & PropsWithChildren) {
  const pathname = usePathname()
  return (
    <Link 
      href={href} 
      tabIndex={index} 
      className={
        classNames(
          "uppercase font-bold p-4 px-8 tracking-wider select-none shrink-0 transition-all duration-300 hover:bg-nbalight hover:text-white focus:bg-nbalight focus:text-white",
          {
            'bg-nbalight text-white': pathname === href
          }
        )
      } 
      draggable={false}
    >
      {children}
    </Link>
  )
}

export default function Menu() {
  return (
    <div
      className="flex justify-center w-full bg-white print:hidden"
    >
      <nav
        className="flex justify-start overflow-x-auto overflow-y-hidden"
      >
        <MenuLink index={0} href='/'>Home</MenuLink>
        <MenuLink index={1} href='/about-norfolk-badminton'>About</MenuLink>
        <MenuLink index={2} href='/clubs'>Clubs</MenuLink>
        <MenuLink index={3} href='/downloads'>Downloads</MenuLink>
        <MenuLink index={4} href='/child-protection'>Child Protection</MenuLink>
      </nav>
    </div>
  )
}