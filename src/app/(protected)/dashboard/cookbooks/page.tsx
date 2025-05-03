import { SimpleUpload } from "@/components/simple-upload"

export default function CookbooksPage() {
  return (
    <div className="flex h-screen w-full flex-col p-4">
      <div className="flex flex-col gap-6" id="__canvas-push-element">
        <div>Cookbooks</div>

        <SimpleUpload onChangeFiles={() => {}} />
      </div>
    </div>
  )
}
