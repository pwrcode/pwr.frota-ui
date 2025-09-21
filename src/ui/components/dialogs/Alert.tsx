import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog';

enum AlertEnum {
  destructive = "bg-red-600 hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700",
  success = "bg-green-600 hover:bg-green-700 dark:bg-green-600 dark:hover:bg-green-700"
}

interface AlertInterface {
  openDialog: boolean,
  setOpenDialog: React.Dispatch<React.SetStateAction<boolean>>,
  func: () => void,
  title?: string,
  subtitle?: string,
  buttonText?: string,
  alertType?: AlertEnum
}

export const Alert = ({openDialog, setOpenDialog, func, title, subtitle, buttonText, alertType}: AlertInterface) => {
  return (
    <AlertDialog open={openDialog} onOpenChange={setOpenDialog}>
      <AlertDialogContent className='dark:bg-accent'>
        <AlertDialogHeader>
          <AlertDialogTitle className='dark:text-foreground'>
            {title ?? "Confirmar essa ação?"}
          </AlertDialogTitle>
          {subtitle && (
            <AlertDialogDescription className='dark:text-gray-200'>
              {subtitle}
            </AlertDialogDescription>
          )}
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>

          <AlertDialogAction
            className={(alertType ?? AlertEnum.destructive) + " dark:text-foreground"}
            onClick={func}
            type="button"
          >
            {buttonText ?? "Confirmar"}
          </AlertDialogAction>

        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export const AlertExcluir = ({openDialog, setOpenDialog, func}: AlertInterface) => {
  return (
    <Alert
      openDialog={openDialog}
      setOpenDialog={setOpenDialog}
      func={func}
      title="Você realmente deseja excluir esse item?"
      subtitle="Essa ação não pode ser desfeita"
      buttonText='Excluir'
      alertType={AlertEnum.destructive}
    />
  )
}