import { Button } from "@repo/ui"

export default function Page(): JSX.Element {
  return (
    <main>
      <Button className="text-2xl text-purple-700" appName="test">
        Hello, World!
      </Button>
    </main>
  )
}
