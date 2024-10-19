import classNames from "classnames";
import { ComponentProps } from "react";

export default function Layout({ className, children }: ComponentProps<'main'>) {
  return (
    <main
      className={
        classNames(
          "p-4",
          className || ''
        )
      }
    >
      {children}
    </main>
  )
}