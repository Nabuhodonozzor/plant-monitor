import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlantDataComponent } from './plant-data.component';

describe('PlantDataComponent', () => {
  let component: PlantDataComponent;
  let fixture: ComponentFixture<PlantDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlantDataComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlantDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
