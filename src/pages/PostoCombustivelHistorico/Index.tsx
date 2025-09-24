import { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import TableLoading from '@/ui/components/tables/TableLoading';
import TableEmpty from '@/ui/components/tables/TableEmpty';
import { toast } from 'react-toastify';
import { errorMsg } from '@/services/api';
import { getPostoCombustivelHistorico } from '@/services/postoCombustivel';
import { TableTop } from '@/ui/components/tables/TableTop';
import type { dadosHistoricoPostoCombustivelTanqueType } from '@/services/postoCombustivelTanque';
import { formatarData } from '@/services/date';
import { useMobile } from '@/hooks/useMobile';

export default function PostoCombustivelHistorico({ idPostoCombustivel }: { idPostoCombustivel?: number }) {
    const { isMobile, rowStyle, cellStyle } = useMobile();
    const [loading, setLoading] = useState<boolean>(false);

    const [listaHistorico, setListaHistorico] = useState<Array<dadosHistoricoPostoCombustivelTanqueType>>([]);

    useEffect(() => {
        setListaHistorico([]);
        if (!open) return
        if (idPostoCombustivel && idPostoCombustivel >= 0) carregaHistorico();
    }, [idPostoCombustivel, open]);

    const carregaHistorico = async () => {
        const process = toast.loading("Carregando...");
        setLoading(true);
        try {
            const data = await getPostoCombustivelHistorico(idPostoCombustivel || 0);
            console.log(data)
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
        <div className={`flex flex-col gap-8`}>
            {(listaHistorico.length > 0) && (
                <div className="bg-card dark:bg-card py-1 rounded-md shadow-md dark:border">
                    <TableTop title='Histórico do Posto'>
                    </TableTop>
                    <hr />
                    <Table>
                        <TableHeader>
                            <TableRow className="hidden sm:table-row">
                                <TableHead className='w-80'>Descrição</TableHead>
                                <TableHead className='w-80'>Tanque</TableHead>
                                <TableHead className='w-80'>Produto Abastecimento</TableHead>
                                <TableHead className='w-80'>Data</TableHead>
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
                                            {isMobile && "Tanque: "}{c.descricaoTanque}
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
                </div>
            )}

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
    )
}