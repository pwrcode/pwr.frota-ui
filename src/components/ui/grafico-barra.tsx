import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card"
import {
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
	type ChartConfig,
} from "@/components/ui/chart"
import type { totalizadorType } from "@/services/dashboard";
import colors from 'tailwindcss/colors';
import { currency } from "@/services/currency";
type Props = {
	dados: Array<totalizadorType>;
	labelBarra: string;
	isCurrency?: boolean;
}

function GraficoBarra({ dados, labelBarra, isCurrency }: Props) {
	const chartConfig = {
		yAxis: {
			label: labelBarra,
			color: colors.orange[500],
		},
	} satisfies ChartConfig

	const chartData = dados.map(x => ({
		xAxis: x.descricao,
		yAxis: x.valor
	}))

	const barWidth = 50;
	const barSpacing = 50;
	const minChartWidth = chartData.length * (barWidth + barSpacing);
	const chartHeight = 400;

	return (
		<div style={{ overflowX: 'auto' }}>
			<div style={{ minWidth: `${minChartWidth}px`, height: `${chartHeight}px` }}>
				<ChartContainer config={chartConfig} className="w-full h-full">
					<BarChart accessibilityLayer data={chartData} width={minChartWidth} height={chartHeight}>
						<CartesianGrid vertical={false} />
						<XAxis
							dataKey="xAxis"
							tickLine={false}
							tickMargin={10}
							axisLine={false}
							tickFormatter={(value) => value}
							angle={-30}
							height={60}
						/>
						<ChartTooltip
							cursor={false}
							content={<ChartTooltipContent />}
							formatter={value => `${labelBarra}: ${isCurrency ? currency(value as number || 0) : value}`}
						/>
						<Bar dataKey="yAxis" fill={colors.orange[500]} radius={4} width={barWidth} barSize={barWidth} />
					</BarChart>
				</ChartContainer>
			</div>
		</div>
	)
}

export default GraficoBarra