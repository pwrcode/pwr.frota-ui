import { LoaderCircle } from 'lucide-react'

export default function ContentLoading() {
  return (
    <div className="flex flex-col gap-4 items-center justify-center h-full min-h-[400px] text-lg text-gray-600 dark:text-gray-300">
      <LoaderCircle className="animate-spin size-8" />
      <p>Carregando conteúdo...</p>
    </div>
  )
}