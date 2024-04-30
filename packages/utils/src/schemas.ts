import { z } from "zod"

export const passwordSchema = z.string().min(6)

export const usernameSchema = z
  .string()
  .trim()
  .min(3)
  .max(16)
  .toLowerCase()
  .regex(/^[a-zA-Z0-9_]+$/, {
    message:
      "Usernames can only contain letters (a-z), numbers (0-9), and underscores (_).",
  })

export const nameSchema = z.string().min(1)

export const emailSchema = z.string().email()

export const emailAndPasswordSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
})
