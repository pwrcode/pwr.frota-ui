import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Totalizador, { type statusType } from "@/components/ui/totalizador";
import { useDebounce } from "@/hooks/useDebounce";
import { getDashboardEstoqueTanque, getDashboardTotalizadores, getDashboardVeiculoPorTipo, type dashboardFiltrosEntradaType, type dashboardTanqueType, type totalizadorType } from "@/services/dashboard";
import { Building2, CarFront, ChevronDown, ChevronUp, Fuel } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { TableBody, TableCell, TableHead, TableHeader, TableRow, Table } from "@/components/ui/table";
import { useMobile } from "@/hooks/useMobile";
import TableLoading from "@/ui/components/tables/TableLoading";
import TableEmpty from "@/ui/components/tables/TableEmpty";
import { TableTop } from "@/ui/components/tables/TableTop";
import DashboardAbastecimento from "../DashboardAbastecimento/Index";
import { Filters, FiltersGrid } from "@/ui/components/Filters";
import SelectPostoCombustivel from "@/ui/selects/PostoCombustivelSelect";
import SelectProdutoAbastecimento from "@/ui/selects/ProdutoAbastecimentoSelect";
import InputDataControl from "@/ui/components/forms/InputDataControl";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { firstDayOfMonth } from "@/services/date";

const schema = z.object({
	idPostoCombustivel: z.object({
		label: z.string().optional(),
		value: z.number().optional()
	}).optional(),
	idProdutoAbastecimento: z.object({
		label: z.string().optional(),
		value: z.number().optional()
	}).optional(),
	dataInicio: z.string().optional(),
	dataFim: z.string().optional(),
})

export default function Dashboard() {
	const { isMobile, rowStyle, cellStyle } = useMobile();

	const { getValues, watch, control } = useForm({
		resolver: zodResolver(schema),
		defaultValues: {
			dataInicio: new Date(firstDayOfMonth()).toISOString(),
			dataFim: new Date().toISOString(),
			idPostoCombustivel: undefined,
			idProdutoAbastecimento: undefined,
		}
	});

	const [loading, setLoading] = useState(true);
	const [isDropDownTabsOpen, setIsDropDownTabsOpen] = useState(false);
	const [tabNameMobile, setTabNameMobile] = useState("Geral");

	const [totalizadores, setTotalizadores] = useState<Array<totalizadorType>>([]);
	const [veiculoPorTipo, setVeiculoPorTipo] = useState<Array<totalizadorType>>([]);
	const [estoquePorTanque, setEstoquePorTanque] = useState<Array<dashboardTanqueType>>([]);

	useEffect(() => {
		getDadosDashboard();
	}, []);

	useEffect(() => {
		const subscription = watch(() => {
			getDadosDashboard();
		});

		return () => subscription.unsubscribe();
	}, [watch])

	const getDadosDashboard = useDebounce(async () => {
		setLoading(true);
		const process = toast.loading("Carregando Dados...");

		const dadosform = getValues() as dashboardFiltrosEntradaType;
		const filtros = {
			dataInicio: dadosform.dataInicio,
			dataFim: dadosform.dataFim,
			idVeiculo: (dadosform.idVeiculo as any)?.value,
			idPostoCombustivel: (dadosform.idPostoCombustivel as any)?.value,
			idProdutoAbastecimento: (dadosform.idProdutoAbastecimento as any)?.value,
		}


		await Promise.all([
			getTotalizadores(),
			getVeiculoPorTipo(),
			getDadosEstoqueTanque(filtros),
		]);

		toast.dismiss(process);
		setLoading(false);
	}, 500);

	const getTotalizadores = async () => {
		setTotalizadores([]);
		try {
			const data = await getDashboardTotalizadores();
			setTotalizadores(data);
		} catch (err) { }
	}

	const getVeiculoPorTipo = async () => {
		try {
			const data = await getDashboardVeiculoPorTipo();
			setVeiculoPorTipo(data);
		} catch (err) { }
	}

	const getDadosEstoqueTanque = async (filtros: dashboardFiltrosEntradaType) => {
		try {
			const data = await getDashboardEstoqueTanque(filtros);
			setEstoquePorTanque(data);
		} catch (err) { }
	}

	function getStatusTotalizador(index: number) {
		const status: Array<statusType> = ["success", "error", "warning", "default"];
		return status[index % status.length];
	}

	return (
		<div className="flex flex-col gap-8 min-h-[calc(100%-4rem)]">
			<Tabs defaultValue='geral' className='w-full mt-16 flex flex-col gap-2'>
				<TabsList className='w-fit h-min hidden md:flex justify-start gap-1 p-1 bg-muted rounded-lg'>
					<TabsTrigger
						value='geral'
						onClick={() => setTabNameMobile("Geral")}
						className='cursor-pointer flex items-center gap-2 px-4 py-2.5 rounded-md transition-all duration-200 data-[state=active]:bg-orange-500 data-[state=active]:text-white hover:bg-orange-50 hover:text-orange-600'
					>
						<Building2 size={16} />
						Geral
					</TabsTrigger>
					<TabsTrigger
						value='abastecimento'
						onClick={() => setTabNameMobile("Abastecimento")}
						className='cursor-pointer flex items-center gap-2 px-4 py-2.5 rounded-md transition-all duration-200 data-[state=active]:bg-orange-500 data-[state=active]:text-white hover:bg-orange-50 hover:text-orange-600'
					>
						<Building2 size={16} />
						Abastecimento
					</TabsTrigger>
				</TabsList>

				<DropdownMenu onOpenChange={(open) => setIsDropDownTabsOpen(open)} open={isDropDownTabsOpen}>
					<TabsList className='flex w-full px-1 py-1 md:hidden bg-muted rounded-lg'>
						<DropdownMenuTrigger asChild>
							<Button variant={"ghost"} className='w-full text-foreground flex justify-between items-center gap-2 py-3 px-4 hover:bg-orange-50 hover:text-orange-600'>
								<div className='flex items-center gap-2'>
									{tabNameMobile === "Geral" && <Building2 size={16} />}
									{tabNameMobile === "Abastecimentos" && <Fuel size={16} />}
									{tabNameMobile}
								</div>
								{<div className='ml-4'>{isDropDownTabsOpen ? <ChevronUp /> : <ChevronDown />}</div>}
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent className='md:hidden w-64 p-1'>
							<DropdownMenuItem className='p-0'>
								<TabsTrigger
									value='geral'
									onClick={() => setTabNameMobile("Geral")}
									className='w-full justify-start flex items-center gap-2 py-3 px-3 rounded-md transition-all duration-200 data-[state=active]:bg-orange-500 data-[state=active]:text-white hover:bg-orange-50 hover:text-orange-600'
								>
									<Building2 size={16} />
									Geral
								</TabsTrigger>
							</DropdownMenuItem>

							<DropdownMenuItem className='p-0'>
								<TabsTrigger
									value='abastecimento'
									onClick={() => setTabNameMobile("Abastecimento")}
									className='w-full justify-start flex items-center gap-2 py-3 px-3 rounded-md transition-all duration-200 data-[state=active]:bg-orange-500 data-[state=active]:text-white hover:bg-orange-50 hover:text-orange-600'
								>
									<Building2 size={16} />
									Abastecimento
								</TabsTrigger>
							</DropdownMenuItem>
						</DropdownMenuContent>
					</TabsList>
				</DropdownMenu>

				<TabsContent value="geral">
					<div className="grid grid-cols-1 mb-16 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4">
						{totalizadores.length ? (
							totalizadores.map((x, index) => <Totalizador
								key={x.descricao}
								status={getStatusTotalizador(index)}
								{...x}
							/>)
						) : (
							new Array(4).fill(0).map((_, index) => <Totalizador
								key={"loading_" + index}
								descricao=""
								valor={0}
								loading
							/>)
						)}

						<div className={`flex flex-col gap-8 col-span-1 sm:col-span-2 lg:col-span-3 2xl:col-span-4`}>
							<div className={`flex flex-col gap-8`}>
								{(veiculoPorTipo.length > 0) && (
									<div className="bg-card dark:bg-card py-1 rounded-md shadow-md dark:border">
										<TableTop title="Veículo por Tipo" icon={CarFront}>
										</TableTop>
										<hr />
										<Table>
											<TableHeader>
												<TableRow className="hidden sm:table-row">
													<TableHead className='w-80'>Veículo</TableHead>
													<TableHead className='w-80 text-center'>Quantidade</TableHead>
													<TableHead></TableHead>
												</TableRow>
											</TableHeader>
											<TableBody>
												{veiculoPorTipo.map((c, index) => {
													return (
														<TableRow key={c.descricao + "_" + index} className={rowStyle}>
															<TableCell className={cellStyle + " sm:text-left"}>
																{isMobile && "Veículo: "}{c.descricao}
															</TableCell>

															<TableCell className={cellStyle + " sm:text-center"}>
																{isMobile && "Quantidade: "}{c.valor.toLocaleString()}
															</TableCell>
														</TableRow>
													)
												})}
											</TableBody>
										</Table>
									</div>
								)}

								{veiculoPorTipo.length === 0 && <>
									{loading ? (
										<TableLoading />
									) : (
										<TableEmpty py='py-20' icon="import" />
									)}
								</>}
							</div>
						</div>

						<div className="col-span-full mt-16">
							<Filters grid={FiltersGrid.sm2_md3_lg4}>
								<SelectPostoCombustivel control={control} />
								<SelectProdutoAbastecimento control={control} ignoreFiltros />
								<InputDataControl name="dataInicio" title='Data Início' control={control} />
								<InputDataControl name="dataFim" title='Data Fim' control={control} />
							</Filters>
						</div>

						<div className={`flex flex-col gap-8 col-span-1 sm:col-span-2 lg:col-span-3 2xl:col-span-4`}>
							<div className={`flex flex-col gap-8`}>
								{(estoquePorTanque.length > 0) && (
									<div className="bg-card dark:bg-card py-1 rounded-md shadow-md dark:border">
										<TableTop title="Estoque Por Tanque" icon={CarFront}>
										</TableTop>
										<hr />
										<Table>
											<TableHeader>
												<TableRow className="hidden sm:table-row">
													<TableHead className='w-80'>Posto</TableHead>
													<TableHead className='w-80'>Tanque</TableHead>
													<TableHead className='w-80'>Produto</TableHead>
													<TableHead className='w-80 text-center'>Quantidade</TableHead>
													<TableHead></TableHead>
												</TableRow>
											</TableHeader>
											<TableBody>
												{estoquePorTanque.map((c, index) => {
													return (
														<TableRow key={c.descricaoPostoCombustivelTanque + "_" + index} className={rowStyle}>
															<TableCell className={cellStyle + " sm:text-left"}>
																{isMobile && "Posto: "}{c.descricaoPostoCombustivel}
															</TableCell>

															<TableCell className={cellStyle + " sm:text-left"}>
																{isMobile && "Tanque: "}{c.descricaoPostoCombustivelTanque}
															</TableCell>

															<TableCell className={cellStyle + " sm:text-left"}>
																{isMobile && "Produto: "}{c.descricaoProdutoAbastecimento}
															</TableCell>

															<TableCell className={cellStyle + " sm:text-center"}>
																{isMobile && "Quantidade: "}{c.quantidade.toLocaleString()}
															</TableCell>
														</TableRow>
													)
												})}
											</TableBody>
										</Table>
									</div>
								)}

								{estoquePorTanque.length === 0 && <>
									{loading ? (
										<TableLoading />
									) : (
										<TableEmpty py='py-20' icon="import" />
									)}
								</>}
							</div>
						</div>
					</div>
				</TabsContent>

				<TabsContent value='abastecimento'>
					<DashboardAbastecimento />
				</TabsContent>
			</Tabs >
		</div >
	)
}