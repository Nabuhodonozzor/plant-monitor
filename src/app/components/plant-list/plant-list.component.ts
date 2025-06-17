import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SensorDataService } from '../../../core/services/sensor-data.service';
import { PlantSensorDataLookup } from '../../../core/models/sensor-data/sensor-data.model';
import { Chart, ChartDataset } from 'chart.js';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-plant-list',
  imports: [CommonModule, FormsModule],
  templateUrl: './plant-list.component.html',
  styleUrl: './plant-list.component.scss',
})
export class PlantListComponent implements OnInit {
  constructor(private sensorDataService: SensorDataService) {}

  private plantIds: string[] = [];

  public timeWindow: string = '24h';

  private tempDataset: ChartDataset<'line'>[] = [];
  private airHumDataset: ChartDataset<'line'>[] = [];
  private soilHumDataset: ChartDataset<'line'>[] = [];
  private pressureDataset: ChartDataset<'line'>[] = [];

  private labels: string[] = [];

  public TemperatureChart: Chart | undefined;
  public AirHumidityChart: Chart | undefined;
  public SoilHumidityChart: Chart | undefined;
  public AirPressureChart: Chart | undefined;

  public ngOnInit(): void {
    this.Reload();
  }

  public Reload(): void {
    const hoursString = this.timeWindow.replace('h', '');
    const selectedHours = parseInt(hoursString, 10);
    this.sensorDataService.getAllPlantSensorData(selectedHours).subscribe({
      next: (plantData) => {
        this.ModelLoaded(plantData);
      },
    });
  }

  public GetPlantNames(platnId: string): string {
    const plantNameLookup: { [key: string]: string } = {
      '5': 'Calatea',
      '6': 'Kaktus',
    };

    return plantNameLookup[platnId];
  }

  public ModelLoaded(model: PlantSensorDataLookup) {
    this.plantIds = Object.keys(model);

    this.airHumDataset = [];
    this.soilHumDataset = [];
    this.pressureDataset = [];
    this.tempDataset = [];
    this.labels = [];

    this.labels = model[5].map((reading) =>
      new Date(reading.timestamp).toLocaleTimeString('pl-PL', {
        hour: '2-digit',
        minute: '2-digit',
      })
    );

    const maxTemp = Math.max(
      ...model['5'].map((reading) => reading.temperature)
    );
    const minTemp = Math.min(
      ...model['5'].map((reading) => reading.temperature)
    );

    const maxTempPlus5 = Math.ceil(maxTemp * 1.05);
    const minTempMinus5 = Math.floor(minTemp * 0.95);

    const maxAirHumidity = Math.max(
      ...model['5'].map((reading) => reading.airHumidity)
    );
    const minAirHumidity = Math.min(
      ...model['5'].map((reading) => reading.airHumidity)
    );
    const maxAirHumidityPlus5 = Math.ceil(maxAirHumidity * 1.05);
    const minAirHumidityMinus5 = Math.floor(minAirHumidity * 0.95);

    const maxSoil5Humidity = Math.max(
      ...model['5'].map((reading) => reading.soilHumidity)
    );
    const minSoil5Humidity = Math.min(
      ...model['5'].map((reading) => reading.soilHumidity)
    );
    const maxSoil5HumidityPlus5 = Math.ceil(maxSoil5Humidity * 1.05);
    const minSoil5HumidityMinus5 = Math.floor(minSoil5Humidity * 0.95);

    const maxSoil6Humidity = Math.max(
      ...model['6'].map((reading) => reading.soilHumidity)
    );
    const minSoil6Humidity = Math.min(
      ...model['6'].map((reading) => reading.soilHumidity)
    );
    const maxSoil6HumidityPlus5 = Math.ceil(maxSoil6Humidity * 1.05);
    const minSoil6HumidityMinus5 = Math.floor(minSoil6Humidity * 0.95);

    const maxAirPressure = Math.max(
      ...model['5'].map((reading) => reading.airPressure)
    );
    const minAirPressure = Math.min(
      ...model['5'].map((reading) => reading.airPressure)
    );
    const maxAirPressurePlus5 = Math.ceil(maxAirPressure * 1.001);
    const minAirPressureMinus5 = Math.floor(minAirPressure * 0.999);

    this.airHumDataset.push({
      label: 'Wilgotność powietrza',
      data: model['5'].map((reading) => reading.airHumidity),
      borderColor: '#0000CC',
      fill: false,
      tension: 0.4,
      pointRadius: 1,
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
        label: `Wilgotność gleby - ${this.GetPlantNames(plantId)}`,
        data: data.map((reading) => reading.soilHumidity),
        borderColor: this.getRandomColor(),
        fill: false,
        tension: 0.4,
        pointRadius: 0,
      });
    });

    if (!this.AirHumidityChart) {
      this.InitCharts(
        maxTempPlus5,
        minTempMinus5,
        maxSoil5HumidityPlus5,
        minSoil5HumidityMinus5,
        maxAirHumidityPlus5,
        minAirHumidityMinus5,
        maxAirPressurePlus5,
        minAirPressureMinus5
      );
    }

    this.UpdateCharts(
      maxTempPlus5,
      minTempMinus5,
      maxSoil5HumidityPlus5,
      minSoil5HumidityMinus5,
      maxAirHumidityPlus5,
      minAirHumidityMinus5,
      maxAirPressurePlus5,
      minAirPressureMinus5
    );
  }

  private InitCharts(
    maxTempPlus5: number,
    minTempMinus5: number,
    maxSoil5HumidityPlus5: number,
    minSoil5HumidityMinus5: number,
    maxAirHumidityPlus5: number,
    minAirHumidityMinus5: number,
    maxAirPressurePlus5: number,
    minAirPressureMinus5: number
  ) {
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
            min: maxTempPlus5,
            max: minTempMinus5,
            beginAtZero: false,
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
            min: maxSoil5HumidityPlus5,
            max: minSoil5HumidityMinus5,
            beginAtZero: false,
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
            min: maxAirHumidityPlus5,
            max: minAirHumidityMinus5,
            beginAtZero: false,
          },
        },
      },
    });

    this.AirPressureChart = new Chart('air-pressure-chart', {
      type: 'line',
      data: {
        labels: this.labels,
        datasets: this.pressureDataset,
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            min: maxAirPressurePlus5,
            max: minAirPressureMinus5,
            beginAtZero: false,
          },
        },
      },
    });
  }

  private UpdateCharts(
    maxTempPlus5: number,
    minTempMinus5: number,
    maxSoil5HumidityPlus5: number,
    minSoil5HumidityMinus5: number,
    maxAirHumidityPlus5: number,
    minAirHumidityMinus5: number,
    maxAirPressurePlus5: number,
    minAirPressureMinus5: number
  ) {
    if (this.TemperatureChart) {
      this.TemperatureChart.data.labels = this.labels;
      this.TemperatureChart.data.datasets = this.tempDataset;
      if (
        this.TemperatureChart.options &&
        this.TemperatureChart.options.scales &&
        this.TemperatureChart.options.scales['y']
      ) {
        this.TemperatureChart.options.scales['y'].min = minTempMinus5;
        this.TemperatureChart.options.scales['y'].max = maxTempPlus5;
      }
      this.TemperatureChart.update();
    }

    if (this.SoilHumidityChart) {
      this.SoilHumidityChart.data.labels = this.labels;
      this.SoilHumidityChart.data.datasets = this.soilHumDataset;
      if (
        this.SoilHumidityChart.options &&
        this.SoilHumidityChart.options.scales &&
        this.SoilHumidityChart.options.scales['y']
      ) {
        this.SoilHumidityChart.options.scales['y'].min = minSoil5HumidityMinus5;
        this.SoilHumidityChart.options.scales['y'].max = maxSoil5HumidityPlus5;
      }
      this.SoilHumidityChart.update();
    }

    if (this.AirHumidityChart) {
      this.AirHumidityChart.data.labels = this.labels;
      this.AirHumidityChart.data.datasets = this.airHumDataset;
      if (
        this.AirHumidityChart.options &&
        this.AirHumidityChart.options.scales &&
        this.AirHumidityChart.options.scales['y']
      ) {
        this.AirHumidityChart.options.scales['y'].min = minAirHumidityMinus5;
        this.AirHumidityChart.options.scales['y'].max = maxAirHumidityPlus5;
      }
      this.AirHumidityChart.update();
    }

    if (this.AirPressureChart) {
      this.AirPressureChart.data.labels = this.labels;
      this.AirPressureChart.data.datasets = this.pressureDataset;
      if (
        this.AirPressureChart.options &&
        this.AirPressureChart.options.scales &&
        this.AirPressureChart.options.scales['y']
      ) {
        this.AirPressureChart.options.scales['y'].min = minAirPressureMinus5;
        this.AirPressureChart.options.scales['y'].max = maxAirPressurePlus5;
      }
      this.AirPressureChart.update();
    }
  }

  getRandomColor(): string {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }
}
