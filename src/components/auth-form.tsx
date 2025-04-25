import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"

export const AuthForm = () => {
  return (
    <div className="flex w-full flex-col gap-2">
      <Label htmlFor="email">Email</Label>
      <Input />
      <Button className="cursor-pointer">Continue</Button>
    </div>
  )
}
