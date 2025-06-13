/**
 * Represents a single sensor data record for a plant.
 */
export interface SensorRecord {
  temperature: number;
  airHumidity: number;
  soilHumidity: number;
  airPressure: number;
  timestamp: Date; // Or Date if you prefer to deserialize it directly
  plantId: number;
}

/**
 * Represents the entire sensor data lookup, where keys are plant IDs (as strings)
 * and values are arrays of SensorRecord.
 */
export interface PlantSensorDataLookup {
  [plantId: string]: SensorRecord[];
}
