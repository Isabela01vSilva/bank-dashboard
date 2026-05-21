import { Component } from '@angular/core';
import {
  NgApexchartsModule,
  ApexChart,
  ApexNonAxisChartSeries,
  ApexPlotOptions,
  ApexDataLabels,
  ApexLegend,
} from 'ng-apexcharts';

@Component({
  selector: 'app-chart-donut',
  standalone: true,
  imports: [NgApexchartsModule],
  templateUrl: './chart-donut.html',
})
export class ChartDonut {
  // SERIES
  chartSeries: ApexNonAxisChartSeries = [1200, 1200, 450, 380, 320];

  // LABELS
  chartLabels = ['Alimentação', 'Moradia', 'Transporte', 'Lazer', 'Serviços'];

  // COLORS
  chartColors = ['#7C3AED', '#0EA5E9', '#F59E0B', '#EF4444', '#16A34A'];

  // CHART
  chartDetails: ApexChart = {
    type: 'donut',
    height: 260,
  };

  categories = [
    {
      name: 'Alimentação',
      value: 'R$ 1.200',
      color: '#7C3AED',
    },
    {
      name: 'Moradia',
      value: 'R$ 1.200',
      color: '#0EA5E9',
    },
    {
      name: 'Transporte',
      value: 'R$ 450',
      color: '#F59E0B',
    },
    {
      name: 'Lazer',
      value: 'R$ 380',
      color: '#EF4444',
    },
    {
      name: 'Serviços',
      value: 'R$ 320',
      color: '#16A34A',
    },
  ];

  // DONUT CONFIG
  plotOptions: ApexPlotOptions = {
    pie: {
      donut: {
        size: '70%',

        labels: {
          show: true,

          total: {
            show: true,
            label: 'Total',

            formatter: () => {
              return 'R$ 4.5k';
            },
          },
        },
      },
    },
  };

  // DATA LABELS
  dataLabels: ApexDataLabels = {
    enabled: false,
  };

  // LEGEND
  legend: ApexLegend = {
    show: true,
  };
}
