import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, AreaChart, Area, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, XAxis, YAxis, CartesianGrid } from "recharts";
import type { ChartData } from "@/lib/types";

interface DynamicChartProps {
  chartData: ChartData;
}

export const DynamicChart = ({ chartData }: DynamicChartProps) => {
  const chartConfig = {
    value: {
      label: "Valor",
      color: "hsl(var(--primary))",
    },
  };

  const renderChart = () => {
    switch (chartData.chartType) {
      case "bar":
        return (
          <BarChart data={Array.isArray(chartData.data) ? chartData.data : [chartData.data]}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="value" fill="hsl(var(--primary))" />
          </BarChart>
        );
      case "line":
        return (
          <LineChart data={Array.isArray(chartData.data) ? chartData.data : [chartData.data]}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Line type="monotone" dataKey="value" stroke="hsl(var(--primary))" />
          </LineChart>
        );
      case "pie":
        return (
          <PieChart>
            <Pie
              data={Array.isArray(chartData.data) ? chartData.data : [chartData.data]}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              fill="hsl(var(--primary))"
            />
            <ChartTooltip content={<ChartTooltipContent />} />
          </PieChart>
        );
      case "area":
        return (
          <AreaChart data={Array.isArray(chartData.data) ? chartData.data : [chartData.data]}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Area type="monotone" dataKey="value" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.6} />
          </AreaChart>
        );
      case "radar":
        return (
          <RadarChart data={Array.isArray(chartData.data) ? chartData.data : [chartData.data]}>
            <PolarGrid />
            <PolarAngleAxis dataKey="name" />
            <PolarRadiusAxis />
            <Radar name="Valor" dataKey="value" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.6} />
            <ChartTooltip content={<ChartTooltipContent />} />
          </RadarChart>
        );
      default:
        return null;
    }
  };

  return (
    <div className="mt-4">
      {chartData.title && <h4 className="text-sm font-semibold mb-2">{chartData.title}</h4>}
      {chartData.description && <p className="text-xs text-muted-foreground mb-4">{chartData.description}</p>}
      <ChartContainer config={chartConfig}>
        {renderChart()}
      </ChartContainer>
    </div>
  );
};
