import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubscriptionDataComponent } from './subscription-data.component';

describe('SubscriptionDataComponent', () => {
  let component: SubscriptionDataComponent;
  let fixture: ComponentFixture<SubscriptionDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubscriptionDataComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubscriptionDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
