import { Component } from '@angular/core';
import {
  NgApexchartsModule,
  ApexAxisChartSeries,
  ApexChart,
  ApexTooltip,
  ApexDataLabels,
  ApexPlotOptions,
  ApexStroke,
  ApexXAxis,
  ApexYAxis,
  ApexGrid,
  ApexLegend,
} from 'ng-apexcharts';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  tooltip: ApexTooltip;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  plotOptions: ApexPlotOptions;
  dataLabels: ApexDataLabels;
  stroke: ApexStroke;
  colors: string[];
  legend: ApexLegend;
  grid: ApexGrid;
};

@Component({
  selector: 'app-chart',
  standalone: true,
  imports: [NgApexchartsModule],
  templateUrl: './chart.html',
  styleUrl: './chart.css',
})
export class Chart {
  // Objeto principal de configuração do gráfico
  chartOptions: ChartOptions = {
    // SERIES = dados que serão exibidos no gráfico
    series: [
      // Primeira coluna/barra -> Entradas
      {
        name: 'Entradas', // nome da legenda/série
        data: [8500, 9200, 8700, 11800, 9000, 8600], // valores de cada mês
      },

      // Segunda coluna/barra -> Saídas
      {
        name: 'Saídas',
        data: [5200, 5800, 6200, 4500, 9000, 6000],
      },
    ],

    // CONFIGURAÇÕES GERAIS DO GRÁFICO
    chart: {
      // tipo do gráfico
      type: 'bar',

      // altura do gráfico
      height: 350,

      redrawOnParentResize: true,
      redrawOnWindowResize: true,

      // barra de ferramentas do apexcharts
      toolbar: {
        // false = esconde zoom/download/menu
        show: true,
      },
    },

    tooltip: {
      // mostra as duas informações juntas
      // entradas + saídas
      shared: true,

      // ativa hover mesmo sem encostar perfeitamente
      intersect: false,

      y: {
        // formata os valores
        formatter: (value: number) => {
          return `R$ ${value.toLocaleString('pt-BR')}`;
        },
      },
    },

    // CORES DAS BARRAS
    colors: [
      // verde -> Entradas
      '#0B8F3A',

      // vermelho -> Saídas
      '#f83939',
    ],

    // CONFIGURAÇÕES DAS BARRAS
    plotOptions: {
      bar: {
        // arredondamento das bordas
        borderRadius: 6,

        // largura das colunas
        columnWidth: '40%',
      },
    },

    // NÚMEROS EM CIMA DAS BARRAS
    dataLabels: {
      // false = não mostra os valores acima das barras
      enabled: false,
    },

    // BORDA DAS BARRAS
    stroke: {
      // false = remove borda
      show: false,
    },

    // EIXO X -> horizontal
    xaxis: {
      // nomes exibidos embaixo
      categories: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],

      // linha do eixo
      axisBorder: {
        // esconde a linha
        show: false,
      },

      // tracinhos pequenos do eixo
      axisTicks: {
        // esconde os ticks
        show: false,
      },
    },

    // EIXO Y -> vertical
    yaxis: {
      labels: {
        // formata os valores do eixo
        // 12000 -> 12k
        formatter: (value) => `${value / 1000}k`,
      },
    },

    // LINHAS DE FUNDO DO GRÁFICO
    grid: {
      // deixa tracejado
      strokeDashArray: 4,
    },

    // LEGENDA
    legend: {
      // false = esconde legenda automática
      // porque você criou uma manual no HTML
      show: false,
    },
  };
}
