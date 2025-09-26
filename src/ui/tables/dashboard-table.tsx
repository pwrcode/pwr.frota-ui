import type { dashboardTabelaType } from '@/services/dashboard'
import { TableTop } from '../components/tables/TableTop'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useMobile } from '@/hooks/useMobile'
import { CarFront } from 'lucide-react'
import { currency } from '@/services/currency'
import TableLoading from '../components/tables/TableLoading'
import TableEmpty from '../components/tables/TableEmpty'
import { cn } from '@/lib/utils'

type Props = {
    titulo: string,
    lista: Array<dashboardTabelaType>,
    loading?: boolean
}

function DashboardTable({ titulo, lista, loading }: Props) {
    const { isMobile, rowStyle, cellStyle } = useMobile();

    return (
        <div className={`flex flex-col gap-8`}>
            {(lista.length > 0) && (
                <div className="bg-card dark:bg-card py-1 px-4 rounded-md shadow-md dark:border">
                    <TableTop className='px-0' title={titulo} icon={CarFront}>
                    </TableTop>
                    <hr />
                    <Table>
                        <TableHeader>
                            <TableRow className="hidden sm:table-row">
                                <TableHead className='w-80'>Veículo</TableHead>
                                <TableHead className='w-80 text-center'>Quantidade</TableHead>
                                <TableHead className='w-80 text-center'>Litros</TableHead>
                                <TableHead className='w-80 text-right'>Valor Total</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody className='px-4'>
                            {lista.map((c, index) => {
                                return (
                                    <TableRow key={c.descricao + "_" + index} className={cn(rowStyle)}>
                                        <TableCell className={cn(cellStyle, "sm:text-left")}>
                                            {isMobile && "Descrição: "}{c.descricao}
                                        </TableCell>

                                        <TableCell className={cn(cellStyle, "sm:text-center")}>
                                            {isMobile && "Quantidade: "}{c.quantidade.toLocaleString()}
                                        </TableCell>

                                        <TableCell className={cn(cellStyle, "sm:text-center")}>
                                            {isMobile && "Litros: "}{c.litros.toLocaleString()}
                                        </TableCell>

                                        <TableCell className={cn(cellStyle, "sm:text-right")}>
                                            {isMobile && "Valor Total: "}{currency(c.valorTotal)}
                                        </TableCell>
                                    </TableRow>
                                )
                            })}
                        </TableBody>
                    </Table>
                </div>
            )}

            {lista.length === 0 && <>
                {loading ? (
                    <TableLoading />
                ) : (
                    <TableEmpty py='py-20' title={`Nenhum ${titulo} Encontrado`} icon="import" />
                )}
            </>}
        </div>
    )
}

export default DashboardTable