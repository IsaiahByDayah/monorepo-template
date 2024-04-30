import { getName } from "./name.js"

// export const hello = (name?: string) => `Hello, ${name ?? "World"}!`
export const hello = (name?: string) => `Hello, ${name ?? getName()}!`
