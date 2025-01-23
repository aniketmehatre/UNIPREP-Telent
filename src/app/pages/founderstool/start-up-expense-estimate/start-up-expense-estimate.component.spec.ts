import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StartUpExpenseEstimateComponent } from './start-up-expense-estimate.component';

describe('StartUpExpenseEstimateComponent', () => {
  let component: StartUpExpenseEstimateComponent;
  let fixture: ComponentFixture<StartUpExpenseEstimateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StartUpExpenseEstimateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StartUpExpenseEstimateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
