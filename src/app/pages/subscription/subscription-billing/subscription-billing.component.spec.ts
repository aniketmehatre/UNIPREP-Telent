import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubscriptionBillingComponent } from './subscription-billing.component';

describe('SubscriptionBillingComponent', () => {
  let component: SubscriptionBillingComponent;
  let fixture: ComponentFixture<SubscriptionBillingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubscriptionBillingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubscriptionBillingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
