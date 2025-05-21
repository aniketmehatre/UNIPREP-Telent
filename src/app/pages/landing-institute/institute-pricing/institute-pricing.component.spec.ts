import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstitutePricingComponent } from './institute-pricing.component';

describe('InstitutePricingComponent', () => {
  let component: InstitutePricingComponent;
  let fixture: ComponentFixture<InstitutePricingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InstitutePricingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InstitutePricingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
