import { Component, Input, OnInit } from '@angular/core';
import { CardModule } from 'primeng/card';
import { PlantViewModel } from '../../models/plant-view.model';
import { PlantService } from '../../services/plant.service';

@Component({
  selector: 'app-plant-list-entry',
  imports: [CardModule],
  templateUrl: './plant-list-entry.component.html',
  styleUrl: './plant-list-entry.component.scss',
})
export class PlantListEntryComponent implements OnInit {
  constructor(private plantService: PlantService) {}

  @Input() PlantId: string = '';

  public PlantModel?: PlantViewModel;

  public ngOnInit(): void {
    this.PlantModel = this.plantService.GetPlantData(this.PlantId);

    this.PageLoaded();
  }

  private PageLoaded() {}
}
