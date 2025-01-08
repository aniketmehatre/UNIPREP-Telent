import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CostOfLivingComparisionComponent } from './cost-of-living-comparision.component';

describe('CostOfLivingComparisionComponent', () => {
  let component: CostOfLivingComparisionComponent;
  let fixture: ComponentFixture<CostOfLivingComparisionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CostOfLivingComparisionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CostOfLivingComparisionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
