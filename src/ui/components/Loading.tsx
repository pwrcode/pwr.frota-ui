import { LoaderCircle } from 'lucide-react'

export default function Loading() {
  return (
    <div className="absolute z-50 left-0 right-0 top-0 bottom-0 p-4 flex flex-col gap-4 items-center justify-center text-3xl bg-background text-foreground">
      <LoaderCircle className="animate-spin size-12" />
      <p>Carregando</p>
    </div>
  )
}
