import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

type propsAddType = {
  children?: React.ReactNode,
  func: () => void,
  loading?: boolean,
  style?: string
}

export const PlusButton = ({children, func, loading, style}: propsAddType) => {
  return (
    <Button className={`size-[40px] ${style ?? ""}`} type="button" variant="success" onClick={func} disabled={loading}>
      {children ? <>{children}</> : <Plus />}
    </Button>
  )
}