import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PrinterCheck, EllipsisVertical, Pencil, Trash, X, DollarSign, History, MapPin, LockOpen, Lock, Eye, Banknote, Check } from "lucide-react";

type functionVoid = (id: any) => void;

interface propsInterface {
  id: any,
  handleClickEditar?: functionVoid,
  handleClickVisualizar?: functionVoid,
  handleImpressoraCaixa?: functionVoid,
  handleClickFecharCaixa?: functionVoid,
  handleClickLancamento?: functionVoid,
  handleClickHistoricoCaixa?: functionVoid,
  handleClickRotas?: functionVoid,
  handleClickFecharPedido?: functionVoid,
  handleClickReabrirPedido?: functionVoid,
  handleClickFecharInventario?: functionVoid,
  handleClickReabrirInventario?: functionVoid,
  handleClickVerPermissao?: functionVoid,
  handleClickDarBaixa?: functionVoid,
  handleClickConciliar?: functionVoid,
  handleClickDesconciliar?: functionVoid,
  handleClickVerPeriodos?: functionVoid,
  handleClickVerParcelas?: functionVoid,
  handleClickDeletar?: functionVoid,
}

export default function DropDownMenuItem({
  id,
  handleClickEditar,
  handleClickVisualizar,
  handleImpressoraCaixa,
  handleClickFecharCaixa,
  handleClickLancamento,
  handleClickHistoricoCaixa,
  handleClickRotas,
  handleClickFecharPedido,
  handleClickReabrirPedido,
  handleClickFecharInventario,
  handleClickReabrirInventario,
  handleClickVerPermissao,
  handleClickDarBaixa,
  handleClickVerParcelas,
  handleClickConciliar,
  handleClickDesconciliar,
  handleClickVerPeriodos,
  handleClickDeletar
}: propsInterface) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild type="button">
        <Button variant="ghost" className="dark:bg-slate-800 dark:hover:bg-slate-700">
          <EllipsisVertical />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end">
        <DropdownMenuLabel>Ações</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {handleClickEditar && (
            <DropdownMenuItem onClick={() => handleClickEditar(id)}>
              <Pencil />
              <span>Editar</span>
            </DropdownMenuItem>
          )}
          {handleClickVisualizar && (
            <DropdownMenuItem onClick={() => handleClickVisualizar(id)}>
              <Eye />
              <span>Visualizar</span>
            </DropdownMenuItem>
          )}
          {handleImpressoraCaixa && (
            <DropdownMenuItem onClick={() => handleImpressoraCaixa(id)}>
              <PrinterCheck />
              <span>Definir impressora caixa</span>
            </DropdownMenuItem>
          )}
          {handleClickLancamento && (
            <DropdownMenuItem onClick={() => handleClickLancamento(id)}>
              <DollarSign />
              <span>Lançamento</span>
            </DropdownMenuItem>
          )}
          {handleClickFecharCaixa && (
            <DropdownMenuItem onClick={() => handleClickFecharCaixa(id)}>
              <X />
              <span>Fechar</span>
            </DropdownMenuItem>
          )}
          {handleClickHistoricoCaixa && (
            <DropdownMenuItem onClick={() => handleClickHistoricoCaixa(id)}>
              <History />
              <span>Historico</span>
            </DropdownMenuItem>
          )}
          {handleClickRotas && (
            <DropdownMenuItem onClick={() => handleClickRotas(id)}>
              <MapPin />
              <span>Rotas</span>
            </DropdownMenuItem>
          )}
          {handleClickFecharPedido && (
            <DropdownMenuItem onClick={() => handleClickFecharPedido(id)}>
              <Lock />
              <span>Fechar Pedido</span>
            </DropdownMenuItem>
          )}
          {handleClickReabrirPedido && (
            <DropdownMenuItem onClick={() => handleClickReabrirPedido(id)}>
              <LockOpen />
              <span>Reabrir Pedido</span>
            </DropdownMenuItem>
          )}
          {handleClickFecharInventario && (
            <DropdownMenuItem onClick={() => handleClickFecharInventario(id)}>
              <Lock />
              <span>Fechar Inventário</span>
            </DropdownMenuItem>
          )}
          {handleClickReabrirInventario && (
            <DropdownMenuItem onClick={() => handleClickReabrirInventario(id)}>
              <LockOpen />
              <span>Reabrir Inventário</span>
            </DropdownMenuItem>
          )}
          {handleClickVerPermissao && (
            <DropdownMenuItem onClick={() => handleClickVerPermissao(id)}>
              <Eye />
              <span>Ver Permissões</span>
            </DropdownMenuItem>
          )}
          {handleClickVerPeriodos && (
            <DropdownMenuItem onClick={() => handleClickVerPeriodos(id)}>
              <Eye />
              <span>Períodos da Meta</span>
            </DropdownMenuItem>
          )}
          {handleClickDarBaixa && (
            <DropdownMenuItem onClick={() => handleClickDarBaixa(id)}>
              <Banknote />
              <span>Dar baixa</span>
            </DropdownMenuItem>
          )}
          {handleClickVerParcelas && (
            <DropdownMenuItem onClick={() => handleClickVerParcelas(id)}>
              <Eye />
              <span>Ver parcelas</span>
            </DropdownMenuItem>
          )}
          {handleClickDesconciliar && (
            <DropdownMenuItem onClick={() => handleClickDesconciliar(id)}>
              <X />
              <span>Desconciliar</span>
            </DropdownMenuItem>
          )}
          {handleClickConciliar && (
            <DropdownMenuItem onClick={() => handleClickConciliar(id)}>
              <Check />
              <span>Conciliar</span>
            </DropdownMenuItem>
          )}
          {handleClickDeletar && (
            <DropdownMenuItem onClick={() => handleClickDeletar(id)}>
              <Trash />
              <span>Excluir</span>
            </DropdownMenuItem>
          )}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
