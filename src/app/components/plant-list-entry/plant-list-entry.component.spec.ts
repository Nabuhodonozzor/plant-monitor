import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlantListEntryComponent } from './plant-list-entry.component';

describe('PlantListEntryComponent', () => {
  let component: PlantListEntryComponent;
  let fixture: ComponentFixture<PlantListEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlantListEntryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlantListEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
