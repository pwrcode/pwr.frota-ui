import { Button } from '@/components/ui/button';
import { Building2 } from 'lucide-react';
import { renderIcon } from '../RenderIcon';

interface EmptyStateInterface {
  handleClickAdicionar?: () => void,
  title?: string,
  subTitle?: string,
  empresaEmpty?: boolean,
  icon?: string,
  children?: React.ReactNode,
  py?: string
}

const Title = ({children}: {children: React.ReactNode}) => {
  return (
    <span className="text-xl text-gray-500 font-medium tracking-tight dark:text-foreground">{children}</span>
  )
}

export default function TableEmpty({handleClickAdicionar, title, subTitle, empresaEmpty, icon, children, py}: EmptyStateInterface) {
  return (
    <div
      className={`flex flex-1 items-center justify-center rounded-lg border h-full border-dashed shadow-sm dark:border dark:shadow-sm ${py}`}
      x-chunk="dashboard-02-chunk-1"
    >
      <div className="flex flex-col items-center gap-2 text-center dark:text-foreground">

        {(!title && !subTitle && !children && !empresaEmpty && !icon) && (
          <Title>
            Nenhum resultado
          </Title>
        )}

        {(title && !children&& !icon) && (
          <Title>
            {title}
          </Title>
        )}

        {subTitle && (
          <span className="text-sm text-muted-foreground">
            {handleClickAdicionar ? (
              <>Clique no botão abaixo para adicionar um novo item</>
            ) : (
              <>{subTitle}</>
            )}
          </span>
        )}

        {!children && !icon && handleClickAdicionar && (
          <Button type='button' variant="success" onClick={handleClickAdicionar} className="mt-4">Adicionar</Button>
        )}

        {children && (
          <div className="flex flex-row gap-2">
            {children}
          </div>
        )}

        {empresaEmpty && (
          <div className="flex flex-row gap-2">
            <div className="flex flex-col items-center gap-2">
                <Building2 className="size-16 text-gray-500" />
                <Title>Selecione a empresa</Title>
              </div>
          </div>
        )}

        {icon && (
          <div className="flex flex-row gap-2">
            <div className="flex flex-col items-center gap-2">
                {renderIcon(icon, "size-12 text-gray-500 dark:text-foreground")}
                <Title>
                  {title ? title : "Nenhum resultado"}
                </Title>
                {subTitle && (
                  <span className="text-sm text-muted-foreground">{subTitle}</span>
                )}
                {handleClickAdicionar && (
                  <Button type='button' variant="success" onClick={handleClickAdicionar} className="mt-2">Adicionar</Button>
                )}
              </div>
          </div>
        )}

      </div>
    </div>
  )
}