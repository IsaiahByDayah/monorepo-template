import { goodbye } from "@repo/external-template"
import { hello } from "@repo/internal-template"
import { getName } from "@repo/internal-template/name"
import { Button } from "@repo/ui"

const Page = () => {
  console.info(hello())
  console.info(hello(getName()))
  console.info(goodbye())

  return (
    <main>
      <Button className="text-2xl text-purple-700" appName="test">
        Hello, World!
      </Button>
    </main>
  )
}

export default Page
