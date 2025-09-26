import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import GraficoBarra from "@/components/ui/grafico-barra";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Totalizador, { type statusType } from "@/components/ui/totalizador";
import { useDebounce } from "@/hooks/useDebounce";
import { useMobile } from "@/hooks/useMobile";
import { tipoQuantidadeRendimentoEnum } from "@/services/constants";
import { currency } from "@/services/currency";
import { getAbastecimentosPorMotorista, getAbastecimentosPorPostoCombustivel, getAbastecimentosPorProdutoAbastecimento, getAbastecimentosPorVeiculo, getTotalizadorAbastecimentosLitrosPorDia, getTotalizadorAbastecimentosLitrosPorMes, getTotalizadorAbastecimentosPorDia, getTotalizadorAbastecimentosPorMes, getTotalizadorAbastecimentosValorTotalPorDia, getTotalizadorAbastecimentosValorTotalPorMes, getTotalizadorQuantidadeAbastecimentos, getTotalizadorQuantidadeLitrosAbastecimentos, getTotalizadorValorTotalAbastecimentos, type dashboardFiltrosAbastecimentoType, type dashboardTabelaType, type totalizadorType } from "@/services/dashboard";
import { firstDayOfMonth, formatarData } from "@/services/date";
import GraficoBarraTabs from "@/ui/cards/graficoBarraTabs";
import { Filters, FiltersGrid } from "@/ui/components/Filters";
import InputDataControl from "@/ui/components/forms/InputDataControl";
import PageTitle from "@/ui/components/PageTitle";
import TableEmpty from "@/ui/components/tables/TableEmpty";
import TableLoading from "@/ui/components/tables/TableLoading";
import { TableTop } from "@/ui/components/tables/TableTop";
import SelectPostoCombustivel from "@/ui/selects/PostoCombustivelSelect";
import SelectProdutoAbastecimento from "@/ui/selects/ProdutoAbastecimentoSelect";
import SelectVeiculo from "@/ui/selects/VeiculoSelect";
import DashboardTable from "@/ui/tables/dashboard-table";
import { zodResolver } from "@hookform/resolvers/zod";
import { Banknote, Building2, CarFront, Droplets, Fuel } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import z from "zod";

const schema = z.object({
	idVeiculo: z.object({
		label: z.string().optional(),
		value: z.number().optional()
	}).optional(),
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

export default function DashboardAbastecimento() {
	const [loading, setLoading] = useState(true);

	const { getValues, watch, control } = useForm({
		resolver: zodResolver(schema),
		defaultValues: {
			dataInicio: new Date(firstDayOfMonth()).toISOString(),
			dataFim: new Date().toISOString(),
			idVeiculo: undefined,
			idPostoCombustivel: undefined,
			idProdutoAbastecimento: undefined,
		}
	});

	const [totalizadorQuantidadeAbastecimentos, setTotalizadorQuantidadeAbastecimentos] = useState<totalizadorType>();
	const [totalizadorValorTotalAbastecimentos, setTotalizadorValorTotalAbastecimentos] = useState<totalizadorType>();
	const [totalizadorQuantidadeLitrosAbastecimentos, setTotalizadorQuantidadeLitrosAbastecimentos] = useState<totalizadorType>();
	const [abastecimentosPorVeiculo, setAbastecimentosPorVeiculo] = useState<Array<dashboardTabelaType>>([]);
	const [abastecimentosPorProdutoAbastecimento, setAbastecimentosPorProdutoAbastecimento] = useState<Array<dashboardTabelaType>>([]);
	const [abastecimentosPorPostoCombustivel, setAbastecimentosPorPostoCombustivel] = useState<Array<dashboardTabelaType>>([]);
	const [totalizadorAbastecimentosPorDia, setTotalizadorAbastecimentosPorDia] = useState<Array<totalizadorType>>([]);
	const [totalizadorAbastecimentosLitrosPorDia, setTotalizadorAbastecimentosLitrosPorDia] = useState<Array<totalizadorType>>([]);
	const [totalizadorAbastecimentosValorTotalPorDia, setTotalizadorAbastecimentosValorTotalPorDia] = useState<Array<totalizadorType>>([]);
	const [totalizadorAbastecimentosPorMes, setTotalizadorAbastecimentosPorMes] = useState<Array<totalizadorType>>([]);
	const [totalizadorAbastecimentosLitrosPorMes, setTotalizadorAbastecimentosLitrosPorMes] = useState<Array<totalizadorType>>([]);
	const [totalizadorAbastecimentosValorTotalPorMes, setTotalizadorAbastecimentosValorTotalPorMes] = useState<Array<totalizadorType>>([]);
	const [abastecimentosPorMotorista, setAbastecimentosPorMotorista] = useState<Array<dashboardTabelaType>>([]);

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

		const dadosform = getValues() as dashboardFiltrosAbastecimentoType;
		const filtros = {
			dataInicio: dadosform.dataInicio,
			dataFim: dadosform.dataFim,
			idVeiculo: (dadosform.idVeiculo as any)?.value,
			idPostoCombustivel: (dadosform.idPostoCombustivel as any)?.value,
			idProdutoAbastecimento: (dadosform.idProdutoAbastecimento as any)?.value,
		}

		await Promise.all([
			carregaDadosTotalizadorQuantidadeAbastecimentos(filtros),
			carregaDadosTotalizadorValorTotalAbastecimentos(filtros),
			carregaDadosTotalizadorQuantidadeLitrosAbastecimentos(filtros),
			carregaDadosAbastecimentosPorVeiculo(filtros),
			carregaDadosAbastecimentosPorProdutoAbastecimento(filtros),
			carregaDadosAbastecimentosPorPostoCombustivel(filtros),
			carregaDadosTotalizadorAbastecimentosPorDia(filtros),
			carregaDadosTotalizadorAbastecimentosLitrosPorDia(filtros),
			carregaDadosTotalizadorAbastecimentosValorTotalPorDia(filtros),
			carregaDadosTotalizadorAbastecimentosPorMes(filtros),
			carregaDadosTotalizadorAbastecimentosLitrosPorMes(filtros),
			carregaDadosTotalizadorAbastecimentosValorTotalPorMes(filtros),
			carregaDadosAbastecimentosPorMotorista(filtros),
		]);

		toast.dismiss(process);
		setLoading(false);
	}, 500);

	const carregaDadosTotalizadorQuantidadeAbastecimentos = async (filtros: dashboardFiltrosAbastecimentoType) => {
		setTotalizadorQuantidadeAbastecimentos(undefined);
		try {
			const data = await getTotalizadorQuantidadeAbastecimentos(filtros);
			setTotalizadorQuantidadeAbastecimentos(data);
		} catch (err) { }
	}

	const carregaDadosTotalizadorValorTotalAbastecimentos = async (filtros: dashboardFiltrosAbastecimentoType) => {
		setTotalizadorValorTotalAbastecimentos(undefined);
		try {
			const data = await getTotalizadorValorTotalAbastecimentos(filtros);
			setTotalizadorValorTotalAbastecimentos(data);
		} catch (err) { }
	}

	const carregaDadosTotalizadorQuantidadeLitrosAbastecimentos = async (filtros: dashboardFiltrosAbastecimentoType) => {
		setTotalizadorQuantidadeLitrosAbastecimentos(undefined);
		try {
			const data = await getTotalizadorQuantidadeLitrosAbastecimentos(filtros);
			setTotalizadorQuantidadeLitrosAbastecimentos(data);
		} catch (err) { }
	}

	const carregaDadosAbastecimentosPorVeiculo = async (filtros: dashboardFiltrosAbastecimentoType) => {
		setAbastecimentosPorVeiculo([]);
		try {
			const data = await getAbastecimentosPorVeiculo(filtros);
			setAbastecimentosPorVeiculo(data);
		} catch (err) { }
	}

	const carregaDadosAbastecimentosPorProdutoAbastecimento = async (filtros: dashboardFiltrosAbastecimentoType) => {
		setAbastecimentosPorProdutoAbastecimento([]);
		try {
			const data = await getAbastecimentosPorProdutoAbastecimento(filtros);
			setAbastecimentosPorProdutoAbastecimento(data);
		} catch (err) { }
	}

	const carregaDadosAbastecimentosPorPostoCombustivel = async (filtros: dashboardFiltrosAbastecimentoType) => {
		setAbastecimentosPorPostoCombustivel([]);
		try {
			const data = await getAbastecimentosPorPostoCombustivel(filtros);
			setAbastecimentosPorPostoCombustivel(data);
		} catch (err) { }
	}

	const carregaDadosTotalizadorAbastecimentosPorDia = async (filtros: dashboardFiltrosAbastecimentoType) => {
		setTotalizadorAbastecimentosPorDia([]);
		try {
			const data = await getTotalizadorAbastecimentosPorDia(filtros);
			setTotalizadorAbastecimentosPorDia(data);
		} catch (err) { }
	}

	const carregaDadosTotalizadorAbastecimentosLitrosPorDia = async (filtros: dashboardFiltrosAbastecimentoType) => {
		setTotalizadorAbastecimentosLitrosPorDia([]);
		try {
			const data = await getTotalizadorAbastecimentosLitrosPorDia(filtros);
			setTotalizadorAbastecimentosLitrosPorDia(data);
		} catch (err) { }
	}

	const carregaDadosTotalizadorAbastecimentosValorTotalPorDia = async (filtros: dashboardFiltrosAbastecimentoType) => {
		setTotalizadorAbastecimentosValorTotalPorDia([]);
		try {
			const data = await getTotalizadorAbastecimentosValorTotalPorDia(filtros);
			setTotalizadorAbastecimentosValorTotalPorDia(data);
		} catch (err) { }
	}

	const carregaDadosTotalizadorAbastecimentosPorMes = async (filtros: dashboardFiltrosAbastecimentoType) => {
		setTotalizadorAbastecimentosPorMes([]);
		try {
			const data = await getTotalizadorAbastecimentosPorMes(filtros);
			setTotalizadorAbastecimentosPorMes(data);
		} catch (err) { }
	}

	const carregaDadosTotalizadorAbastecimentosLitrosPorMes = async (filtros: dashboardFiltrosAbastecimentoType) => {
		setTotalizadorAbastecimentosLitrosPorMes([]);
		try {
			const data = await getTotalizadorAbastecimentosLitrosPorMes(filtros);
			setTotalizadorAbastecimentosLitrosPorMes(data);
		} catch (err) { }
	}

	const carregaDadosTotalizadorAbastecimentosValorTotalPorMes = async (filtros: dashboardFiltrosAbastecimentoType) => {
		setTotalizadorAbastecimentosValorTotalPorMes([]);
		try {
			const data = await getTotalizadorAbastecimentosValorTotalPorMes(filtros);
			setTotalizadorAbastecimentosValorTotalPorMes(data);
		} catch (err) { }
	}

	const carregaDadosAbastecimentosPorMotorista = async (filtros: dashboardFiltrosAbastecimentoType) => {
		setAbastecimentosPorMotorista([]);
		try {
			const data = await getAbastecimentosPorMotorista(filtros);
			setAbastecimentosPorMotorista(data);
		} catch (err) { }
	}

	return (
		<div className="flex flex-col gap-8 min-h-[calc(100%-4rem)]">
			<Filters grid={FiltersGrid.sm2_md3}>
				<SelectVeiculo control={control} />
				<SelectPostoCombustivel control={control} />
				<SelectProdutoAbastecimento control={control} ignoreFiltros/>
				<InputDataControl name="dataInicio" title='Data Início' control={control} />
				<InputDataControl name="dataFim" title='Data Fim' control={control} />
			</Filters>

			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
				<Totalizador
					descricao={totalizadorQuantidadeAbastecimentos?.descricao || ""}
					valor={totalizadorQuantidadeAbastecimentos?.valor || 0}
					loading={loading && !totalizadorQuantidadeAbastecimentos}
					icone="fuel"
					status="success"
				/>

				<Totalizador
					descricao={totalizadorValorTotalAbastecimentos?.descricao || ""}
					valor={totalizadorValorTotalAbastecimentos?.valor || 0}
					loading={loading && !totalizadorValorTotalAbastecimentos}
					icone="banknote"
					status="warning"
				/>

				<Totalizador
					descricao={totalizadorQuantidadeLitrosAbastecimentos?.descricao || ""}
					valor={totalizadorQuantidadeLitrosAbastecimentos?.valor || 0}
					loading={loading && !totalizadorQuantidadeLitrosAbastecimentos}
					icone="droplets"
					status="default"
				/>

				<div className="space-y-4">
					<DashboardTable
						titulo="Abastecimentos por Veículo"
						lista={abastecimentosPorVeiculo}
						loading={loading}
					/>

					<DashboardTable
						titulo="Abastecimentos por Produto"
						lista={abastecimentosPorProdutoAbastecimento}
						loading={loading}
					/>

					<DashboardTable
						titulo="Abastecimentos por Posto"
						lista={abastecimentosPorPostoCombustivel}
						loading={loading}
					/>

					<DashboardTable
						titulo="Abastecimentos por Motorista"
						lista={abastecimentosPorMotorista}
						loading={loading}
					/>
				</div>

				<div className="sm:col-span-1 lg:col-span-2 space-y-4">
					<GraficoBarraTabs
						titulo="Abastecimentos por Dia"
						subtitulo={`Período: ${formatarData(getValues("dataInicio") || "")} - ${formatarData(getValues("dataFim") || "")}`}
						tabs={[
							{
								tabKey: "tab1",
								descricao: "Abastecimentos",
								icon: Fuel
							},
							{
								tabKey: "tab2",
								descricao: "Litros",
								icon: Droplets
							},
							{
								tabKey: "tab3",
								descricao: "Valor Total",
								icon: Banknote
							}
						]}
					>
						<GraficoBarraTabs.TabContent tabKey="tab1">
							<GraficoBarra
								dados={totalizadorAbastecimentosPorDia}
								labelBarra="Abastecimentos"
							/>
						</GraficoBarraTabs.TabContent>

						<GraficoBarraTabs.TabContent tabKey='tab2'>
							<GraficoBarra
								dados={totalizadorAbastecimentosLitrosPorDia}
								labelBarra="Litros"
							/>
						</GraficoBarraTabs.TabContent>

						<GraficoBarraTabs.TabContent tabKey='tab3'>
							<GraficoBarra
								dados={totalizadorAbastecimentosValorTotalPorDia}
								labelBarra="Valor"
								isCurrency
							/>
						</GraficoBarraTabs.TabContent>
					</GraficoBarraTabs>

					<GraficoBarraTabs
						titulo="Abastecimentos por Mês"
						subtitulo={`Período: ${formatarData(getValues("dataInicio") || "")} - ${formatarData(getValues("dataFim") || "")}`}
						tabs={[
							{
								tabKey: "tab1",
								descricao: "Abastecimentos",
								icon: Fuel
							},
							{
								tabKey: "tab2",
								descricao: "Litros",
								icon: Droplets
							},
							{
								tabKey: "tab3",
								descricao: "Valor Total",
								icon: Banknote
							}
						]}
					>
						<GraficoBarraTabs.TabContent tabKey="tab1">
							<GraficoBarra
								dados={totalizadorAbastecimentosPorMes}
								labelBarra="Abastecimentos"
							/>
						</GraficoBarraTabs.TabContent>

						<GraficoBarraTabs.TabContent tabKey='tab2'>
							<GraficoBarra
								dados={totalizadorAbastecimentosLitrosPorMes}
								labelBarra="Litros"
							/>
						</GraficoBarraTabs.TabContent>

						<GraficoBarraTabs.TabContent tabKey='tab3'>
							<GraficoBarra
								dados={totalizadorAbastecimentosValorTotalPorMes}
								labelBarra="Valor"
								isCurrency
							/>
						</GraficoBarraTabs.TabContent>
					</GraficoBarraTabs>
				</div>
			</div>
		</div>
	)
}