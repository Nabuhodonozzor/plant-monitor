export class PlantViewModel {
  public PlantId: string;
  public PlantName: string = 'Rozalia';
  public PlantIdealTemp = 25;
  public PlantIdealHum = 50;

  constructor(plantId: string) {
    this.PlantId = plantId;
  }
}
