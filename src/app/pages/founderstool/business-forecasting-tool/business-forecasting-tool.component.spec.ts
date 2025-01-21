import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessForecastingToolComponent } from './business-forecasting-tool.component';

describe('BusinessForecastingToolComponent', () => {
  let component: BusinessForecastingToolComponent;
  let fixture: ComponentFixture<BusinessForecastingToolComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BusinessForecastingToolComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BusinessForecastingToolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
