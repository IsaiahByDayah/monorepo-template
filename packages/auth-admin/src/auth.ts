import { getAuth } from "firebase-admin/auth"

import { app } from "./app"

export type { Auth } from "firebase-admin/auth"

export const auth = getAuth(app)
