import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

interface ModalAcessosInterface {
  openDialogFechar: boolean,
  setOpenDialogFechar: (s: boolean) => void,
  acesso: () => void
  texto: string
  cor: string
}

export default function AlertAcessos({openDialogFechar, setOpenDialogFechar, acesso, texto, cor}: ModalAcessosInterface) {
  return (
    <AlertDialog open={openDialogFechar} onOpenChange={setOpenDialogFechar}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{texto}</AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction className={`${cor}`} onClick={acesso}> Confirmar</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
