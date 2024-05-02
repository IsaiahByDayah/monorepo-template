import { applicationDefault, initializeApp } from "firebase-admin/app"

export { type App } from "firebase-admin/app"

export const app = initializeApp({
  credential: applicationDefault(),
})
