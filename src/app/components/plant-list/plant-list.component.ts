import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SensorDataService } from '../../../core/services/sensor-data.service';
import { PlantSensorDataLookup } from '../../../core/models/sensor-data/sensor-data.model';
import { Chart, ChartDataset } from 'chart.js';

@Component({
  selector: 'app-plant-list',
  imports: [CommonModule],
  templateUrl: './plant-list.component.html',
  styleUrl: './plant-list.component.scss',
})
export class PlantListComponent implements OnInit {
  constructor(private sensorDataService: SensorDataService) {}

  private plantIds: string[] = [];

  private tempDataset: ChartDataset<'line'>[] = [];
  private airHumDataset: ChartDataset<'line'>[] = [];
  private soilHumDataset: ChartDataset<'line'>[] = [];
  private pressureDataset: ChartDataset<'line'>[] = [];

  private labels: string[] = [];

  public TemperatureChart: Chart | undefined;
  public AirHumidityChart: Chart | undefined;
  public SoilHumidityChart: Chart | undefined;

  public ngOnInit(): void {
    this.sensorDataService.getAllPlantSensorData().subscribe({
      next: (plantData) => {
        this.ModelLoaded(plantData);
      },
    });
  }

  public ModelLoaded(model: PlantSensorDataLookup) {
    this.plantIds = Object.keys(model);

    this.labels.push(
      ...model['5'].map((reading) =>
        new Date(reading.timestamp).toLocaleTimeString()
      )
    );

    this.airHumDataset.push({
      label: 'Wilgotność powietrza',
      data: model['5'].map((reading) => reading.airHumidity),
      borderColor: '#0000CC',
      fill: false,
      tension: 0.4,
      pointRadius: 0,
    });

    this.tempDataset.push({
      label: 'Temperatura',
      data: model['5'].map((reading) => reading.temperature),
      borderColor: '#00CC00',
      fill: false,
      tension: 0.4,
      pointRadius: 0,
    });

    this.pressureDataset.push({
      label: 'Ciśnenie atmosferyczne',
      data: model['5'].map((reading) => reading.airPressure),
      borderColor: '#CC0000',
      fill: false,
      tension: 0.4,
      pointRadius: 0,
    });

    this.plantIds.forEach((plantId) => {
      const data = model[parseInt(plantId)];
      this.soilHumDataset.push({
        label: `Wilgotność gleby - ${plantId}`,
        data: data.map((reading) => reading.soilHumidity),
        borderColor: this.getRandomColor(), // You'll need a function to generate random colors
        fill: false,
        tension: 0.4,
      });
    });

    this.TemperatureChart = new Chart('temperature-chart', {
      type: 'line',
      data: {
        labels: this.labels,
        datasets: this.tempDataset,
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });

    this.SoilHumidityChart = new Chart('soil-humidity-chart', {
      type: 'line',
      data: {
        labels: this.labels,
        datasets: this.soilHumDataset,
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });

    this.AirHumidityChart = new Chart('air-humidity-chart', {
      type: 'line',
      data: {
        labels: this.labels,
        datasets: this.airHumDataset,
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  }

  getRandomColor(): string {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  private InitTempChart() {}

  private InitAirHumChart() {}

  private InitSoilHumChart() {}
}
