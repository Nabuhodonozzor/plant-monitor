import { Injectable } from '@angular/core';
import { ServiceBase } from './base/service.base';
import { HttpClient } from '@angular/common/http';
import { Observable, map, catchError } from 'rxjs';
import {
  PlantSensorDataLookup,
  SensorRecord,
} from '../models/sensor-data/sensor-data.model';

@Injectable({
  providedIn: 'root',
})
export class SensorDataService extends ServiceBase {
  constructor(http: HttpClient) {
    super(http);
  }

  getAllPlantSensorData(timeWindow: number): Observable<PlantSensorDataLookup> {
    const url = `${this.baseUrl}/sensorData?timeWindow=${timeWindow}`;
    return this.http.get<PlantSensorDataLookup>(url).pipe(
      map((data) => this.deserializePlantSensorDataLookup(data)),
      catchError(this.handleError)
    );
  }

  private deserializePlantSensorDataLookup(
    rawData: any
  ): PlantSensorDataLookup {
    const deserializedLookup: PlantSensorDataLookup = {};

    for (const plantIdStr in rawData) {
      if (Object.prototype.hasOwnProperty.call(rawData, plantIdStr)) {
        const sensorRecordsArray = rawData[plantIdStr] as any[];
        deserializedLookup[plantIdStr] = sensorRecordsArray.map((record) =>
          this.deserializeSensorRecord(record)
        );
      }
    }
    return deserializedLookup;
  }

  private deserializeSensorRecord(rawRecord: any): SensorRecord {
    return {
      temperature: rawRecord.temperature,
      airHumidity: rawRecord.airHumidity,
      soilHumidity: rawRecord.soilHumidity,
      airPressure: rawRecord.airPressure,
      timestamp: new Date(rawRecord.timestamp),
      plantId: rawRecord.plantId,
    };
  }
}
