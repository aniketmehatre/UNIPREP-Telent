import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GovermentFundingOppurtunityComponent } from './goverment-funding-opportunity.component';

describe('GovermentFundingOppurtunityComponent', () => {
  let component: GovermentFundingOppurtunityComponent;
  let fixture: ComponentFixture<GovermentFundingOppurtunityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GovermentFundingOppurtunityComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(GovermentFundingOppurtunityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
