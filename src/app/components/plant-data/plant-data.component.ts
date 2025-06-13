import { Component } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { ChartOptions, ChartType, ChartData } from 'chart.js';

@Component({
  selector: 'app-plant-data',
  imports: [ChartModule],
  templateUrl: './plant-data.component.html',
  styleUrl: './plant-data.component.scss',
})
export class PlantDataComponent {
  public PlantData: any;

  chartData: ChartData<'line'> = {
    labels: ['Jan', 'Feb', 'Mar'],
    datasets: [
      {
        label: 'Sales',
        data: [150, 200, 180],
        borderColor: 'var(--light-green)',
        backgroundColor: 'rgba(159, 195, 250, 0.89)',
        pointBackgroundColor: 'white',
        borderWidth: 2,
        tension: 0.2,
      },
    ],
  };

  chartOptions: ChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        labels: {
          color: 'white',
        },
      },
    },
    scales: {
      x: {
        ticks: { color: 'white' },
        grid: { color: 'rgba(199, 198, 178, 0.1)' },
      },
      y: {
        ticks: { color: 'white' },
        grid: { color: 'rgba(199, 198, 178, 0.1)' },
      },
    },
  };
}
