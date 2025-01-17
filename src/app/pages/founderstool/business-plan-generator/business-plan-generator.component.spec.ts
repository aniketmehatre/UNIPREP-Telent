import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessPlanGeneratorComponent } from './business-plan-generator.component';

describe('BusinessPlanGeneratorComponent', () => {
  let component: BusinessPlanGeneratorComponent;
  let fixture: ComponentFixture<BusinessPlanGeneratorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BusinessPlanGeneratorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BusinessPlanGeneratorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
