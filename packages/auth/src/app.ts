import { initializeApp } from "firebase/app"

// NOTE: https://firebase.google.com/docs/web/setup#add-sdks-initialize
const config = {
  apiKey: "{{apiKey}}",
  authDomain: "{{authDomain}}",
  projectId: "{{projectId}}",
  storageBucket: "{{storageBucket}}",
  messagingSenderId: "{{messagingSenderId}}",
  appId: "{{appId}}",
}

export const app = initializeApp(config)
