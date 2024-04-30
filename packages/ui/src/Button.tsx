"use client"

import { clsx } from "clsx"
import { type ReactNode } from "react"

interface ButtonProps {
  children: ReactNode
  className?: string
  appName: string
}

export const Button = ({ children, className, appName }: ButtonProps) => {
  return (
    <button
      className={clsx("ui-text-blue-500", className)}
      onClick={() => {
        console.info(`Hello from your ${appName} app!`)
      }}
      type="button"
    >
      {children}
    </button>
  )
}
