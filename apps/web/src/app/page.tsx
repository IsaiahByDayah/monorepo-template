import { Counter } from "./Counter"
import { HelloWorld } from "./HelloWorld"

const Page = () => {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-10 p-24">
      <HelloWorld />
      <Counter />
    </main>
  )
}

export default Page
