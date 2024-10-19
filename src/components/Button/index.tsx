import classNames from "classnames";
import { ComponentProps } from "react";

export default function Button({ className, ...rest }: ComponentProps<'button'>) {
  return (
    <button
      {...rest}
      className={
        classNames(
          className || '',
          'bg-blue-900 p-4 text-white uppercase font-bold'
        )
      }
    />
  )
}