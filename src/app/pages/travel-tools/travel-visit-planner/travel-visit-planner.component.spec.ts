import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TravelVisitPlannerComponent } from './travel-visit-planner.component';

describe('TravelVisitPlannerComponent', () => {
  let component: TravelVisitPlannerComponent;
  let fixture: ComponentFixture<TravelVisitPlannerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TravelVisitPlannerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TravelVisitPlannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
