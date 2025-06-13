import { Routes } from '@angular/router';
import { PlantListComponent } from './components/plant-list/plant-list.component';
import { PlantDataComponent } from './components/plant-data/plant-data.component';

export const routes: Routes = [
  {
    path: '',
    component: PlantListComponent,
  },
  // {
  //   path: 'plant-list',
  //   component: PlantListComponent,
  // },
  {
    path: 'plant' + '/:' + 'plantId',
    component: PlantDataComponent,
  },
];
