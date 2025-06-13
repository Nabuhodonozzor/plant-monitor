import { Injectable } from '@angular/core';
import { PlantViewModel } from '../models/plant-view.model';

@Injectable({ providedIn: 'root' })
export class PlantService {
  constructor() {}

  public GetPlantListData(): PlantViewModel[] {
    throw Error();
  }

  public GetPlantData(plantId: string): PlantViewModel {
    return new PlantViewModel(plantId);
  }
}
