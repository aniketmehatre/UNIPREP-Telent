import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CareerplannercountrywiseComponent } from './careerplannercountrywise.component';

describe('CareerplannercountrywiseComponent', () => {
  let component: CareerplannercountrywiseComponent;
  let fixture: ComponentFixture<CareerplannercountrywiseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CareerplannercountrywiseComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CareerplannercountrywiseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
