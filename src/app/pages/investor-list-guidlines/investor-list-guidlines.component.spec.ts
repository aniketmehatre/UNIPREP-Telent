import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvestorListGuidlinesComponent } from './investor-list-guidlines.component';

describe('InvestorListGuidlinesComponent', () => {
  let component: InvestorListGuidlinesComponent;
  let fixture: ComponentFixture<InvestorListGuidlinesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InvestorListGuidlinesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InvestorListGuidlinesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
