export type InformeView = "analisis1" | "analisis2" | "analisis3" | "analisis4" | "analisis5" | "analisis6" | "analisis7" | "analisis8" | "matriz-critico";

export interface ChartData {
  chartType: "bar" | "line" | "pie" | "area" | "radar";
  title: string;
  data: any;
  description?: string;
}

export interface SavedAnalysis {
  id: string;
  user_id: string;
  name: string;
  query: string;
  text_content: string | null;
  chart_type: string | null;
  chart_title: string | null;
  chart_data: any;
  chart_description: string | null;
  created_at: string;
}

export const informeOptions = [
  { label: "Análisis 1", value: "analisis1" as InformeView },
  { label: "Análisis 2", value: "analisis2" as InformeView },
  { label: "Análisis 3", value: "analisis3" as InformeView },
  { label: "Análisis 4", value: "analisis4" as InformeView },
  { label: "Análisis 5", value: "analisis5" as InformeView },
  { label: "Análisis 6", value: "analisis6" as InformeView },
  { label: "Análisis 7", value: "analisis7" as InformeView },
  { label: "Análisis 8", value: "analisis8" as InformeView },
];

export const ANALYSIS_URL = import.meta.env.VITE_ANALYSIS_URL || "https://api.example.com/analyze";

export function parseChartData(text: string): { textContent: string; chartData: ChartData | null } {
  // Buscar patrones de gráficos en el texto
  const chartPattern = /\[CHART:(\w+):([^\]]+)\]/g;
  let match;
  let chartData: ChartData | null = null;
  let textContent = text;

  while ((match = chartPattern.exec(text)) !== null) {
    const [, chartType, dataStr] = match;
    try {
      const data = JSON.parse(dataStr);
      chartData = {
        chartType: chartType as ChartData["chartType"],
        title: data.title || "Gráfico",
        data: data.data || data,
        description: data.description,
      };
      textContent = textContent.replace(match[0], "");
    } catch (e) {
      console.error("Error parsing chart data:", e);
    }
  }

  return { textContent, chartData };
}
