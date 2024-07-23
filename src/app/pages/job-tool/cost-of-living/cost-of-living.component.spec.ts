import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CostOfLivingComponent } from './cost-of-living.component';

describe('CostOfLivingComponent', () => {
  let component: CostOfLivingComponent;
  let fixture: ComponentFixture<CostOfLivingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CostOfLivingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CostOfLivingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
