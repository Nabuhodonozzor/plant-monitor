import { Injectable } from '@angular/core';
import { ServiceBase } from './base/service.base';
import { HttpClient } from '@angular/common/http';
import { Observable, map, catchError } from 'rxjs';
import {
  PlantSensorDataLookup,
  SensorRecord,
} from '../models/sensor-data/sensor-data.model';
import { raw } from 'express';

@Injectable({
  providedIn: 'root',
})
export class SensorDataService extends ServiceBase {
  constructor(http: HttpClient) {
    super(http);
  }

  /**
   * Fetches all plant sensor data and deserializes it into the PlantSensorDataLookup model.
   * Optionally converts timestamp strings to Date objects.
   * @returns An Observable of PlantSensorDataLookup.
   */
  getAllPlantSensorData(): Observable<PlantSensorDataLookup> {
    // Assuming your API endpoint for this data is /sensor-data or similar
    const url = `${this.baseUrl}/sensorData`; // Adjust this URL as per your actual backend endpoint

    return this.http.get<PlantSensorDataLookup>(url).pipe(
      map((data) => this.deserializePlantSensorDataLookup(data)),
      catchError(this.handleError)
    );
  }
  /**
   * Deserializes the raw JSON response into the PlantSensorDataLookup model.
   * This includes converting timestamp strings to Date objects for each SensorRecord.
   * @param rawData The raw JSON object received from the backend.
   * @returns A PlantSensorDataLookup object with correctly typed data.
   */
  private deserializePlantSensorDataLookup(
    rawData: any
  ): PlantSensorDataLookup {
    const deserializedLookup: PlantSensorDataLookup = {};

    for (const plantIdStr in rawData) {
      if (Object.prototype.hasOwnProperty.call(rawData, plantIdStr)) {
        const sensorRecordsArray = rawData[plantIdStr] as any[]; // Cast to any[] for iteration
        deserializedLookup[plantIdStr] = sensorRecordsArray.map((record) =>
          this.deserializeSensorRecord(record)
        );
      }
    }
    return deserializedLookup;
  }

  /**
   * Deserializes a single raw sensor record into the SensorRecord interface,
   * converting the timestamp string to a Date object.
   * @param rawRecord The raw JSON object for a sensor record.
   * @returns A SensorRecord object with the timestamp as a Date.
   */
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
