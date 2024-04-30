import { clsx } from "clsx"
import { type ButtonHTMLAttributes } from "react"

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>

export const Button = ({ className, ...rest }: ButtonProps) => (
  <button
    className={clsx("ui-rounded ui-border ui-px-5 ui-py-4", className)}
    type="button"
    {...rest}
  />
)
