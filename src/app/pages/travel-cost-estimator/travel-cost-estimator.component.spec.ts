import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TravelCostEstimatorComponent } from './travel-cost-estimator.component';

describe('TravelCostEstimatorComponent', () => {
  let component: TravelCostEstimatorComponent;
  let fixture: ComponentFixture<TravelCostEstimatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TravelCostEstimatorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TravelCostEstimatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
