import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CareerGrowthCheckerComponent } from './career-growth-checker.component';

describe('CareerGrowthCheckerComponent', () => {
  let component: CareerGrowthCheckerComponent;
  let fixture: ComponentFixture<CareerGrowthCheckerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CareerGrowthCheckerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CareerGrowthCheckerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
