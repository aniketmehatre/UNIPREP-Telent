import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TravelPackingPlannerComponent } from './travel-packing-planner.component';

describe('TravelPackingPlannerComponent', () => {
  let component: TravelPackingPlannerComponent;
  let fixture: ComponentFixture<TravelPackingPlannerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TravelPackingPlannerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TravelPackingPlannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
