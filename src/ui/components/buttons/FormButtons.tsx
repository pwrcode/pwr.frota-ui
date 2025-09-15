import { Button } from "@/components/ui/button";
import { LoaderCircle, Search } from "lucide-react";

type propsType = {
  children: React.ReactNode, type?: string, className?: string, loading?: boolean, disabled?: boolean
}

export const ButtonSubmit = ({children, type, className, loading, disabled}: propsType) => {
  const btnLoading = loading ? "flex flex-row items-center justify-center gap-2" : "";
  return (
    <Button
      variant="success"
      type={type === "button" ? "button" : "submit"}
      className={`${className} ${btnLoading}`}
      disabled={disabled || loading}
    >
      {loading && <LoaderCircle className="animate-spin size-10" />}
      {children ?? "Salvar"}
    </Button>
  )
}

// ==============

type propsSearchype = {
  func: () => void,
  disabled: boolean
}

export const SearchButton = ({func, disabled}: propsSearchype) => {
  return (
    <Button variant="blue" type="button" className="size-[40px]" onClick={func} disabled={disabled}>
      <Search />
    </Button>
  )
}

// ==============

type functionButtonParamsType = {
  children?: React.ReactNode,
  title?: string,
  style?: string,
  disabled?: boolean,
  func: any
};

export const FunctionButton = ({children, title, style, disabled, func}: functionButtonParamsType) => {
  return (
    <Button variant="blue" className={style ?? "size-[40px]"} type="button" onClick={func} disabled={disabled}>
      {title && <>{title}</>}
      {children && <>{children}</>}
    </Button>
  )
}