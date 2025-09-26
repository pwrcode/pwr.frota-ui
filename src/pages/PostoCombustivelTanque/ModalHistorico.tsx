import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { errorMsg } from '@/services/api';
import { getPostoCombustivelTanqueHistorico, type dadosHistoricoPostoCombustivelTanqueType } from '@/services/postoCombustivelTanque';
import { Dialog, DialogContent, DialogHeader } from '@/components/ui/dialog';
import { DialogDescription, DialogTitle } from '@radix-ui/react-dialog';
import { cn } from '@/lib/utils';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatarData } from '@/services/date';
import { useMobile } from '@/hooks/useMobile';
import TableLoading from '@/ui/components/tables/TableLoading';
import TableEmpty from '@/ui/components/tables/TableEmpty';

type modalPropsType = {
    open: boolean,
    setOpen: React.Dispatch<React.SetStateAction<boolean>>,
    id: number
}

export default function ModalHistorico({ open, setOpen, id }: modalPropsType) {
    const { isMobile, rowStyle, cellStyle } = useMobile();
    const [loading, setLoading] = useState(false);
    const [listaHistorico, setListaHistorico] = useState<Array<dadosHistoricoPostoCombustivelTanqueType>>([]);

    useEffect(() => {
        setListaHistorico([]);
        if (!open) return
        if (id >= 0) carregaHistorico();
    }, [id, open]);

    const carregaHistorico = async () => {
        const process = toast.loading("Carregando...");
        setLoading(true);
        try {
            const data = await getPostoCombustivelTanqueHistorico(id);
            setListaHistorico(data);
            toast.dismiss(process);
        }
        catch (error: Error | any) {
            toast.update(process, { render: errorMsg(error, null), type: "error", isLoading: false, autoClose: 2000 });
        }
        finally {
            setLoading(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen} >
            <DialogHeader className="sr-only">
                <DialogTitle>"Histórico de Abastecimentos e Entradas</DialogTitle>
                <DialogDescription>Exibe o histórico de abastecimentos e entradas do tanque selecionado</DialogDescription>
            </DialogHeader>
            <DialogContent
                className={cn("overflow-hidden p-0 sm:!max-w-3xl")}
                showCloseButton
            >
                <div className="bg-card dark:bg-card py-1 rounded-md shadow-md dark:border">

                    {listaHistorico?.length !== 0 && <>
                        <TableHead>
                            Histórico do Tanque #{id}
                        </TableHead>
                        <hr />
                        <Table>
                            <TableHeader>
                                <TableRow className="hidden sm:table-row">
                                    <TableHead className='w-80'>Descrição</TableHead>
                                    <TableHead className='w-80'>Produto Abastecimento</TableHead>
                                    <TableHead className='w-80'>Data</TableHead>
                                    <TableHead></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {listaHistorico.map((c, index) => {
                                    return (
                                        <TableRow key={c.descricao + "_" + index} className={rowStyle}>
                                            <TableCell className={cellStyle + "sm:text-left whitespace-nowrap"}>
                                                {c.descricao}
                                            </TableCell>

                                            <TableCell className={cellStyle + "sm:text-left"}>
                                                {isMobile && "Produto Abastecimento: "}{c.descricaoProdutoAbastecimento}
                                            </TableCell>

                                            <TableCell className={cellStyle + "sm:text-left"}>
                                                {isMobile && "Data: "}{formatarData(c.data, "dd/mm/yyyy hh:mm")}
                                            </TableCell>
                                        </TableRow>
                                    )
                                })}
                            </TableBody>
                        </Table>
                    </>}

                    {listaHistorico?.length === 0 && <>
                        {loading ? (
                            <TableLoading />
                        ) : (
                            <div className='bg-gray-100 dark:bg-muted border-dashed border-[2px] border-gray-300 rounded-md shadow-md'>
                                <TableEmpty py='py-20' title='Nenhum tanque encontrado' icon="search-x" />
                            </div>
                        )}
                    </>}
                </div>
            </DialogContent>
        </Dialog>
    )
}