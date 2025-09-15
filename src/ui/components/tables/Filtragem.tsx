import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { useState } from "react"
import ModalFormFooter from "../forms/ModalFormFooter"
import { Button } from "@/components/ui/button"
import ModalFormBody from "../forms/ModalFormBody"

type props = {
  loading?: boolean,
  children: React.ReactNode,
  func: () => void
}
export const Filtragem = ({loading, children, func}: props) => {

  const [open, setOpen] = useState<boolean>(false);

  const filtrar = () => {
    if (func) func();
    setOpen(false);
  }

  return (
    <>
      <Button variant="outline" onClick={() => setOpen(true)}>Filtragem</Button>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent className='p-0 gap-0 m-4 h-[96%] rounded-lg border shadow-xl'>
          <div className="flex flex-col h-full">
            <SheetHeader className='p-6 rounded-t-lg border-b'>
              <SheetTitle>Filtragem</SheetTitle>
            </SheetHeader>
            <ModalFormBody>
              {children}
            </ModalFormBody>
            <ModalFormFooter>
              <Button variant="outline" type="button" onClick={() => setOpen(false)} disabled={loading}>Cancelar</Button>
              <Button type="button" variant="success" onClick={filtrar}>Filtrar</Button>
            </ModalFormFooter>
          </div>
        </SheetContent>
      </Sheet>
    </>
  )
}