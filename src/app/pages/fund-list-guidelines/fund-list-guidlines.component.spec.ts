import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FundListGuidlinesComponent } from './fund-list-guidlines.component';

describe('FundListGuidlinesComponent', () => {
  let component: FundListGuidlinesComponent;
  let fixture: ComponentFixture<FundListGuidlinesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FundListGuidlinesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FundListGuidlinesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
