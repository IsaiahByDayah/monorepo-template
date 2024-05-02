import { connectAuthEmulator, getAuth } from "firebase/auth"

import { app } from "./app"

export const auth = getAuth(app)

export const connectEmulator = () => {
  if (!auth.emulatorConfig) {
    connectAuthEmulator(auth, "http://127.0.0.1:9099", {
      disableWarnings: true,
    })
    console.info("[firebase]: Connected firebase emulators!")
  }
}
