import { LoaderCircle } from 'lucide-react';

interface propsType {
  iconSize?: string,
}

export default function TableLoading({iconSize}: propsType) {
  return (
    <div className="flex flex-1 items-center justify-center rounded-lg border h-full py-36 border-dashed shadow-sm" x-chunk="dashboard-02-chunk-1">
      <div className="flex flex-col items-center gap-1 text-center">

        <div className="flex flex-row gap-3 text-gray-500">
          <LoaderCircle className={`
            animate-spin ${iconSize ?? "size-9"} dark:text-white
          `} />
        </div>

      </div>
    </div>
  )
}
