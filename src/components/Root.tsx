import { PropsWithChildren } from "react";

export default function Root({ children }: PropsWithChildren) {
  return (
    <div className="fixed h-full w-full overflow-y-auto overflow-x-hidden bg-red-100 top-0 left-0 text-neutral-800">
      <div className="w-full max-w-site mx-auto p-4 flex flex-col gap-4">
        {children}
      </div>
    </div>
  )
}